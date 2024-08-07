import GameObjectSprite from '../tiles/gameobjectsprite';
import Tab from './tab';
import { WallType } from '../tiles/wall';
import { GameObjectRegistry } from '../tiles/gameObjectRegistry';
import Prop from '../tiles/prop';

export default class GameObjectSelector extends Phaser.GameObjects.Container {
  private static readonly OBJECTS_PER_ROW = 6;
  private static readonly OBJECT_SPACING = 100;

  public static readonly TILES_TAB_KEY = "Tile";
  public static readonly WALLS_TAB_KEY = "Wall";
  public static readonly SPAWNERS_TAB_KEY = "Spawner";
  public static readonly PROPS_TAB_KEY = "Prop";

  private gameObjectSpriteLists: Map<string, Array<any>>;
  private row: number;
  private selectedTab: string;
  private selectedObjectTab: string;
  private selectedObjectIndex: number;

  private outline: Phaser.GameObjects.Rectangle;
  private background: Phaser.GameObjects.Rectangle;
  private leftArrow: Phaser.GameObjects.Sprite;
  private rightArrow: Phaser.GameObjects.Sprite;
  private selectedObjectGlow: Phaser.GameObjects.Sprite;
  private tabs: Array<Tab>;
  private tiles: Array<Phaser.GameObjects.Sprite>;

  constructor(scene: Phaser.Scene) {
    super(scene, 640, 640);
    this.row = 0;
    this.selectedTab = GameObjectSelector.TILES_TAB_KEY;
    this.selectedObjectTab = this.selectedTab;
    this.selectedObjectIndex = 0;
    this.gameObjectSpriteLists = new Map();

    this.setupTileSprites([
      ['rocky_floor_tiles', 15],
      ['dirt_tiles', 5],
      ['wood_tiles', 9]
    ]);
    this.setupWallSprites([
      ['flat_stone_walls', 24],
      ['brick_walls', 24]
    ]);
    this.setupSpawnerSprites();
    this.setupPropSprites();
    this.setupTabs();

    this.scene = scene;
    this.outline = this.scene.add.rectangle(0, 0, 810, 110, 0xFFFFFF);
    this.background = this.scene.add.rectangle(0, 0, 800, 100, 0x222222);
    this.leftArrow = this.scene.add.sprite(55 - this.background.width / 2, 0, 'arrowLeft').setInteractive();
    this.rightArrow = this.scene.add.sprite(this.background.width / 2 - 55, 0, 'arrowRight').setInteractive();
    this.selectedObjectGlow = this.scene.add.sprite(0, 0, 'whiteGlow').setScale(0.2).setAlpha(0.5);
    this.tiles = [];

    this.leftArrow.on('pointerdown', () => this.previousRow());
    this.rightArrow.on('pointerdown', () => this.nextRow());

    this.add([this.outline, this.background, ...this.tabs, this.leftArrow, this.rightArrow, this.selectedObjectGlow]);
    this.scene.add.existing(this);

    this.updateDisplayObjects();
  }

  private setupTileSprites(bitmapsArray: Array<[string, number]>) {
    const SPRITE_ARRAY = new Array<any>;

    for (const BITMAP of bitmapsArray)
      for (let i = 0; i < BITMAP[1]; i++)
        SPRITE_ARRAY.push(["Tile", BITMAP[0], i]);

    this.gameObjectSpriteLists.set(GameObjectSelector.TILES_TAB_KEY, SPRITE_ARRAY);
  }

  private setupWallSprites(sourceArray: Array<[string, number]>) {
    const SPRITE_ARRAY = new Array<any>;
    console.log(sourceArray);

    for (const BITMAP of sourceArray)
      for (let i = 0; i < BITMAP[1]; i++)
        SPRITE_ARRAY.push(["Wall", BITMAP[0], i, i % 2 ? WallType.Right : WallType.Left]);

    this.gameObjectSpriteLists.set(GameObjectSelector.WALLS_TAB_KEY, SPRITE_ARRAY);
  }

  private setupSpawnerSprites() {
    this.gameObjectSpriteLists.set(GameObjectSelector.SPAWNERS_TAB_KEY, [
      ["Spawner", "basic_spawner", "zombie_0", 5, 5]
    ]);
  }

