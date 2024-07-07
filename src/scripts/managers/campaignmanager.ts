import Act from '../tiles/act'
import Area from '../tiles/area'
import Campaign from '../tiles/campaign'
import CampaignSerializer from '../tiles/campaignserializer'
import Pathfinding from '../tiles/pathfinding'
import TileDrawer from '../tiles/tiledrawer'
import GameObjectSprite from '../tiles/gameobjectsprite'
import Tile from '../tiles/tile'
import TileModule from '../tiles/tilemodule'
import Transition from '../tiles/transition'

export default class CampaignManager {
  private scene: Phaser.Scene;
  private campaign: Campaign;
  private graphics: Phaser.GameObjects.Graphics;
  private tiledrawer: TileDrawer;
  private tileSprites: Map<Tile, GameObjectSprite>;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = this.scene.add.graphics();
    this.tiledrawer = new TileDrawer(this.graphics);
    this.campaign = new Campaign("Default Campaign");
    this.tileSprites = new Map();

    this.scene.cameras.getCamera("uiCamera")!.ignore(this.graphics);
  }

  // TODO: Remove this
  public getCampaign(): Campaign {
    return this.campaign;
  }

  /******************************/
  //        LOAD / SAVE         //
  /******************************/

  public loadCampaign(json: string): void {
    this.campaign = CampaignSerializer.import(json);
    this.loadCurrentArea();
  }

  public loadCurrentArea(): void {
    for (const TILE_SPRITE of this.tileSprites.values())
      TILE_SPRITE.destroy();
    this.tileSprites.clear();

    for (const TILE of this.campaign.currentArea().tileSet.getTiles()) {
      const TILE_SPRITE = new GameObjectSprite(this.scene, TILE).setDepth(-1);
      this.tileSprites.set(TILE, TILE_SPRITE);
      this.scene.cameras.getCamera("uiCamera")!.ignore(TILE_SPRITE);
    }
  }

  /******************************/
  //            ACTS            //
  /******************************/

  public addAct(name: string): void {
    this.campaign.addAct(new Act(name));
    this.loadCurrentArea();
  }

  public deleteCurrentAct(): void {
    this.campaign.deleteCurrentAct();
    this.loadCurrentArea();
  }

  public previousAct(): void {
    this.campaign.previousAct();
    this.loadCurrentArea();
  }

  public nextAct(): void {
    this.campaign.nextAct();
    this.loadCurrentArea();
  }

  public renameAct(name: string): void {
    this.campaign.currentAct().name = name;
  }

  public getActIndex(): number {
    return this.campaign.actIndex;
  }

  public getActAmount(): number {
    return this.campaign.acts.length;
  }

  public getActName(): string {
    return this.campaign.currentAct().name;
  }

  /******************************/
  //           AREAS            //
  /******************************/

  public addArea(name: string): void {
    this.campaign.currentAct().addArea(new Area(name));
    this.loadCurrentArea();
  }

  public deleteCurrentArea(): void {
    this.campaign.currentAct().deleteCurrentArea();
    this.loadCurrentArea();
  }

  public previousArea(): void {
    this.campaign.currentAct().previousArea();
    this.loadCurrentArea();
  }

  public nextArea(): void {
    this.campaign.currentAct().nextArea();
    this.loadCurrentArea();
  }

  public renameArea(name: string): void {
    this.campaign.currentArea().name = name;
  }

  public getAreaIndex(): number {
    return this.campaign.currentAct().areaIndex;
  }

  public getAreaAmount(): number {
    return this.campaign.currentAct().areas.length;
  }

  public getAreaName(): string {
    return this.campaign.currentArea().name;
  }

  /******************************/
  //           TILES            //
  /******************************/

  public getTile(x: number, y: number): Tile | undefined {
    return this.campaign.currentArea().tileSet.getTile(x, y);
  }

  // TODO: Use null instead of undefined
  public getTileFromPixelPosition(pixelX: number, pixelY: number): Tile | undefined {
    const PIXEL_POS = TileModule.getTilePosFromUnitPos(pixelX, pixelY);
    return this.getTile(PIXEL_POS.x, PIXEL_POS.y);
  }

  public addTile(x: number, y: number, bitmap: string, frame: number): void {
    // Overwrite existing tile
    const EXISTING_TILE = this.getTile(x, y);
    if (EXISTING_TILE) {
      const EXISTING_TILE_SPRITE = this.tileSprites.get(EXISTING_TILE);
      if (EXISTING_TILE_SPRITE)
        EXISTING_TILE_SPRITE.destroy();
      else {
        console.log("CampaignManager::addTile - Found tile to overwrite, but not associated tile sprite.");
        return;
      }
    }

    const TILE = this.campaign.currentArea().tileSet.addTile(x, y, bitmap, frame);
    const TILE_SPRITE = new GameObjectSprite(this.scene, TILE).setDepth(-1);
    this.scene.cameras.getCamera("uiCamera")!.ignore(TILE_SPRITE);
    this.tileSprites.set(TILE, TILE_SPRITE);
  }

  public deleteTile(x: number, y: number): void {
    const TILE = this.campaign.currentArea().tileSet.deleteTile(x, y);
    if (TILE) {
      const TILE_SPRITE = this.tileSprites.get(TILE);
      if (TILE_SPRITE)
        TILE_SPRITE.destroy();
      else
        console.error("CampaignManager::deleteTile - Tile to delete has no associated tile sprite.");
      this.tileSprites.delete(TILE);
    }
  }

  /******************************/
  //         TRANSITION         //
  /******************************/

  public transition(t: Transition): boolean {
    const res = this.campaign.currentAct().transition(t.targetArea);
    if (res) this.loadCurrentArea();
    return res;
  }

  /******************************/
  //         DEBUG DRAW         //
  /******************************/

  public drawDebugPoint(pixelX: number, pixelY: number, color: number): void {
    this.graphics.fillStyle(color, 1);
    this.graphics.fillCircle(pixelX, pixelY, 4);
  }

  public drawDebugTile(pixelX: number, pixelY: number, color: number): void {
    const TILE_POS = TileModule.getTilePosFromUnitPos(pixelX, pixelY);
    this.tiledrawer.drawDebugTilePos(TILE_POS.x, TILE_POS.y, color);
  }

  public drawDebugCurrentTileSet(): void {
    this.tiledrawer.drawDebugTileList(this.campaign.currentArea().tileSet.getTiles());
  }

  public drawDebugProximityTiles(pixelX: number, pixelY: number, depth: number): void {
    const TILE_POS = TileModule.getTilePosFromUnitPos(pixelX, pixelY);
    const PROXIMITY_TILES = this.campaign.currentArea().tileSet.getProximityTileList(TILE_POS.x, TILE_POS.y, depth);
    this.tiledrawer.drawDebugTileList(PROXIMITY_TILES);
  }

  public drawDebugProximityTilePos(pixelX: number, pixelY: number, color: number, brushSize: number): void {
    const TILE_POS = TileModule.getTilePosFromUnitPos(pixelX, pixelY);
    const TILES_POS = TileModule.getProximityTilePos(TILE_POS.x, TILE_POS.y, brushSize);
    for (const POS of TILES_POS)
      this.tiledrawer.drawDebugTilePos(POS.x, POS.y, color);
  }

  public drawDebugPathfinding(px1: number, py1: number, px2: number, py2: number): void {
    const TILE_1 = TileModule.getTilePosFromUnitPos(px1, py1);
    const TILE_2 = TileModule.getTilePosFromUnitPos(px2, py2);
    for (const POINT of Pathfinding.findPath(this.campaign.currentArea().tileSet, TILE_1.x, TILE_1.y, TILE_2.x, TILE_2.y))
      this.tiledrawer.drawDebugTilePos(POINT.x, POINT.y, 0x000000);
  }

  public clearDebugTiles(): void {
    this.graphics.clear();
  }
}