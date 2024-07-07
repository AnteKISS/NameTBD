import GameObject from './gameobject';
import GameObjectCollection from './gameObjectCollection';
import Tile from './tile';
import TileModule from './tilemodule';
import TileSet from './tileset';

export default class Area {
  public name: string;
  public gameObjects: Map<string, GameObjectCollection>;
  public tileSet: TileSet;

  public constructor(name: string) {
    this.name = name;
    this.gameObjects = new Map();
    this.tileSet = new TileSet(3);

    // Default area
    const size = 5;
    for (let i = -size; i <= size; i++) {
      for (let j = -size; j <= size; j++) {
        const tile = new Tile(i, j, "rocky_floor_tiles", 8);
        const collection = this.createGameObjectCollection(tile.x, tile.y);
        collection.add(tile);
      }
    }
  }

  public addGameObject(x: number, y: number, gameObject: GameObject): void {
    let collection = this.getGameObjectCollection(x, y);
    if (!collection) collection = this.createGameObjectCollection(x, y);
    collection.add(gameObject);
  }

  public removeGameObject(x: number, y: number): void {
    this.getGameObjectCollection(x, y)?.delete();
  }

  public getProximityTileList(x: number, y: number, proximity: number): Tile[] {
    const tileList: Tile[] = [];
    let tile: Tile | undefined;
    const P2: number = proximity * proximity;

    // Select tiles in a circle, column by column
    // Algorithm used: https://stackoverflow.com/a/14036626
    for (let cx = x - proximity; cx <= x + proximity; cx++) {
      const X2: number = Math.pow((x - cx), 2);
      const Y_DIST: number = Math.floor(Math.sqrt(P2 - X2));
      for (let cy = y - Y_DIST; cy <= y + Y_DIST; cy++) {
        tile = this.getGameObjectCollection(cx, cy)?.get(Tile);
        if (tile) tileList.push(tile);
      }
    }
    return tileList;
  }

  private createGameObjectCollection(x: number, y: number): GameObjectCollection {
    const collection = new GameObjectCollection();
    this.gameObjects.set(TileModule.getTileHash(x, y), collection);
    return collection;
  }

  private getGameObjectCollection(x: number, y: number): GameObjectCollection | undefined {
    return this.gameObjects.get(TileModule.getTileHash(x, y));
  }
}