  private setupPropSprites() {
    this.gameObjectSpriteLists.set(GameObjectSelector.PROPS_TAB_KEY, [
      ["Prop", "pine_none01", false],
      ["Prop", "pine_none05", false],
      ["Prop", "pine_none06", false],
      ["Prop", "pine_none08", false],
      ["Prop", "pine_half03", false],
      ["Prop", "pine_half05", false],
      ["Prop", "pine_half06", false],
      ["Prop", "grasses01", true],
      ["Prop", "cactus01", true],
      ["Prop", "cactus04", true],
      ["Prop", "shrub2_03", true],
      ["Prop", "shrub2_04", true],
      ["Prop", "big_rock01", false],
      ["Prop", "big_rock02", false],
      ["Prop", "cart", false],
    ]);
  }

  private setupTabs() {
    this.tabs = [];

    const TILES_TAB = new Tab(this.scene, -175, -34, 100, 25, "Tiles");
    TILES_TAB.setOnPointerDown(() => this.changeTab(GameObjectSelector.TILES_TAB_KEY));
    this.tabs.push(TILES_TAB);

    const WALLS_TAB = new Tab(this.scene, -125, -34, 100, 25, "Walls");
    WALLS_TAB.setOnPointerDown(() => this.changeTab(GameObjectSelector.WALLS_TAB_KEY));
    this.tabs.push(WALLS_TAB);

    const SPAWNERS_TAB = new Tab(this.scene, -75, -34, 100, 25, "Spawners");
    SPAWNERS_TAB.setOnPointerDown(() => this.changeTab(GameObjectSelector.SPAWNERS_TAB_KEY));
    this.tabs.push(SPAWNERS_TAB);

    const PROPS_TAB = new Tab(this.scene, -25, -34, 100, 24, "Props");
    PROPS_TAB.setOnPointerDown(() => this.changeTab(GameObjectSelector.PROPS_TAB_KEY));
    this.tabs.push(PROPS_TAB);
  }

  private changeTab(tabKey: string): void {
    this.selectedTab = tabKey;
    this.row = 0;
    this.updateDisplayObjects();
  }

  public getCurrentTab(): string {
    return this.selectedObjectTab;
  }

  public previousRow() {
    this.row--;
    if (this.row < 0)
      this.row = Math.floor((this.gameObjectSpriteLists.get(this.selectedTab)!.length - 1) / GameObjectSelector.OBJECTS_PER_ROW);
    this.updateDisplayObjects();
  }

  public nextRow() {
    this.row++;
    if (this.row * GameObjectSelector.OBJECTS_PER_ROW >= this.gameObjectSpriteLists.get(this.selectedTab)!.length)
      this.row = 0;
    this.updateDisplayObjects();
  }

  public getSelectedGameObject(x: number, y: number) {
    const ARGS = this.gameObjectSpriteLists.get(this.selectedTab)![this.selectedObjectIndex];
    const GameObjectClass = GameObjectRegistry[ARGS[0]];
    return new GameObjectClass(x, y, ...ARGS.slice(1));
  }

  private updateDisplayObjects() {
    this.selectedObjectGlow.setVisible(false);

    for (const OBJECT of this.tiles)
      OBJECT.destroy();

    this.tiles = [];

    for (let i = 0; i < GameObjectSelector.OBJECTS_PER_ROW; i++) {
      const SPRITE_INDEX = this.row * GameObjectSelector.OBJECTS_PER_ROW + i;

      if (SPRITE_INDEX >= this.gameObjectSpriteLists.get(this.selectedTab)!.length)
        return;

      const X = (i * GameObjectSelector.OBJECT_SPACING) - (GameObjectSelector.OBJECT_SPACING * GameObjectSelector.OBJECTS_PER_ROW / 2) + (GameObjectSelector.OBJECT_SPACING / 2);
      const OBJECT_SPRITE_INFO = this.gameObjectSpriteLists.get(this.selectedTab)![SPRITE_INDEX];
      const OBJECT = this.scene.add.sprite(X, 0, OBJECT_SPRITE_INFO[1], OBJECT_SPRITE_INFO[2])
        .setInteractive();

      OBJECT.setScale(GameObjectSprite.getSpriteScale(this.selectedTab, OBJECT) / 2);

      if (this.selectedTab === GameObjectSelector.PROPS_TAB_KEY)
        OBJECT.setOrigin(0.5, 0.7);

      OBJECT.on('pointerdown', () => {
        this.selectedObjectTab = this.selectedTab;
        this.selectedObjectIndex = SPRITE_INDEX;
        this.selectedObjectGlow.setPosition(X, 0);
        this.selectedObjectGlow.setVisible(true);
      });

      if (SPRITE_INDEX == this.selectedObjectIndex && this.selectedTab === this.selectedObjectTab) {
        this.selectedObjectGlow.setPosition(X, 0);
        this.selectedObjectGlow.setVisible(true);
      }

      this.tiles.push(OBJECT);
      this.add(OBJECT);
    }
  }
}
