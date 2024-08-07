import 'phaser'
import Tile from '../tiles/tile'
import { TileColor } from '../tiles/tiledrawer'
import TileModule from '../tiles/tilemodule'
import CampaignManager from '../managers/campaignmanager'
import CampaignSerializer from '../tiles/campaignserializer'
import TextInput from '../editor/textInput'
import TransitionForm from '../editor/transitionform'
import ConfigureTileForm from '../editor/configuretileform'
import DeleteTransitionForm from '../editor/deletetransitionform'
import GameObjectSelector from '../editor/gameObjectSelector'
import Point from '../types/point'
import ConfigureSpawnerForm from '../editor/configureSpawnerForm'
import Spawner from '../tiles/spawner'

enum TileMode {
  Add = "Add",
  Delete = "Delete",
  Configure = "Configure",
}

enum SwipeMode {
  On = "On",
  Off = "Off"
}

export default class MapEditor extends Phaser.Scene {
  private static readonly MOVE_CAMERA_SPEED = 10;
  private static readonly MOVE_CAMERA_FASTER_MULTIPLIER = 2;
  private static readonly ZOOM_SPEED = 1;
  private static readonly MIN_ZOOM = 0.2;
  private static readonly MAX_ZOOM = 2;
  private static readonly MIN_BRUSH_SIZE = 0;
  private static readonly MAX_BRUSH_SIZE = 5;

  // Phaser refs/objects
  private pointer: Phaser.Input.Pointer;
  private centerPoint: Point;
  private uiCamera: Phaser.Cameras.Scene2D.Camera;

  // Editor data / helpers
  private playerPos: Point;
  private cameraOffsetPos: Point;
  private cursorUnitPos: Point;
  private cursorTilePos: Point;
  private brushSize: number;
  private showDebugTiles: boolean;

  // Editor states
  private tileMode: TileMode;
  private swipeMode: SwipeMode;
  private canPlaceObject: boolean;
  private inMenu: boolean;

  // Texts
  private moveText: Phaser.GameObjects.Text;
  private moveFasterText: Phaser.GameObjects.Text;
  private tileModeText: Phaser.GameObjects.Text;
  private addText: Phaser.GameObjects.Text;
  private deleteText: Phaser.GameObjects.Text;
  private configureText: Phaser.GameObjects.Text;
  private swipeText: Phaser.GameObjects.Text;
  private brushSizeText: Phaser.GameObjects.Text;
  private zoomText: Phaser.GameObjects.Text;
  private changeAreaText: Phaser.GameObjects.Text;
  private renameAreaText: Phaser.GameObjects.Text;
  private newAreaText: Phaser.GameObjects.Text;
  private deleteAreaText: Phaser.GameObjects.Text;
  private changeActText: Phaser.GameObjects.Text;
  private renameActText: Phaser.GameObjects.Text;
  private newActText: Phaser.GameObjects.Text;
  private deleteActText: Phaser.GameObjects.Text;
  private createTransitionText: Phaser.GameObjects.Text;
  private deleteTransitionText: Phaser.GameObjects.Text;
  private toggleDebugTiles: Phaser.GameObjects.Text;
  private quitText: Phaser.GameObjects.Text;
  private unitPosText: Phaser.GameObjects.Text;
  private tilePosText: Phaser.GameObjects.Text;
  private currentActText: Phaser.GameObjects.Text;
  private currentAreaText: Phaser.GameObjects.Text;

  // Forms
  private renameActInput: TextInput;
  private renameAreaInput: TextInput;
  private transitionForm: TransitionForm;
  private configureTileForm: ConfigureTileForm;
  private deleteTransitionForm: DeleteTransitionForm;
  private gameObjectSelector: GameObjectSelector;
  private configureSpawnerForm: ConfigureSpawnerForm;

  // Input keys
  private aKey: Phaser.Input.Keyboard.Key; // Move left
  private dKey: Phaser.Input.Keyboard.Key; // Move right
  private sKey: Phaser.Input.Keyboard.Key; // Move down
  private wKey: Phaser.Input.Keyboard.Key; // Move up
  private shiftKey: Phaser.Input.Keyboard.Key; // Move faster

  constructor() {
    super({ key: 'MapEditor' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#02563F');
    this.uiCamera = this.cameras.add(0, 0, 1280, 720);
    this.uiCamera.setName('uiCamera');

    this.pointer = this.input.activePointer;
    this.centerPoint = new Point(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2
    );

    CampaignManager.init(this);
    CampaignManager.getInstance().setVisibleEditorSprites(true);
    CampaignManager.getInstance().loadCampaign('{"name":"Default Campaign","acts":[{"name":"New Act","areas":[{"name":"Default","gameObjects":[["Tile",7,-6,"dirt_tiles",1,""],["Tile",8,-9,"dirt_tiles",1,""],["Tile",8,-8,"dirt_tiles",1,""],["Tile",8,-7,"dirt_tiles",1,""],["Tile",8,-6,"dirt_tiles",1,""],["Prop",8,-6,"pine_none08",false],["Tile",8,-5,"dirt_tiles",1,""],["Tile",8,-4,"dirt_tiles",1,""],["Tile",8,-3,"dirt_tiles",1,""],["Tile",9,-10,"dirt_tiles",1,""],["Tile",9,-9,"dirt_tiles",1,""],["Tile",9,-8,"dirt_tiles",1,""],["Prop",9,-8,"pine_none08",false],["Tile",9,-7,"dirt_tiles",1,""],["Tile",9,-6,"dirt_tiles",1,""],["Prop",9,-6,"pine_none06",false],["Tile",9,-5,"dirt_tiles",1,""],["Tile",9,-4,"dirt_tiles",1,""],["Tile",9,-3,"dirt_tiles",1,""],["Tile",9,-2,"dirt_tiles",1,""],["Tile",10,-10,"dirt_tiles",1,""],["Tile",10,-9,"dirt_tiles",1,""],["Tile",10,-8,"dirt_tiles",1,""],["Tile",10,-7,"dirt_tiles",1,""],["Prop",10,-7,"pine_none01",false],["Tile",10,-6,"dirt_tiles",1,""],["Tile",10,-5,"dirt_tiles",1,""],["Tile",10,-4,"dirt_tiles",1,""],["Tile",10,-3,"dirt_tiles",1,""],["Tile",10,-2,"dirt_tiles",1,""],["Tile",11,-10,"dirt_tiles",1,""],["Tile",11,-9,"dirt_tiles",1,""],["Tile",11,-8,"dirt_tiles",1,""],["Tile",11,-7,"dirt_tiles",1,""],["Tile",11,-6,"dirt_tiles",1,""],["Tile",11,-5,"dirt_tiles",1,""],["Tile",11,-4,"dirt_tiles",1,""],["Tile",11,-3,"dirt_tiles",1,""],["Tile",11,-2,"dirt_tiles",1,""],["Tile",12,-11,"dirt_tiles",1,""],["Tile",12,-10,"dirt_tiles",1,""],["Tile",12,-9,"dirt_tiles",1,""],["Tile",12,-8,"dirt_tiles",1,""],["Tile",12,-7,"dirt_tiles",1,""],["Tile",12,-6,"dirt_tiles",1,""],["Tile",12,-5,"dirt_tiles",1,""],["Tile",12,-4,"dirt_tiles",1,""],["Tile",12,-3,"dirt_tiles",1,""],["Tile",12,-2,"dirt_tiles",1,""],["Tile",12,-1,"dirt_tiles",1,""],["Tile",13,-10,"dirt_tiles",1,""],["Tile",13,-9,"dirt_tiles",1,""],["Tile",13,-8,"dirt_tiles",1,""],["Tile",13,-7,"dirt_tiles",1,""],["Tile",13,-6,"dirt_tiles",1,""],["Tile",13,-5,"dirt_tiles",1,""],["Tile",13,-4,"dirt_tiles",1,""],["Tile",13,-3,"dirt_tiles",1,""],["Tile",13,-2,"dirt_tiles",1,""],["Tile",14,-10,"dirt_tiles",1,""],["Tile",14,-9,"dirt_tiles",1,""],["Tile",14,-8,"dirt_tiles",1,""],["Tile",14,-7,"dirt_tiles",1,""],["Tile",14,-6,"dirt_tiles",1,""],["Prop",14,-6,"pine_none01",false],["Tile",14,-5,"dirt_tiles",1,""],["Tile",14,-4,"dirt_tiles",1,""],["Tile",14,-3,"dirt_tiles",1,""],["Tile",14,-2,"dirt_tiles",1,""],["Tile",15,-10,"dirt_tiles",1,""],["Tile",15,-9,"dirt_tiles",1,""],["Tile",15,-8,"dirt_tiles",1,""],["Tile",15,-7,"dirt_tiles",1,""],["Prop",15,-7,"pine_none01",false],["Tile",15,-6,"dirt_tiles",1,""],["Prop",15,-6,"pine_none05",false],["Tile",15,-5,"dirt_tiles",1,""],["Tile",15,-4,"dirt_tiles",1,""],["Tile",15,-3,"dirt_tiles",1,""],["Tile",15,-2,"dirt_tiles",1,""],["Tile",16,-9,"dirt_tiles",1,""],["Tile",16,-8,"dirt_tiles",1,""],["Tile",16,-7,"dirt_tiles",1,""],["Tile",16,-6,"dirt_tiles",1,""],["Tile",16,-5,"dirt_tiles",1,""],["Tile",16,-4,"dirt_tiles",1,""],["Tile",16,-3,"dirt_tiles",1,""],["Tile",17,-6,"dirt_tiles",1,""],["Tile",7,-5,"dirt_tiles",1,""],["Tile",8,-2,"dirt_tiles",1,""],["Tile",9,-1,"dirt_tiles",1,""],["Tile",10,-1,"dirt_tiles",1,""],["Tile",11,-1,"dirt_tiles",1,""],["Tile",12,0,"rocky_floor_tiles",12,""],["Tile",13,-1,"dirt_tiles",1,""],["Tile",14,-1,"rocky_floor_tiles",12,""],["Tile",15,-1,"rocky_floor_tiles",12,""],["Tile",16,-2,"dirt_tiles",1,""],["Tile",17,-5,"dirt_tiles",1,""],["Tile",6,-5,"dirt_tiles",1,""],["Tile",7,-8,"dirt_tiles",1,""],["Tile",7,-7,"dirt_tiles",1,""],["Tile",7,-4,"dirt_tiles",1,""],["Tile",7,-3,"dirt_tiles",1,""],["Tile",7,-2,"dirt_tiles",1,""],["Tile",8,-1,"dirt_tiles",1,""],["Tile",11,0,"dirt_tiles",1,""],["Tile",6,-4,"dirt_tiles",1,""],["Tile",7,-1,"dirt_tiles",1,""],["Tile",8,0,"dirt_tiles",1,""],["Tile",9,0,"dirt_tiles",1,""],["Tile",10,0,"dirt_tiles",1,""],["Tile",11,1,"rocky_floor_tiles",12,""],["Tile",13,0,"rocky_floor_tiles",12,""],["Tile",14,0,"rocky_floor_tiles",12,""],["Tile",5,-4,"dirt_tiles",1,""],["Tile",6,-7,"dirt_tiles",1,""],["Tile",6,-6,"dirt_tiles",1,""],["Tile",6,-3,"dirt_tiles",1,""],["Tile",6,-2,"dirt_tiles",1,""],["Tile",6,-1,"dirt_tiles",1,""],["Tile",7,0,"dirt_tiles",1,""],["Tile",10,1,"rocky_floor_tiles",12,""],["Tile",5,-3,"dirt_tiles",1,""],["Tile",6,0,"dirt_tiles",1,""],["Tile",7,1,"dirt_tiles",1,""],["Tile",8,1,"dirt_tiles",1,""],["Tile",9,1,"rocky_floor_tiles",12,""],["Tile",10,2,"rocky_floor_tiles",12,""],["Tile",12,1,"rocky_floor_tiles",12,""],["Tile",13,1,"rocky_floor_tiles",12,""],["Tile",4,-3,"dirt_tiles",1,""],["Tile",5,-6,"dirt_tiles",1,""],["Tile",5,-5,"dirt_tiles",1,""],["Tile",5,-2,"dirt_tiles",1,""],["Tile",5,-1,"dirt_tiles",1,""],["Tile",5,0,"dirt_tiles",1,""],["Tile",6,1,"dirt_tiles",1,""],["Tile",9,2,"rocky_floor_tiles",12,""],["Tile",4,-2,"dirt_tiles",1,""],["Tile",5,1,"dirt_tiles",1,""],["Tile",6,2,"dirt_tiles",1,""],["Tile",7,2,"rocky_floor_tiles",12,""],["Tile",8,2,"rocky_floor_tiles",12,""],["Tile",9,3,"rocky_floor_tiles",12,""],["Tile",11,2,"rocky_floor_tiles",12,""],["Tile",12,2,"rocky_floor_tiles",12,""],["Tile",3,-2,"dirt_tiles",1,""],["Tile",4,-5,"dirt_tiles",1,""],["Tile",4,-4,"dirt_tiles",1,""],["Tile",4,-1,"dirt_tiles",1,""],["Tile",4,0,"dirt_tiles",1,""],["Tile",4,1,"dirt_tiles",1,""],["Tile",5,2,"dirt_tiles",1,""],["Tile",8,3,"rocky_floor_tiles",12,""],["Tile",2,-2,"dirt_tiles",1,""],["Tile",3,-5,"dirt_tiles",1,""],["Tile",3,-4,"dirt_tiles",1,""],["Tile",3,-3,"dirt_tiles",1,""],["Tile",3,-1,"dirt_tiles",1,""],["Tile",3,0,"dirt_tiles",1,""],["Tile",3,1,"dirt_tiles",1,""],["Tile",4,-6,"dirt_tiles",1,""],["Tile",4,2,"dirt_tiles",1,""],["Tile",7,3,"rocky_floor_tiles",12,""],["Tile",2,-1,"dirt_tiles",1,""],["Tile",3,2,"dirt_tiles",1,""],["Tile",4,3,"rocky_floor_tiles",12,""],["Tile",5,3,"rocky_floor_tiles",12,""],["Tile",6,3,"rocky_floor_tiles",12,""],["Tile",7,4,"rocky_floor_tiles",12,""],["Tile",10,3,"rocky_floor_tiles",12,""],["Tile",1,-1,"dirt_tiles",1,""],["Tile",2,-4,"dirt_tiles",1,""],["Tile",2,-3,"dirt_tiles",1,""],["Tile",2,0,"dirt_tiles",1,""],["Tile",2,1,"dirt_tiles",1,""],["Tile",2,2,"dirt_tiles",1,""],["Tile",3,3,"rocky_floor_tiles",12,""],["Tile",6,4,"rocky_floor_tiles",12,""],["Tile",0,-1,"dirt_tiles",1,""],["Tile",1,-4,"dirt_tiles",1,""],["Tile",1,-3,"dirt_tiles",1,""],["Tile",1,-2,"dirt_tiles",1,""],["Tile",1,0,"dirt_tiles",1,""],["Tile",1,1,"dirt_tiles",1,""],["Tile",1,2,"dirt_tiles",1,""],["Tile",2,-5,"dirt_tiles",1,""],["Tile",2,3,"dirt_tiles",1,""],["Tile",5,4,"rocky_floor_tiles",12,""],["Tile",-1,-1,"dirt_tiles",1,""],["Tile",0,-4,"dirt_tiles",1,""],["Tile",0,-3,"dirt_tiles",1,""],["Tile",0,-2,"dirt_tiles",1,""],["Tile",0,0,"dirt_tiles",1,""],["Tile",0,1,"dirt_tiles",1,""],["Tile",0,2,"dirt_tiles",1,""],["Tile",1,-5,"dirt_tiles",1,""],["Tile",1,3,"dirt_tiles",1,""],["Tile",4,4,"rocky_floor_tiles",12,""],["Tile",-2,-1,"dirt_tiles",1,""],["Tile",-1,-4,"dirt_tiles",1,""],["Tile",-1,-3,"dirt_tiles",1,""],["Tile",-1,-2,"dirt_tiles",1,""],["Tile",-1,0,"dirt_tiles",1,""],["Tile",-1,1,"dirt_tiles",1,""],["Tile",-1,2,"dirt_tiles",1,""],["Tile",0,-5,"dirt_tiles",1,""],["Tile",0,3,"dirt_tiles",1,""],["Tile",3,-6,"dirt_tiles",1,""],["Tile",3,4,"rocky_floor_tiles",12,""],["Tile",-3,-1,"dirt_tiles",1,""],["Tile",-2,-4,"dirt_tiles",1,""],["Tile",-2,-3,"dirt_tiles",1,""],["Tile",-2,-2,"dirt_tiles",1,""],["Prop",-2,-2,"pine_none01",false],["Tile",-2,0,"dirt_tiles",1,""],["Tile",-2,1,"dirt_tiles",1,""],["Tile",-2,2,"dirt_tiles",1,""],["Tile",-1,-5,"dirt_tiles",1,""],["Tile",-1,3,"dirt_tiles",1,""],["Tile",2,-6,"dirt_tiles",1,""],["Tile",2,4,"rocky_floor_tiles",12,""],["Tile",-4,-1,"dirt_tiles",1,""],["Tile",-3,-4,"dirt_tiles",1,""],["Tile",-3,-3,"dirt_tiles",1,""],["Tile",-3,-2,"dirt_tiles",1,""],["Tile",-3,0,"dirt_tiles",1,""],["Tile",-3,1,"dirt_tiles",1,""],["Tile",-3,2,"dirt_tiles",1,""],["Tile",-2,-5,"dirt_tiles",1,""],["Tile",-2,3,"dirt_tiles",1,""],["Tile",1,-6,"dirt_tiles",1,""],["Tile",1,4,"rocky_floor_tiles",12,""],["Tile",-5,-1,"dirt_tiles",1,""],["Tile",-4,-4,"dirt_tiles",1,""],["Tile",-4,-3,"dirt_tiles",1,""],["Tile",-4,-2,"dirt_tiles",1,""],["Tile",-4,0,"dirt_tiles",1,""],["Tile",-4,1,"dirt_tiles",1,""],["Tile",-4,2,"dirt_tiles",1,""],["Tile",-3,-5,"dirt_tiles",1,""],["Tile",-3,3,"rocky_floor_tiles",12,""],["Tile",0,-6,"dirt_tiles",1,""],["Tile",0,4,"rocky_floor_tiles",12,""],["Tile",-6,-2,"dirt_tiles",1,""],["Tile",-5,-5,"dirt_tiles",1,""],["Tile",-5,-4,"dirt_tiles",1,""],["Tile",-5,-3,"dirt_tiles",1,""],["Tile",-5,-2,"dirt_tiles",1,""],["Tile",-5,0,"dirt_tiles",1,""],["Tile",-5,1,"dirt_tiles",1,""],["Tile",-4,-6,"dirt_tiles",1,""],["Tile",-4,-5,"dirt_tiles",1,""],["Tile",-3,-6,"dirt_tiles",1,""],["Tile",-2,-6,"dirt_tiles",1,""],["Tile",-1,-7,"dirt_tiles",1,""],["Tile",-1,-6,"dirt_tiles",1,""],["Tile",-7,-2,"dirt_tiles",1,""],["Tile",-6,-5,"dirt_tiles",1,""],["Tile",-6,-4,"dirt_tiles",1,""],["Tile",-6,-3,"dirt_tiles",1,""],["Tile",-6,-1,"dirt_tiles",1,""],["Tile",-6,0,"dirt_tiles",1,""],["Tile",-6,1,"dirt_tiles",1,""],["Tile",-5,-6,"dirt_tiles",1,""],["Tile",-5,2,"dirt_tiles",1,""],["Tile",-2,-7,"dirt_tiles",1,""],["Tile",-8,-3,"dirt_tiles",1,""],["Tile",-7,-6,"dirt_tiles",1,""],["Tile",-7,-5,"dirt_tiles",1,""],["Tile",-7,-4,"dirt_tiles",1,""],["Tile",-7,-3,"dirt_tiles",1,""],["Tile",-7,-1,"dirt_tiles",1,""],["Tile",-7,0,"dirt_tiles",1,""],["Tile",-6,-7,"dirt_tiles",1,""],["Prop",-6,-7,"pine_none06",false],["Tile",-6,-6,"dirt_tiles",1,""],["Prop",-6,-6,"pine_none08",false],["Tile",-5,-7,"dirt_tiles",1,""],["Prop",-5,-7,"pine_none05",false],["Tile",-4,-7,"dirt_tiles",1,""],["Tile",-3,-8,"dirt_tiles",1,""],["Tile",-3,-7,"dirt_tiles",1,""],["Tile",0,-7,"dirt_tiles",1,""],["Tile",-9,-4,"dirt_tiles",1,""],["Tile",-8,-7,"dirt_tiles",1,""],["Tile",-8,-6,"dirt_tiles",1,""],["Tile",-8,-5,"dirt_tiles",1,""],["Tile",-8,-4,"dirt_tiles",1,""],["Tile",-8,-2,"dirt_tiles",1,""],["Tile",-8,-1,"dirt_tiles",1,""],["Tile",-7,-8,"dirt_tiles",1,""],["Tile",-7,-7,"dirt_tiles",1,""],["Tile",-6,-8,"dirt_tiles",1,""],["Tile",-5,-8,"dirt_tiles",1,""],["Tile",-4,-9,"dirt_tiles",1,""],["Tile",-4,-8,"dirt_tiles",1,""],["Tile",-2,-8,"dirt_tiles",1,""],["Tile",-1,-8,"dirt_tiles",1,""],["Tile",-10,-4,"dirt_tiles",1,""],["Tile",-9,-7,"dirt_tiles",1,""],["Tile",-9,-6,"dirt_tiles",1,""],["Tile",-9,-5,"dirt_tiles",1,""],["Tile",-9,-3,"dirt_tiles",1,""],["Tile",-9,-2,"dirt_tiles",1,""],["Tile",-9,-1,"dirt_tiles",1,""],["Tile",-8,-8,"dirt_tiles",1,""],["Tile",-8,0,"dirt_tiles",1,""],["Tile",-5,-9,"dirt_tiles",1,""],["Tile",-12,-4,"dirt_tiles",1,""],["Tile",-11,-7,"dirt_tiles",1,""],["Tile",-11,-6,"dirt_tiles",1,""],["Tile",-11,-5,"dirt_tiles",1,""],["Tile",-11,-4,"dirt_tiles",1,""],["Tile",-11,-3,"dirt_tiles",1,""],["Tile",-11,-2,"dirt_tiles",1,""],["Tile",-11,-1,"dirt_tiles",1,""],["Tile",-10,-8,"dirt_tiles",1,""],["Tile",-10,-7,"dirt_tiles",1,""],["Tile",-10,-6,"dirt_tiles",1,""],["Tile",-10,-5,"dirt_tiles",1,""],["Tile",-10,-3,"dirt_tiles",1,""],["Tile",-10,-2,"dirt_tiles",1,""],["Tile",-10,-1,"dirt_tiles",1,""],["Tile",-10,0,"dirt_tiles",1,""],["Tile",-9,-8,"dirt_tiles",1,""],["Tile",-9,0,"dirt_tiles",1,""],["Tile",-7,-9,"dirt_tiles",1,""],["Tile",-7,1,"dirt_tiles",1,""],["Tile",-13,-4,"dirt_tiles",1,""],["Tile",-12,-7,"dirt_tiles",1,""],["Tile",-12,-6,"dirt_tiles",1,""],["Tile",-12,-5,"dirt_tiles",1,""],["Tile",-12,-3,"dirt_tiles",1,""],["Tile",-12,-2,"dirt_tiles",1,""],["Tile",-12,-1,"dirt_tiles",1,""],["Tile",-11,-8,"dirt_tiles",1,""],["Tile",-11,0,"dirt_tiles",1,""],["Tile",-8,-9,"dirt_tiles",1,""],["Tile",-8,1,"dirt_tiles",1,""],["Tile",-14,-4,"dirt_tiles",1,""],["Tile",-13,-7,"dirt_tiles",1,""],["Tile",-13,-6,"dirt_tiles",1,""],["Tile",-13,-5,"dirt_tiles",1,""],["Tile",-13,-3,"dirt_tiles",1,""],["Tile",-13,-2,"dirt_tiles",1,""],["Tile",-13,-1,"dirt_tiles",1,""],["Tile",-12,-8,"dirt_tiles",1,""],["Tile",-12,0,"dirt_tiles",1,""],["Tile",-9,-9,"dirt_tiles",1,""],["Tile",-9,1,"dirt_tiles",1,""],["Tile",-15,-4,"dirt_tiles",1,""],["Tile",-14,-7,"dirt_tiles",1,""],["Tile",-14,-6,"dirt_tiles",1,""],["Tile",-14,-5,"dirt_tiles",1,""],["Tile",-14,-3,"dirt_tiles",1,""],["Tile",-14,-2,"dirt_tiles",1,""],["Prop",-14,-2,"pine_none08",false],["Tile",-14,-1,"dirt_tiles",1,""],["Tile",-13,-8,"dirt_tiles",1,""],["Tile",-13,0,"dirt_tiles",1,""],["Tile",-10,-9,"dirt_tiles",1,""],["Tile",-10,1,"dirt_tiles",1,""],["Tile",-16,-4,"dirt_tiles",1,""],["Tile",-15,-7,"dirt_tiles",1,""],["Tile",-15,-6,"dirt_tiles",1,""],["Tile",-15,-5,"dirt_tiles",1,""],["Tile",-15,-3,"dirt_tiles",1,""],["Tile",-15,-2,"dirt_tiles",1,""],["Prop",-15,-2,"pine_none06",false],["Tile",-15,-1,"dirt_tiles",1,""],["Tile",-14,-8,"dirt_tiles",1,""],["Tile",-14,0,"dirt_tiles",1,""],["Tile",-11,-9,"dirt_tiles",1,""],["Tile",-11,1,"dirt_tiles",1,""],["Tile",-17,-3,"dirt_tiles",1,""],["Tile",-16,-6,"dirt_tiles",1,""],["Tile",-16,-5,"dirt_tiles",1,""],["Tile",-16,-3,"dirt_tiles",1,""],["Tile",-16,-2,"dirt_tiles",1,""],["Tile",-16,-1,"dirt_tiles",1,""],["Tile",-16,0,"dirt_tiles",1,""],["Tile",-15,0,"dirt_tiles",1,""],["Tile",-15,1,"dirt_tiles",1,""],["Tile",-14,1,"dirt_tiles",1,""],["Tile",-13,1,"dirt_tiles",1,""],["Tile",-12,1,"dirt_tiles",1,""],["Tile",-12,2,"rocky_floor_tiles",12,""],["Tile",-18,-3,"dirt_tiles",1,""],["Tile",-17,-6,"dirt_tiles",1,""],["Tile",-17,-5,"dirt_tiles",1,""],["Tile",-17,-4,"dirt_tiles",1,""],["Tile",-17,-2,"dirt_tiles",1,""],["Tile",-17,-1,"dirt_tiles",1,""],["Tile",-17,0,"dirt_tiles",1,""],["Tile",-16,-7,"dirt_tiles",1,""],["Tile",-16,1,"dirt_tiles",1,""],["Tile",-13,2,"rocky_floor_tiles",12,""],["Tile",-19,-3,"dirt_tiles",1,""],["Tile",-18,-6,"dirt_tiles",1,""],["Tile",-18,-5,"dirt_tiles",1,""],["Tile",-18,-4,"dirt_tiles",1,""],["Tile",-18,-2,"dirt_tiles",1,""],["Tile",-18,-1,"dirt_tiles",1,""],["Tile",-18,0,"dirt_tiles",1,""],["Tile",-17,-7,"dirt_tiles",1,""],["Tile",-17,1,"dirt_tiles",1,""],["Tile",-14,2,"rocky_floor_tiles",12,""],["Tile",-19,-2,"dirt_tiles",1,""],["Tile",-18,1,"dirt_tiles",1,""],["Tile",-17,2,"rocky_floor_tiles",12,""],["Tile",-16,2,"rocky_floor_tiles",12,""],["Tile",-15,2,"rocky_floor_tiles",12,""],["Tile",-14,3,"rocky_floor_tiles",12,""],["Tile",-11,2,"rocky_floor_tiles",12,""],["Tile",-20,-2,"dirt_tiles",1,""],["Tile",-19,-5,"dirt_tiles",1,""],["Tile",-19,-4,"dirt_tiles",1,""],["Tile",-19,-1,"dirt_tiles",1,""],["Tile",-19,0,"dirt_tiles",1,""],["Tile",-19,1,"dirt_tiles",1,""],["Tile",-18,2,"dirt_tiles",1,""],["Tile",-15,3,"rocky_floor_tiles",12,""],["Tile",-21,-1,"dirt_tiles",1,""],["Tile",-20,-4,"dirt_tiles",1,""],["Tile",-20,-3,"dirt_tiles",1,""],["Tile",-20,-1,"dirt_tiles",1,""],["Tile",-20,0,"dirt_tiles",1,""],["Tile",-20,1,"dirt_tiles",1,""],["Tile",-20,2,"dirt_tiles",1,""],["Tile",-19,2,"dirt_tiles",1,""],["Tile",-19,3,"rocky_floor_tiles",12,""],["Tile",-18,3,"rocky_floor_tiles",12,""],["Tile",-17,3,"rocky_floor_tiles",12,""],["Tile",-16,3,"rocky_floor_tiles",12,""],["Tile",-16,4,"rocky_floor_tiles",12,""],["Tile",-13,3,"rocky_floor_tiles",12,""],["Tile",-21,-4,"dirt_tiles",1,""],["Tile",-21,-3,"dirt_tiles",1,""],["Tile",-21,-2,"dirt_tiles",1,""],["Tile",-21,0,"dirt_tiles",1,""],["Tile",-21,1,"dirt_tiles",1,""],["Tile",-21,2,"dirt_tiles",1,""],["Tile",-20,-5,"dirt_tiles",1,""],["Tile",-20,3,"rocky_floor_tiles",12,""],["Tile",-17,4,"rocky_floor_tiles",12,""],["Tile",-21,3,"dirt_tiles",1,""],["Tile",-20,4,"rocky_floor_tiles",12,""],["Tile",-19,4,"rocky_floor_tiles",12,""],["Tile",-18,4,"rocky_floor_tiles",12,""],["Tile",-17,5,"rocky_floor_tiles",12,""],["Tile",-15,4,"rocky_floor_tiles",12,""],["Tile",-14,4,"rocky_floor_tiles",12,""],["Tile",5,-7,"dirt_tiles",1,""],["Tile",4,-7,"dirt_tiles",1,""],["Tile",5,-8,"dirt_tiles",1,""],["Tile",6,-8,"dirt_tiles",1,""],["Tile",7,-9,"dirt_tiles",1,""],["Tile",13,-11,"dirt_tiles",1,""],["Tile",16,-10,"dirt_tiles",1,""],["Tile",17,-9,"dirt_tiles",1,""],["Tile",17,-8,"dirt_tiles",1,""],["Tile",17,-7,"dirt_tiles",1,""],["Tile",17,-4,"dirt_tiles",1,""],["Tile",17,-3,"dirt_tiles",1,""],["Tile",18,-6,"dirt_tiles",1,""],["Tile",14,-11,"dirt_tiles",1,""],["Tile",17,-10,"dirt_tiles",1,""],["Tile",17,-2,"rocky_floor_tiles",12,""],["Tile",18,-9,"dirt_tiles",1,""],["Tile",18,-8,"dirt_tiles",1,""],["Tile",18,-7,"dirt_tiles",1,""],["Tile",18,-5,"dirt_tiles",1,""],["Tile",18,-4,"dirt_tiles",1,""],["Tile",18,-3,"dirt_tiles",1,""],["Tile",19,-6,"dirt_tiles",1,""],["Tile",15,-11,"dirt_tiles",1,""],["Tile",18,-10,"dirt_tiles",1,""],["Tile",18,-2,"rocky_floor_tiles",12,""],["Tile",19,-9,"dirt_tiles",1,""],["Tile",19,-8,"dirt_tiles",1,""],["Tile",19,-7,"dirt_tiles",1,""],["Tile",19,-5,"dirt_tiles",1,""],["Tile",19,-4,"dirt_tiles",1,""],["Tile",19,-3,"dirt_tiles",1,""],["Tile",20,-6,"dirt_tiles",1,""],["Tile",16,-11,"dirt_tiles",1,""],["Tile",16,-1,"rocky_floor_tiles",12,""],["Tile",19,-10,"dirt_tiles",1,""],["Tile",19,-2,"rocky_floor_tiles",12,""],["Tile",20,-9,"dirt_tiles",1,""],["Tile",20,-8,"dirt_tiles",1,""],["Tile",20,-7,"dirt_tiles",1,""],["Tile",20,-5,"dirt_tiles",1,""],["Tile",20,-4,"dirt_tiles",1,""],["Tile",20,-3,"dirt_tiles",1,""],["Tile",21,-6,"dirt_tiles",1,""],["Tile",17,-11,"dirt_tiles",1,""],["Tile",17,-1,"rocky_floor_tiles",12,""],["Tile",20,-10,"dirt_tiles",1,""],["Prop",20,-10,"pine_none08",false],["Tile",20,-2,"rocky_floor_tiles",12,""],["Tile",21,-9,"dirt_tiles",1,""],["Tile",21,-8,"dirt_tiles",1,""],["Tile",21,-7,"dirt_tiles",1,""],["Tile",21,-5,"dirt_tiles",1,""],["Tile",21,-4,"dirt_tiles",1,""],["Tile",21,-3,"rocky_floor_tiles",12,""],["Tile",22,-6,"dirt_tiles",1,""],["Tile",18,-12,"dirt_tiles",1,""],["Tile",18,-11,"dirt_tiles",1,""],["Tile",19,-11,"dirt_tiles",1,""],["Tile",20,-11,"dirt_tiles",1,""],["Prop",20,-11,"pine_none01",false],["Tile",21,-11,"dirt_tiles",1,""],["Prop",21,-11,"pine_none06",false],["Tile",21,-10,"dirt_tiles",1,""],["Prop",21,-10,"pine_none06",false],["Tile",22,-10,"dirt_tiles",1,""],["Tile",22,-9,"dirt_tiles",1,""],["Tile",22,-8,"dirt_tiles",1,""],["Tile",22,-7,"dirt_tiles",1,""],["Tile",22,-5,"dirt_tiles",1,""],["Tile",22,-4,"dirt_tiles",1,""],["Tile",23,-7,"dirt_tiles",1,""],["Prop",23,-7,"pine_none06",false],["Tile",18,-1,"rocky_floor_tiles",12,""],["Tile",21,-2,"rocky_floor_tiles",12,""],["Tile",22,-3,"rocky_floor_tiles",12,""],["Tile",23,-6,"dirt_tiles",1,""],["Tile",19,-1,"rocky_floor_tiles",12,""],["Tile",22,-2,"rocky_floor_tiles",12,""],["Tile",23,-9,"dirt_tiles",1,""],["Tile",23,-8,"dirt_tiles",1,""],["Tile",23,-5,"dirt_tiles",1,""],["Tile",23,-4,"dirt_tiles",1,""],["Tile",23,-3,"rocky_floor_tiles",12,""],["Tile",24,-6,"dirt_tiles",1,""],["Tile",20,-12,"dirt_tiles",1,""],["Tile",22,-11,"dirt_tiles",1,""],["Tile",23,-11,"dirt_tiles",1,""],["Tile",23,-10,"dirt_tiles",1,""],["Tile",24,-10,"dirt_tiles",1,""],["Tile",24,-9,"dirt_tiles",1,""],["Tile",24,-8,"dirt_tiles",1,""],["Tile",24,-7,"dirt_tiles",1,""],["Tile",24,-5,"dirt_tiles",1,""],["Tile",24,-4,"dirt_tiles",1,""],["Tile",21,-12,"dirt_tiles",1,""],["Prop",21,-12,"pine_none05",false],["Tile",24,-11,"dirt_tiles",1,""],["Tile",21,-1,"rocky_floor_tiles",12,""],["Tile",23,-2,"rocky_floor_tiles",12,""],["Tile",22,-1,"rocky_floor_tiles",12,""],["Tile",-21,5,"rocky_floor_tiles",12,""],["Tile",-21,6,"rocky_floor_tiles",12,""],["Tile",-21,7,"rocky_floor_tiles",12,""],["Tile",-21,8,"rocky_floor_tiles",12,""],["Tile",-21,9,"rocky_floor_tiles",12,""],["Tile",-21,10,"rocky_floor_tiles",12,""],["Tile",-21,11,"rocky_floor_tiles",12,""],["Tile",-21,12,"rocky_floor_tiles",12,""],["Tile",-21,13,"rocky_floor_tiles",12,""],["Tile",-20,5,"rocky_floor_tiles",12,""],["Tile",-20,6,"rocky_floor_tiles",12,""],["Tile",-20,7,"rocky_floor_tiles",12,""],["Tile",-20,8,"rocky_floor_tiles",12,""],["Tile",-20,9,"rocky_floor_tiles",12,""],["Tile",-20,10,"rocky_floor_tiles",12,""],["Tile",-20,11,"rocky_floor_tiles",12,""],["Tile",-20,12,"rocky_floor_tiles",12,""],["Tile",-20,13,"rocky_floor_tiles",12,""],["Tile",-20,14,"rocky_floor_tiles",12,""],["Tile",-19,5,"rocky_floor_tiles",12,""],["Tile",-19,6,"rocky_floor_tiles",12,""],["Tile",-19,7,"rocky_floor_tiles",12,""],["Tile",-19,8,"rocky_floor_tiles",12,""],["Tile",-19,9,"rocky_floor_tiles",12,""],["Tile",-19,10,"rocky_floor_tiles",12,""],["Tile",-19,11,"rocky_floor_tiles",12,""],["Tile",-19,12,"rocky_floor_tiles",12,""],["Tile",-19,13,"rocky_floor_tiles",12,""],["Tile",-18,5,"rocky_floor_tiles",12,""],["Tile",-18,6,"rocky_floor_tiles",12,""],["Tile",-18,7,"rocky_floor_tiles",12,""],["Tile",-18,8,"rocky_floor_tiles",12,""],["Tile",-18,9,"rocky_floor_tiles",12,""],["Tile",-18,10,"rocky_floor_tiles",12,""],["Tile",-18,11,"rocky_floor_tiles",12,""],["Tile",-18,12,"rocky_floor_tiles",12,""],["Tile",-18,13,"rocky_floor_tiles",12,""],["Tile",-17,6,"rocky_floor_tiles",12,""],["Tile",-17,7,"rocky_floor_tiles",12,""],["Tile",-17,8,"rocky_floor_tiles",12,""],["Tile",-17,9,"rocky_floor_tiles",12,""],["Tile",-17,10,"rocky_floor_tiles",12,""],["Tile",-17,11,"rocky_floor_tiles",12,""],["Tile",-17,12,"rocky_floor_tiles",12,""],["Tile",-17,13,"rocky_floor_tiles",12,""],["Tile",-16,6,"rocky_floor_tiles",12,""],["Tile",-16,7,"rocky_floor_tiles",12,""],["Tile",-16,8,"rocky_floor_tiles",12,""],["Tile",-16,9,"rocky_floor_tiles",12,""],["Tile",-16,10,"rocky_floor_tiles",12,""],["Tile",-16,11,"rocky_floor_tiles",12,""],["Tile",-16,12,"rocky_floor_tiles",12,""],["Tile",-15,9,"rocky_floor_tiles",12,""],["Tile",-19,14,"rocky_floor_tiles",12,""],["Tile",-16,5,"rocky_floor_tiles",12,""],["Tile",-16,13,"rocky_floor_tiles",12,""],["Tile",-15,6,"rocky_floor_tiles",12,""],["Tile",-15,7,"rocky_floor_tiles",12,""],["Tile",-15,8,"rocky_floor_tiles",12,""],["Tile",-15,10,"rocky_floor_tiles",12,""],["Tile",-15,11,"rocky_floor_tiles",12,""],["Tile",-15,12,"rocky_floor_tiles",12,""],["Tile",-14,9,"rocky_floor_tiles",12,""],["Tile",-21,4,"rocky_floor_tiles",12,""],["Tile",-15,5,"rocky_floor_tiles",12,""],["Tile",-14,8,"rocky_floor_tiles",12,""],["Tile",-14,5,"rocky_floor_tiles",12,""],["Tile",-14,6,"rocky_floor_tiles",12,""],["Tile",-14,7,"rocky_floor_tiles",12,""],["Tile",-14,10,"rocky_floor_tiles",12,""],["Tile",-14,11,"rocky_floor_tiles",12,""],["Tile",-13,8,"rocky_floor_tiles",12,""],["Tile",-14,12,"rocky_floor_tiles",12,""],["Tile",-13,5,"rocky_floor_tiles",12,""],["Tile",-13,6,"rocky_floor_tiles",12,""],["Tile",-13,7,"rocky_floor_tiles",12,""],["Tile",-13,9,"rocky_floor_tiles",12,""],["Tile",-13,10,"rocky_floor_tiles",12,""],["Tile",-13,11,"rocky_floor_tiles",12,""],["Tile",-12,8,"rocky_floor_tiles",12,""],["Prop",-12,8,"pine_half03",false],["Tile",-13,4,"rocky_floor_tiles",12,""],["Tile",-12,7,"rocky_floor_tiles",12,""],["Tile",-12,4,"rocky_floor_tiles",12,""],["Tile",-12,5,"rocky_floor_tiles",12,""],["Tile",-12,6,"rocky_floor_tiles",12,""],["Tile",-12,9,"rocky_floor_tiles",12,""],["Tile",-12,10,"rocky_floor_tiles",12,""],["Tile",-11,7,"rocky_floor_tiles",12,""],["Prop",-11,7,"pine_half05",false],["Tile",-12,3,"rocky_floor_tiles",12,""],["Tile",-12,11,"rocky_floor_tiles",12,""],["Tile",-11,4,"rocky_floor_tiles",12,""],["Tile",-11,5,"rocky_floor_tiles",12,""],["Tile",-11,6,"rocky_floor_tiles",12,""],["Tile",-11,8,"rocky_floor_tiles",12,""],["Prop",-11,8,"pine_half03",false],["Tile",-11,9,"rocky_floor_tiles",12,""],["Tile",-11,10,"rocky_floor_tiles",12,""],["Tile",-10,7,"rocky_floor_tiles",12,""],["Tile",-11,3,"rocky_floor_tiles",12,""],["Tile",-11,11,"rocky_floor_tiles",12,""],["Tile",-10,4,"rocky_floor_tiles",12,""],["Tile",-10,5,"rocky_floor_tiles",12,""],["Tile",-10,6,"rocky_floor_tiles",12,""],["Tile",-10,8,"rocky_floor_tiles",12,""],["Tile",-10,9,"rocky_floor_tiles",12,""],["Tile",-10,10,"rocky_floor_tiles",12,""],["Tile",-9,7,"rocky_floor_tiles",12,""],["Tile",-13,12,"rocky_floor_tiles",12,""],["Tile",-10,3,"rocky_floor_tiles",12,""],["Tile",-10,11,"rocky_floor_tiles",12,""],["Tile",-9,4,"rocky_floor_tiles",12,""],["Tile",-9,5,"rocky_floor_tiles",12,""],["Tile",-9,6,"rocky_floor_tiles",12,""],["Tile",-9,8,"rocky_floor_tiles",12,""],["Tile",-9,9,"rocky_floor_tiles",12,""],["Tile",-9,10,"rocky_floor_tiles",12,""],["Tile",-8,7,"rocky_floor_tiles",12,""],["Tile",-12,12,"rocky_floor_tiles",12,""],["Tile",-9,3,"rocky_floor_tiles",12,""],["Tile",-9,11,"rocky_floor_tiles",12,""],["Tile",-8,4,"rocky_floor_tiles",12,""],["Tile",-8,5,"rocky_floor_tiles",12,""],["Tile",-8,6,"rocky_floor_tiles",12,""],["Tile",-8,8,"rocky_floor_tiles",12,""],["Tile",-8,9,"rocky_floor_tiles",12,""],["Tile",-8,10,"rocky_floor_tiles",12,""],["Tile",-7,7,"rocky_floor_tiles",12,""],["Tile",-11,12,"rocky_floor_tiles",12,""],["Tile",-8,3,"rocky_floor_tiles",12,""],["Tile",-8,11,"rocky_floor_tiles",12,""],["Tile",-7,4,"rocky_floor_tiles",12,""],["Tile",-7,5,"rocky_floor_tiles",12,""],["Tile",-7,6,"rocky_floor_tiles",12,""],["Tile",-7,8,"rocky_floor_tiles",12,""],["Tile",-7,9,"rocky_floor_tiles",12,""],["Tile",-7,10,"rocky_floor_tiles",12,""],["Tile",-6,7,"rocky_floor_tiles",12,""],["Tile",-10,2,"rocky_floor_tiles",12,""],["Tile",-10,12,"rocky_floor_tiles",12,""],["Tile",-7,3,"rocky_floor_tiles",12,""],["Tile",-7,11,"rocky_floor_tiles",12,""],["Tile",-6,4,"rocky_floor_tiles",12,""],["Tile",-6,5,"rocky_floor_tiles",12,""],["Tile",-6,6,"rocky_floor_tiles",12,""],["Tile",-6,8,"rocky_floor_tiles",12,""],["Tile",-6,9,"rocky_floor_tiles",12,""],["Tile",-6,10,"rocky_floor_tiles",12,""],["Tile",-5,7,"rocky_floor_tiles",12,""],["Tile",-9,2,"rocky_floor_tiles",12,""],["Tile",-9,12,"rocky_floor_tiles",12,""],["Tile",-6,3,"rocky_floor_tiles",12,""],["Tile",-6,11,"rocky_floor_tiles",12,""],["Tile",-5,4,"rocky_floor_tiles",12,""],["Tile",-5,5,"rocky_floor_tiles",12,""],["Tile",-5,6,"rocky_floor_tiles",12,""],["Tile",-5,8,"rocky_floor_tiles",12,""],["Tile",-5,9,"rocky_floor_tiles",12,""],["Tile",-5,10,"rocky_floor_tiles",12,""],["Tile",-4,7,"rocky_floor_tiles",12,""],["Tile",-8,2,"rocky_floor_tiles",12,""],["Tile",-8,12,"rocky_floor_tiles",12,""],["Tile",-5,3,"rocky_floor_tiles",12,""],["Tile",-5,11,"rocky_floor_tiles",12,""],["Tile",-4,4,"rocky_floor_tiles",12,""],["Tile",-4,5,"rocky_floor_tiles",12,""],["Tile",-4,6,"rocky_floor_tiles",12,""],["Tile",-4,8,"rocky_floor_tiles",12,""],["Tile",-4,9,"rocky_floor_tiles",12,""],["Tile",-4,10,"rocky_floor_tiles",12,""],["Tile",-3,7,"rocky_floor_tiles",12,""],["Tile",-7,2,"rocky_floor_tiles",12,""],["Tile",-7,12,"rocky_floor_tiles",12,""],["Tile",-4,3,"rocky_floor_tiles",12,""],["Tile",-4,11,"rocky_floor_tiles",12,""],["Prop",-4,11,"pine_half03",false],["Tile",-3,4,"rocky_floor_tiles",12,""],["Tile",-3,5,"rocky_floor_tiles",12,""],["Tile",-3,6,"rocky_floor_tiles",12,""],["Tile",-3,8,"rocky_floor_tiles",12,""],["Tile",-3,9,"rocky_floor_tiles",12,""],["Tile",-3,10,"rocky_floor_tiles",12,""],["Tile",-2,7,"rocky_floor_tiles",12,""],["Tile",-6,2,"rocky_floor_tiles",12,""],["Tile",-6,12,"rocky_floor_tiles",12,""],["Tile",-3,11,"rocky_floor_tiles",12,""],["Tile",-2,4,"rocky_floor_tiles",12,""],["Tile",-2,5,"rocky_floor_tiles",12,""],["Tile",-2,6,"rocky_floor_tiles",12,""],["Tile",-2,8,"rocky_floor_tiles",12,""],["Tile",-2,9,"rocky_floor_tiles",12,""],["Tile",-2,10,"rocky_floor_tiles",12,""],["Tile",-1,7,"rocky_floor_tiles",12,""],["Tile",-6,13,"rocky_floor_tiles",12,""],["Tile",-5,12,"rocky_floor_tiles",12,""],["Tile",-4,12,"rocky_floor_tiles",12,""],["Tile",-3,12,"rocky_floor_tiles",12,""],["Tile",-2,11,"rocky_floor_tiles",12,""],["Tile",-1,8,"rocky_floor_tiles",12,""],["Tile",-5,13,"rocky_floor_tiles",12,""],["Tile",-2,12,"rocky_floor_tiles",12,""],["Tile",-1,5,"rocky_floor_tiles",12,""],["Tile",-1,6,"rocky_floor_tiles",12,""],["Tile",-1,9,"rocky_floor_tiles",12,""],["Tile",-1,10,"rocky_floor_tiles",12,""],["Tile",-1,11,"rocky_floor_tiles",12,""],["Tile",0,8,"rocky_floor_tiles",12,""],["Tile",-4,13,"rocky_floor_tiles",12,""],["Tile",-1,4,"rocky_floor_tiles",12,""],["Tile",-1,12,"rocky_floor_tiles",12,""],["Tile",0,5,"rocky_floor_tiles",12,""],["Tile",0,6,"rocky_floor_tiles",12,""],["Tile",0,7,"rocky_floor_tiles",12,""],["Tile",0,9,"rocky_floor_tiles",12,""],["Tile",0,10,"rocky_floor_tiles",12,""],["Tile",0,11,"rocky_floor_tiles",12,""],["Tile",1,8,"rocky_floor_tiles",12,""],["Tile",-3,13,"rocky_floor_tiles",12,""],["Tile",0,12,"rocky_floor_tiles",12,""],["Tile",1,5,"rocky_floor_tiles",12,""],["Tile",1,6,"rocky_floor_tiles",12,""],["Tile",1,7,"rocky_floor_tiles",12,""],["Tile",1,9,"rocky_floor_tiles",12,""],["Tile",1,10,"rocky_floor_tiles",12,""],["Tile",1,11,"rocky_floor_tiles",12,""],["Tile",2,8,"rocky_floor_tiles",12,""],["Tile",-3,14,"rocky_floor_tiles",12,""],["Tile",-2,13,"rocky_floor_tiles",12,""],["Tile",-1,13,"rocky_floor_tiles",12,""],["Tile",0,13,"rocky_floor_tiles",12,""],["Tile",1,12,"rocky_floor_tiles",12,""],["Tile",2,9,"rocky_floor_tiles",12,""],["Tile",-2,14,"rocky_floor_tiles",12,""],["Tile",1,13,"rocky_floor_tiles",12,""],["Tile",2,6,"rocky_floor_tiles",12,""],["Tile",2,7,"rocky_floor_tiles",12,""],["Tile",2,10,"rocky_floor_tiles",12,""],["Tile",2,11,"rocky_floor_tiles",12,""],["Tile",2,12,"rocky_floor_tiles",12,""],["Tile",3,9,"rocky_floor_tiles",12,""],["Tile",-1,14,"rocky_floor_tiles",12,""],["Tile",2,5,"rocky_floor_tiles",12,""],["Tile",2,13,"rocky_floor_tiles",12,""],["Tile",3,6,"rocky_floor_tiles",12,""],["Tile",3,7,"rocky_floor_tiles",12,""],["Tile",3,8,"rocky_floor_tiles",12,""],["Tile",3,10,"rocky_floor_tiles",12,""],["Tile",3,11,"rocky_floor_tiles",12,""],["Tile",3,12,"rocky_floor_tiles",12,""],["Tile",4,9,"rocky_floor_tiles",12,""],["Tile",0,14,"rocky_floor_tiles",12,""],["Tile",3,5,"rocky_floor_tiles",12,""],["Tile",3,13,"rocky_floor_tiles",12,""],["Tile",4,6,"rocky_floor_tiles",12,""],["Tile",4,7,"rocky_floor_tiles",12,""],["Tile",4,8,"rocky_floor_tiles",12,""],["Tile",4,10,"rocky_floor_tiles",12,""],["Tile",4,11,"rocky_floor_tiles",12,""],["Tile",4,12,"rocky_floor_tiles",12,""],["Tile",5,9,"rocky_floor_tiles",12,""],["Tile",1,14,"rocky_floor_tiles",12,""],["Tile",4,5,"rocky_floor_tiles",12,""],["Tile",4,13,"rocky_floor_tiles",12,""],["Tile",5,6,"rocky_floor_tiles",12,""],["Tile",5,7,"rocky_floor_tiles",12,""],["Tile",5,8,"rocky_floor_tiles",12,""],["Tile",5,10,"rocky_floor_tiles",12,""],["Tile",5,11,"rocky_floor_tiles",12,""],["Tile",5,12,"rocky_floor_tiles",12,""],["Tile",6,9,"rocky_floor_tiles",12,""],["Prop",6,9,"pine_half06",false],["Tile",2,14,"rocky_floor_tiles",12,""],["Tile",5,5,"rocky_floor_tiles",12,""],["Tile",5,13,"rocky_floor_tiles",12,""],["Tile",6,6,"rocky_floor_tiles",12,""],["Tile",6,7,"rocky_floor_tiles",12,""],["Tile",6,8,"rocky_floor_tiles",12,""],["Tile",6,10,"rocky_floor_tiles",12,""],["Tile",6,11,"rocky_floor_tiles",12,""],["Tile",6,12,"rocky_floor_tiles",12,""],["Tile",7,9,"rocky_floor_tiles",12,""],["Prop",7,9,"pine_half06",false],["Tile",3,14,"rocky_floor_tiles",12,""],["Tile",6,5,"rocky_floor_tiles",12,""],["Tile",6,13,"rocky_floor_tiles",12,""],["Tile",7,6,"rocky_floor_tiles",12,""],["Tile",7,7,"rocky_floor_tiles",12,""],["Tile",7,8,"rocky_floor_tiles",12,""],["Prop",7,8,"pine_half03",false],["Tile",7,10,"rocky_floor_tiles",12,""],["Tile",7,11,"rocky_floor_tiles",12,""],["Tile",7,12,"rocky_floor_tiles",12,""],["Tile",8,9,"rocky_floor_tiles",12,""],["Tile",7,5,"rocky_floor_tiles",12,""],["Tile",8,8,"rocky_floor_tiles",12,""],["Tile",8,5,"rocky_floor_tiles",12,""],["Tile",8,6,"rocky_floor_tiles",12,""],["Tile",8,7,"rocky_floor_tiles",12,""],["Tile",8,10,"rocky_floor_tiles",12,""],["Tile",8,11,"rocky_floor_tiles",12,""],["Tile",9,8,"rocky_floor_tiles",12,""],["Tile",8,4,"rocky_floor_tiles",12,""],["Tile",8,12,"rocky_floor_tiles",12,""],["Tile",9,5,"rocky_floor_tiles",12,""],["Tile",9,6,"rocky_floor_tiles",12,""],["Tile",9,7,"rocky_floor_tiles",12,""],["Tile",9,9,"rocky_floor_tiles",12,""],["Tile",9,10,"rocky_floor_tiles",12,""],["Tile",9,11,"rocky_floor_tiles",12,""],["Tile",10,8,"rocky_floor_tiles",12,""],["Tile",9,4,"rocky_floor_tiles",12,""],["Tile",9,12,"rocky_floor_tiles",12,""],["Tile",10,5,"rocky_floor_tiles",12,""],["Tile",10,6,"rocky_floor_tiles",12,""],["Tile",10,7,"rocky_floor_tiles",12,""],["Tile",10,9,"rocky_floor_tiles",12,""],["Tile",10,10,"rocky_floor_tiles",12,""],["Tile",10,11,"rocky_floor_tiles",12,""],["Tile",11,8,"rocky_floor_tiles",12,""],["Tile",7,13,"rocky_floor_tiles",12,""],["Tile",10,4,"rocky_floor_tiles",12,""],["Tile",10,12,"rocky_floor_tiles",12,""],["Tile",11,5,"rocky_floor_tiles",12,""],["Tile",11,6,"rocky_floor_tiles",12,""],["Tile",11,7,"rocky_floor_tiles",12,""],["Tile",11,9,"rocky_floor_tiles",12,""],["Tile",11,10,"rocky_floor_tiles",12,""],["Tile",11,11,"rocky_floor_tiles",12,""],["Tile",12,8,"rocky_floor_tiles",12,""],["Tile",8,13,"rocky_floor_tiles",12,""],["Tile",11,4,"rocky_floor_tiles",12,""],["Tile",11,12,"rocky_floor_tiles",12,""],["Tile",12,5,"rocky_floor_tiles",12,""],["Tile",12,6,"rocky_floor_tiles",12,""],["Tile",12,7,"rocky_floor_tiles",12,""],["Tile",12,9,"rocky_floor_tiles",12,""],["Tile",12,10,"rocky_floor_tiles",12,""],["Tile",12,11,"rocky_floor_tiles",12,""],["Tile",13,8,"rocky_floor_tiles",12,""],["Tile",11,3,"rocky_floor_tiles",12,""],["Tile",12,3,"rocky_floor_tiles",12,""],["Tile",12,4,"rocky_floor_tiles",12,""],["Tile",13,4,"rocky_floor_tiles",12,""],["Prop",13,4,"pine_half05",false],["Tile",13,5,"rocky_floor_tiles",12,""],["Prop",13,5,"pine_half06",false],["Tile",13,6,"rocky_floor_tiles",12,""],["Tile",13,7,"rocky_floor_tiles",12,""],["Tile",13,9,"rocky_floor_tiles",12,""],["Tile",13,10,"rocky_floor_tiles",12,""],["Tile",14,7,"rocky_floor_tiles",12,""],["Tile",13,3,"rocky_floor_tiles",12,""],["Tile",13,11,"rocky_floor_tiles",12,""],["Tile",14,4,"rocky_floor_tiles",12,""],["Tile",14,5,"rocky_floor_tiles",12,""],["Tile",14,6,"rocky_floor_tiles",12,""],["Tile",14,8,"rocky_floor_tiles",12,""],["Tile",14,9,"rocky_floor_tiles",12,""],["Tile",14,10,"rocky_floor_tiles",12,""],["Tile",15,7,"rocky_floor_tiles",12,""],["Tile",13,2,"rocky_floor_tiles",12,""],["Tile",14,3,"rocky_floor_tiles",12,""],["Tile",15,6,"rocky_floor_tiles",12,""],["Tile",14,2,"rocky_floor_tiles",12,""],["Tile",15,3,"rocky_floor_tiles",12,""],["Tile",15,4,"rocky_floor_tiles",12,""],["Tile",15,5,"rocky_floor_tiles",12,""],["Tile",15,8,"rocky_floor_tiles",12,""],["Tile",15,9,"rocky_floor_tiles",12,""],["Tile",16,6,"rocky_floor_tiles",12,""],["Tile",15,2,"rocky_floor_tiles",12,""],["Tile",15,10,"rocky_floor_tiles",12,""],["Tile",16,3,"rocky_floor_tiles",12,""],["Tile",16,4,"rocky_floor_tiles",12,""],["Tile",16,5,"rocky_floor_tiles",12,""],["Tile",16,7,"rocky_floor_tiles",12,""],["Tile",16,8,"rocky_floor_tiles",12,""],["Tile",16,9,"rocky_floor_tiles",12,""],["Tile",17,6,"rocky_floor_tiles",12,""],["Tile",14,1,"rocky_floor_tiles",12,""],["Tile",15,1,"rocky_floor_tiles",12,""],["Tile",16,2,"rocky_floor_tiles",12,""],["Tile",17,5,"rocky_floor_tiles",12,""],["Tile",16,1,"rocky_floor_tiles",12,""],["Tile",17,2,"rocky_floor_tiles",12,""],["Tile",17,3,"rocky_floor_tiles",12,""],["Tile",17,4,"rocky_floor_tiles",12,""],["Tile",17,7,"rocky_floor_tiles",12,""],["Tile",17,8,"rocky_floor_tiles",12,""],["Tile",18,5,"rocky_floor_tiles",12,""],["Tile",17,1,"rocky_floor_tiles",12,""],["Tile",17,9,"rocky_floor_tiles",12,""],["Tile",18,2,"rocky_floor_tiles",12,""],["Tile",18,3,"rocky_floor_tiles",12,""],["Tile",18,4,"rocky_floor_tiles",12,""],["Tile",18,6,"rocky_floor_tiles",12,""],["Tile",18,7,"rocky_floor_tiles",12,""],["Tile",18,8,"rocky_floor_tiles",12,""],["Tile",19,5,"rocky_floor_tiles",12,""],["Tile",15,0,"rocky_floor_tiles",12,""],["Tile",16,0,"rocky_floor_tiles",12,""],["Tile",17,0,"rocky_floor_tiles",12,""],["Tile",18,0,"rocky_floor_tiles",12,""],["Tile",18,1,"rocky_floor_tiles",12,""],["Tile",19,1,"rocky_floor_tiles",12,""],["Tile",19,2,"rocky_floor_tiles",12,""],["Tile",19,3,"rocky_floor_tiles",12,""],["Tile",19,4,"rocky_floor_tiles",12,""],["Tile",19,6,"rocky_floor_tiles",12,""],["Tile",19,7,"rocky_floor_tiles",12,""],["Tile",20,4,"rocky_floor_tiles",12,""],["Tile",19,0,"rocky_floor_tiles",12,""],["Tile",19,8,"rocky_floor_tiles",12,""],["Tile",20,1,"rocky_floor_tiles",12,""],["Prop",20,1,"pine_half05",false],["Tile",20,2,"rocky_floor_tiles",12,""],["Tile",20,3,"rocky_floor_tiles",12,""],["Tile",20,5,"rocky_floor_tiles",12,""],["Tile",20,6,"rocky_floor_tiles",12,""],["Tile",20,7,"rocky_floor_tiles",12,""],["Tile",21,4,"rocky_floor_tiles",12,""],["Tile",20,-1,"rocky_floor_tiles",12,""],["Tile",20,0,"rocky_floor_tiles",12,""],["Tile",21,0,"rocky_floor_tiles",12,""],["Prop",21,0,"pine_half03",false],["Tile",21,1,"rocky_floor_tiles",12,""],["Prop",21,1,"pine_half03",false],["Tile",21,2,"rocky_floor_tiles",12,""],["Tile",21,3,"rocky_floor_tiles",12,""],["Tile",21,5,"rocky_floor_tiles",12,""],["Tile",21,6,"rocky_floor_tiles",12,""],["Tile",22,3,"rocky_floor_tiles",12,""],["Tile",21,7,"rocky_floor_tiles",12,""],["Tile",22,0,"rocky_floor_tiles",12,""],["Tile",22,1,"rocky_floor_tiles",12,""],["Tile",22,2,"rocky_floor_tiles",12,""],["Tile",22,4,"rocky_floor_tiles",12,""],["Tile",22,5,"rocky_floor_tiles",12,""],["Tile",22,6,"rocky_floor_tiles",12,""],["Tile",23,3,"rocky_floor_tiles",12,""],["Tile",22,7,"rocky_floor_tiles",12,""],["Tile",23,0,"rocky_floor_tiles",12,""],["Tile",23,1,"rocky_floor_tiles",12,""],["Tile",23,2,"rocky_floor_tiles",12,""],["Tile",23,4,"rocky_floor_tiles",12,""],["Tile",23,5,"rocky_floor_tiles",12,""],["Tile",23,6,"rocky_floor_tiles",12,""],["Tile",24,3,"rocky_floor_tiles",12,""],["Tile",20,8,"rocky_floor_tiles",12,""],["Tile",23,-1,"rocky_floor_tiles",12,""],["Tile",23,7,"rocky_floor_tiles",12,""],["Tile",24,1,"rocky_floor_tiles",12,""],["Tile",24,2,"rocky_floor_tiles",12,""],["Tile",24,4,"rocky_floor_tiles",12,""],["Tile",24,5,"rocky_floor_tiles",12,""],["Tile",24,6,"rocky_floor_tiles",12,""],["Tile",21,8,"rocky_floor_tiles",12,""],["Tile",24,7,"rocky_floor_tiles",12,""],["Tile",-21,14,"rocky_floor_tiles",12,""],["Tile",-21,15,"rocky_floor_tiles",12,""],["Tile",-21,16,"rocky_floor_tiles",12,""],["Tile",-21,17,"rocky_floor_tiles",12,""],["Tile",-21,18,"rocky_floor_tiles",12,""],["Tile",-21,19,"rocky_floor_tiles",12,""],["Tile",-21,20,"rocky_floor_tiles",12,""],["Tile",-21,21,"rocky_floor_tiles",12,""],["Tile",-21,22,"rocky_floor_tiles",12,""],["Tile",-20,15,"rocky_floor_tiles",12,""],["Tile",-20,16,"rocky_floor_tiles",12,""],["Tile",-20,17,"rocky_floor_tiles",12,""],["Tile",-20,18,"rocky_floor_tiles",12,""],["Tile",-20,19,"rocky_floor_tiles",12,""],["Tile",-20,20,"rocky_floor_tiles",12,""],["Tile",-20,21,"rocky_floor_tiles",12,""],["Tile",-19,15,"rocky_floor_tiles",12,""],["Tile",-19,16,"rocky_floor_tiles",12,""],["Tile",-19,17,"rocky_floor_tiles",12,""],["Tile",-19,18,"rocky_floor_tiles",12,""],["Tile",-19,19,"rocky_floor_tiles",12,""],["Tile",-19,20,"rocky_floor_tiles",12,""],["Tile",-19,21,"rocky_floor_tiles",12,""],["Tile",-18,14,"rocky_floor_tiles",12,""],["Tile",-18,15,"rocky_floor_tiles",12,""],["Tile",-18,16,"rocky_floor_tiles",12,""],["Tile",-18,17,"rocky_floor_tiles",12,""],["Prop",-18,17,"big_rock01",false],["Tile",-18,18,"rocky_floor_tiles",12,""],["Tile",-18,19,"rocky_floor_tiles",12,""],["Tile",-18,20,"rocky_floor_tiles",12,""],["Tile",-18,21,"rocky_floor_tiles",12,""],["Tile",-17,14,"rocky_floor_tiles",12,""],["Tile",-17,15,"rocky_floor_tiles",12,""],["Tile",-17,16,"rocky_floor_tiles",12,""],["Tile",-17,17,"rocky_floor_tiles",12,""],["Tile",-17,18,"rocky_floor_tiles",12,""],["Tile",-17,19,"rocky_floor_tiles",12,""],["Tile",-17,20,"rocky_floor_tiles",12,""],["Tile",-16,17,"rocky_floor_tiles",12,""],["Tile",-16,14,"rocky_floor_tiles",12,""],["Tile",-16,15,"rocky_floor_tiles",12,""],["Tile",-16,16,"rocky_floor_tiles",12,""],["Tile",-16,18,"rocky_floor_tiles",12,""],["Tile",-16,19,"rocky_floor_tiles",12,""],["Tile",-15,16,"rocky_floor_tiles",12,""],["Tile",-16,20,"rocky_floor_tiles",12,""],["Tile",-15,13,"rocky_floor_tiles",12,""],["Tile",-15,14,"rocky_floor_tiles",12,""],["Tile",-15,15,"rocky_floor_tiles",12,""],["Tile",-15,17,"rocky_floor_tiles",12,""],["Tile",-15,18,"rocky_floor_tiles",12,""],["Tile",-15,19,"rocky_floor_tiles",12,""],["Tile",-14,16,"rocky_floor_tiles",12,""],["Tile",-15,20,"rocky_floor_tiles",12,""],["Tile",-14,13,"rocky_floor_tiles",12,""],["Tile",-14,14,"rocky_floor_tiles",12,""],["Tile",-14,15,"rocky_floor_tiles",12,""],["Tile",-14,17,"rocky_floor_tiles",12,""],["Tile",-14,18,"rocky_floor_tiles",12,""],["Tile",-14,19,"rocky_floor_tiles",12,""],["Tile",-13,16,"rocky_floor_tiles",12,""],["Tile",-17,21,"rocky_floor_tiles",12,""],["Tile",-14,20,"rocky_floor_tiles",12,""],["Tile",-13,13,"rocky_floor_tiles",12,""],["Tile",-13,14,"rocky_floor_tiles",12,""],["Tile",-13,15,"rocky_floor_tiles",12,""],["Tile",-13,17,"rocky_floor_tiles",12,""],["Tile",-13,18,"rocky_floor_tiles",12,""],["Tile",-13,19,"rocky_floor_tiles",12,""],["Tile",-12,16,"rocky_floor_tiles",12,""],["Tile",-16,21,"rocky_floor_tiles",12,""],["Tile",-13,20,"rocky_floor_tiles",12,""],["Tile",-12,13,"rocky_floor_tiles",12,""],["Tile",-12,14,"rocky_floor_tiles",12,""],["Tile",-12,15,"rocky_floor_tiles",12,""],["Tile",-12,17,"rocky_floor_tiles",12,""],["Tile",-12,18,"rocky_floor_tiles",12,""],["Tile",-12,19,"rocky_floor_tiles",12,""],["Tile",-11,16,"rocky_floor_tiles",12,""],["Tile",-16,22,"rocky_floor_tiles",12,""],["Tile",-15,21,"rocky_floor_tiles",12,""],["Tile",-14,21,"rocky_floor_tiles",12,""],["Tile",-13,21,"rocky_floor_tiles",12,""],["Tile",-12,20,"rocky_floor_tiles",12,""],["Tile",-11,17,"rocky_floor_tiles",12,""],["Tile",-15,22,"rocky_floor_tiles",12,""],["Tile",-12,21,"rocky_floor_tiles",12,""],["Tile",-11,14,"rocky_floor_tiles",12,""],["Tile",-11,15,"rocky_floor_tiles",12,""],["Tile",-11,18,"rocky_floor_tiles",12,""],["Tile",-11,19,"rocky_floor_tiles",12,""],["Tile",-11,20,"rocky_floor_tiles",12,""],["Tile",-10,17,"rocky_floor_tiles",12,""],["Tile",-14,22,"rocky_floor_tiles",12,""],["Tile",-11,13,"rocky_floor_tiles",12,""],["Tile",-11,21,"rocky_floor_tiles",12,""],["Tile",-10,14,"rocky_floor_tiles",12,""],["Tile",-10,15,"rocky_floor_tiles",12,""],["Tile",-10,16,"rocky_floor_tiles",12,""],["Tile",-10,18,"rocky_floor_tiles",12,""],["Tile",-10,19,"rocky_floor_tiles",12,""],["Tile",-10,20,"rocky_floor_tiles",12,""],["Prop",-10,20,"cart",false],["Tile",-9,17,"rocky_floor_tiles",12,""],["Tile",-13,22,"rocky_floor_tiles",12,""],["Tile",-10,13,"rocky_floor_tiles",12,""],["Tile",-10,21,"rocky_floor_tiles",12,""],["Tile",-9,14,"rocky_floor_tiles",12,""],["Tile",-9,15,"rocky_floor_tiles",12,""],["Tile",-9,16,"rocky_floor_tiles",12,""],["Tile",-9,18,"rocky_floor_tiles",12,""],["Tile",-9,19,"rocky_floor_tiles",12,""],["Tile",-9,20,"rocky_floor_tiles",12,""],["Tile",-8,17,"rocky_floor_tiles",12,""],["Tile",-11,22,"rocky_floor_tiles",12,""],["Tile",-9,13,"rocky_floor_tiles",12,""],["Tile",-9,21,"rocky_floor_tiles",12,""],["Tile",-8,13,"rocky_floor_tiles",12,""],["Tile",-8,14,"rocky_floor_tiles",12,""],["Tile",-8,15,"rocky_floor_tiles",12,""],["Tile",-8,16,"rocky_floor_tiles",12,""],["Tile",-8,18,"rocky_floor_tiles",12,""],["Tile",-8,19,"rocky_floor_tiles",12,""],["Tile",-8,20,"rocky_floor_tiles",12,""],["Tile",-8,21,"rocky_floor_tiles",12,""],["Tile",-7,14,"rocky_floor_tiles",12,""],["Tile",-7,15,"rocky_floor_tiles",12,""],["Tile",-7,16,"rocky_floor_tiles",12,""],["Tile",-7,17,"rocky_floor_tiles",12,""],["Tile",-7,18,"rocky_floor_tiles",12,""],["Tile",-7,19,"rocky_floor_tiles",12,""],["Tile",-7,20,"rocky_floor_tiles",12,""],["Tile",-6,17,"rocky_floor_tiles",12,""],["Tile",-12,22,"rocky_floor_tiles",12,""],["Tile",-10,22,"rocky_floor_tiles",12,""],["Tile",-10,23,"rocky_floor_tiles",12,""],["Tile",-9,22,"rocky_floor_tiles",12,""],["Tile",-8,22,"rocky_floor_tiles",12,""],["Tile",-7,21,"rocky_floor_tiles",12,""],["Tile",-7,22,"rocky_floor_tiles",12,""],["Tile",-6,15,"rocky_floor_tiles",12,""],["Tile",-6,16,"rocky_floor_tiles",12,""],["Tile",-6,18,"rocky_floor_tiles",12,""],["Tile",-6,19,"rocky_floor_tiles",12,""],["Tile",-6,20,"rocky_floor_tiles",12,""],["Tile",-6,21,"rocky_floor_tiles",12,""],["Tile",-5,18,"rocky_floor_tiles",12,""],["Tile",-9,23,"rocky_floor_tiles",12,""],["Tile",-6,14,"rocky_floor_tiles",12,""],["Tile",-6,22,"rocky_floor_tiles",12,""],["Tile",-5,15,"rocky_floor_tiles",12,""],["Tile",-5,16,"rocky_floor_tiles",12,""],["Tile",-5,17,"rocky_floor_tiles",12,""],["Tile",-5,19,"rocky_floor_tiles",12,""],["Tile",-5,20,"rocky_floor_tiles",12,""],["Tile",-5,21,"rocky_floor_tiles",12,""],["Tile",-4,18,"rocky_floor_tiles",12,""],["Tile",-8,23,"rocky_floor_tiles",12,""],["Tile",-5,14,"rocky_floor_tiles",12,""],["Tile",-5,22,"rocky_floor_tiles",12,""],["Tile",-4,15,"rocky_floor_tiles",12,""],["Tile",-4,16,"rocky_floor_tiles",12,""],["Tile",-4,17,"rocky_floor_tiles",12,""],["Tile",-4,19,"rocky_floor_tiles",12,""],["Tile",-4,20,"rocky_floor_tiles",12,""],["Prop",-4,20,"big_rock02",false],["Tile",-4,21,"rocky_floor_tiles",12,""],["Prop",-4,21,"big_rock01",false],["Tile",-3,18,"rocky_floor_tiles",12,""],["Tile",-7,13,"rocky_floor_tiles",12,""],["Tile",-7,23,"rocky_floor_tiles",12,""],["Tile",-4,14,"rocky_floor_tiles",12,""],["Tile",-4,22,"rocky_floor_tiles",12,""],["Tile",-3,15,"rocky_floor_tiles",12,""],["Tile",-3,16,"rocky_floor_tiles",12,""],["Tile",-3,17,"rocky_floor_tiles",12,""],["Tile",-3,19,"rocky_floor_tiles",12,""],["Tile",-3,20,"rocky_floor_tiles",12,""],["Tile",-3,21,"rocky_floor_tiles",12,""],["Tile",-2,18,"rocky_floor_tiles",12,""],["Tile",-6,23,"rocky_floor_tiles",12,""],["Tile",-3,22,"rocky_floor_tiles",12,""],["Tile",-2,15,"rocky_floor_tiles",12,""],["Tile",-2,16,"rocky_floor_tiles",12,""],["Tile",-2,17,"rocky_floor_tiles",12,""],["Tile",-2,19,"rocky_floor_tiles",12,""],["Tile",-2,20,"rocky_floor_tiles",12,""],["Tile",-2,21,"rocky_floor_tiles",12,""],["Tile",-1,18,"rocky_floor_tiles",12,""],["Tile",-5,23,"rocky_floor_tiles",12,""],["Tile",-2,22,"rocky_floor_tiles",12,""],["Tile",-1,15,"rocky_floor_tiles",12,""],["Tile",-1,16,"rocky_floor_tiles",12,""],["Tile",-1,17,"rocky_floor_tiles",12,""],["Tile",-1,19,"rocky_floor_tiles",12,""],["Tile",-1,20,"rocky_floor_tiles",12,""],["Tile",-1,21,"rocky_floor_tiles",12,""],["Tile",0,18,"rocky_floor_tiles",12,""],["Tile",-4,23,"rocky_floor_tiles",12,""],["Tile",-1,22,"rocky_floor_tiles",12,""],["Tile",0,15,"rocky_floor_tiles",12,""],["Tile",0,16,"rocky_floor_tiles",12,""],["Tile",0,17,"rocky_floor_tiles",12,""],["Tile",0,19,"rocky_floor_tiles",12,""],["Tile",0,20,"rocky_floor_tiles",12,""],["Tile",0,21,"rocky_floor_tiles",12,""],["Tile",1,18,"rocky_floor_tiles",12,""],["Tile",-3,23,"rocky_floor_tiles",12,""],["Tile",0,22,"rocky_floor_tiles",12,""],["Tile",1,15,"rocky_floor_tiles",12,""],["Tile",1,16,"rocky_floor_tiles",12,""],["Tile",1,17,"rocky_floor_tiles",12,""],["Tile",1,19,"rocky_floor_tiles",12,""],["Tile",1,20,"rocky_floor_tiles",12,""],["Tile",1,21,"rocky_floor_tiles",12,""],["Tile",2,18,"rocky_floor_tiles",12,""],["Tile",-2,23,"rocky_floor_tiles",12,""],["Tile",1,22,"rocky_floor_tiles",12,""],["Tile",2,15,"rocky_floor_tiles",12,""],["Tile",2,16,"rocky_floor_tiles",12,""],["Tile",2,17,"rocky_floor_tiles",12,""],["Tile",2,19,"rocky_floor_tiles",12,""],["Tile",2,20,"rocky_floor_tiles",12,""],["Tile",2,21,"rocky_floor_tiles",12,""],["Tile",3,18,"rocky_floor_tiles",12,""],["Tile",-1,23,"rocky_floor_tiles",12,""],["Tile",2,22,"rocky_floor_tiles",12,""],["Tile",3,15,"rocky_floor_tiles",12,""],["Tile",3,16,"rocky_floor_tiles",12,""],["Tile",3,17,"rocky_floor_tiles",12,""],["Tile",3,19,"rocky_floor_tiles",12,""],["Tile",3,20,"rocky_floor_tiles",12,""],["Tile",3,21,"rocky_floor_tiles",12,""],["Tile",4,18,"rocky_floor_tiles",12,""],["Tile",4,14,"rocky_floor_tiles",12,""],["Tile",4,15,"rocky_floor_tiles",12,""],["Tile",4,16,"rocky_floor_tiles",12,""],["Tile",4,17,"rocky_floor_tiles",12,""],["Tile",4,19,"rocky_floor_tiles",12,""],["Tile",4,20,"rocky_floor_tiles",12,""],["Prop",4,20,"pine_half05",false],["Tile",5,17,"rocky_floor_tiles",12,""],["Tile",4,21,"rocky_floor_tiles",12,""],["Prop",4,21,"pine_half06",false],["Tile",5,14,"rocky_floor_tiles",12,""],["Tile",5,15,"rocky_floor_tiles",12,""],["Tile",5,16,"rocky_floor_tiles",12,""],["Tile",5,18,"rocky_floor_tiles",12,""],["Tile",5,19,"rocky_floor_tiles",12,""],["Tile",5,20,"rocky_floor_tiles",12,""],["Prop",5,20,"pine_half05",false],["Tile",6,17,"rocky_floor_tiles",12,""],["Tile",3,22,"rocky_floor_tiles",12,""],["Tile",5,21,"rocky_floor_tiles",12,""],["Prop",5,21,"pine_half06",false],["Tile",6,14,"rocky_floor_tiles",12,""],["Tile",6,15,"rocky_floor_tiles",12,""],["Tile",6,16,"rocky_floor_tiles",12,""],["Tile",6,18,"rocky_floor_tiles",12,""],["Tile",6,19,"rocky_floor_tiles",12,""],["Prop",6,19,"pine_half05",false],["Tile",6,20,"rocky_floor_tiles",12,""],["Prop",6,20,"pine_half03",false],["Tile",6,21,"rocky_floor_tiles",12,""],["Tile",7,14,"rocky_floor_tiles",12,""],["Tile",7,15,"rocky_floor_tiles",12,""],["Tile",7,16,"rocky_floor_tiles",12,""],["Tile",7,17,"rocky_floor_tiles",12,""],["Tile",7,18,"rocky_floor_tiles",12,""],["Tile",7,19,"rocky_floor_tiles",12,""],["Tile",7,20,"rocky_floor_tiles",12,""],["Prop",7,20,"pine_half03",false],["Tile",8,17,"rocky_floor_tiles",12,""],["Tile",8,14,"rocky_floor_tiles",12,""],["Tile",8,15,"rocky_floor_tiles",12,""],["Tile",8,16,"rocky_floor_tiles",12,""],["Tile",8,18,"rocky_floor_tiles",12,""],["Tile",8,19,"rocky_floor_tiles",12,""],["Tile",9,16,"rocky_floor_tiles",12,""],["Tile",8,20,"rocky_floor_tiles",12,""],["Tile",9,13,"rocky_floor_tiles",12,""],["Tile",9,14,"rocky_floor_tiles",12,""],["Prop",9,14,"grasses01",true],["Tile",9,15,"rocky_floor_tiles",12,""],["Tile",9,17,"rocky_floor_tiles",12,""],["Tile",9,18,"rocky_floor_tiles",12,""],["Tile",9,19,"rocky_floor_tiles",12,""],["Tile",10,16,"rocky_floor_tiles",12,""],["Tile",9,20,"rocky_floor_tiles",12,""],["Tile",10,13,"rocky_floor_tiles",12,""],["Tile",10,14,"rocky_floor_tiles",12,""],["Tile",10,15,"rocky_floor_tiles",12,""],["Tile",10,17,"rocky_floor_tiles",12,""],["Tile",10,18,"rocky_floor_tiles",12,""],["Tile",10,19,"rocky_floor_tiles",12,""],["Tile",11,16,"rocky_floor_tiles",12,""],["Tile",7,21,"rocky_floor_tiles",12,""],["Tile",10,20,"rocky_floor_tiles",12,""],["Tile",11,13,"rocky_floor_tiles",12,""],["Tile",11,14,"rocky_floor_tiles",12,""],["Tile",11,15,"rocky_floor_tiles",12,""],["Tile",11,17,"rocky_floor_tiles",12,""],["Tile",11,18,"rocky_floor_tiles",12,""],["Tile",11,19,"rocky_floor_tiles",12,""],["Tile",12,16,"rocky_floor_tiles",12,""],["Tile",12,15,"rocky_floor_tiles",12,""],["Tile",12,12,"rocky_floor_tiles",12,""],["Tile",12,13,"rocky_floor_tiles",12,""],["Tile",12,14,"rocky_floor_tiles",12,""],["Tile",12,17,"rocky_floor_tiles",12,""],["Tile",12,18,"rocky_floor_tiles",12,""],["Tile",13,15,"rocky_floor_tiles",12,""],["Tile",13,12,"rocky_floor_tiles",12,""],["Tile",13,13,"rocky_floor_tiles",12,""],["Tile",13,14,"rocky_floor_tiles",12,""],["Tile",13,16,"rocky_floor_tiles",12,""],["Tile",13,17,"rocky_floor_tiles",12,""],["Tile",13,18,"rocky_floor_tiles",12,""],["Tile",14,11,"rocky_floor_tiles",12,""],["Tile",14,12,"rocky_floor_tiles",12,""],["Tile",14,13,"rocky_floor_tiles",12,""],["Tile",14,14,"rocky_floor_tiles",12,""],["Tile",14,15,"rocky_floor_tiles",12,""],["Tile",14,16,"rocky_floor_tiles",12,""],["Tile",14,17,"rocky_floor_tiles",12,""],["Prop",14,17,"pine_half03",false],["Tile",15,14,"rocky_floor_tiles",12,""],["Prop",15,14,"pine_half03",false],["Tile",15,11,"rocky_floor_tiles",12,""],["Tile",15,12,"rocky_floor_tiles",12,""],["Tile",15,13,"rocky_floor_tiles",12,""],["Tile",15,15,"rocky_floor_tiles",12,""],["Tile",15,16,"rocky_floor_tiles",12,""],["Tile",16,13,"rocky_floor_tiles",12,""],["Tile",15,17,"rocky_floor_tiles",12,""],["Tile",16,10,"rocky_floor_tiles",12,""],["Tile",16,11,"rocky_floor_tiles",12,""],["Tile",16,12,"rocky_floor_tiles",12,""],["Tile",16,14,"rocky_floor_tiles",12,""],["Prop",16,14,"pine_half05",false],["Tile",16,15,"rocky_floor_tiles",12,""],["Prop",16,15,"pine_half05",false],["Tile",16,16,"rocky_floor_tiles",12,""],["Tile",17,13,"rocky_floor_tiles",12,""],["Tile",17,12,"rocky_floor_tiles",12,""],["Tile",17,10,"rocky_floor_tiles",12,""],["Tile",17,11,"rocky_floor_tiles",12,""],["Tile",17,14,"rocky_floor_tiles",12,""],["Tile",17,15,"rocky_floor_tiles",12,""],["Tile",18,12,"rocky_floor_tiles",12,""],["Tile",17,16,"rocky_floor_tiles",12,""],["Tile",18,9,"rocky_floor_tiles",12,""],["Tile",18,10,"rocky_floor_tiles",12,""],["Tile",18,11,"rocky_floor_tiles",12,""],["Tile",18,13,"rocky_floor_tiles",12,""],["Tile",18,14,"rocky_floor_tiles",12,""],["Tile",18,15,"rocky_floor_tiles",12,""],["Tile",19,12,"rocky_floor_tiles",12,""],["Tile",19,9,"rocky_floor_tiles",12,""],["Tile",19,10,"rocky_floor_tiles",12,""],["Prop",19,10,"pine_half06",false],["Tile",19,11,"rocky_floor_tiles",12,""],["Tile",19,13,"rocky_floor_tiles",12,""],["Tile",19,14,"rocky_floor_tiles",12,""],["Tile",20,11,"rocky_floor_tiles",12,""],["Tile",19,15,"rocky_floor_tiles",12,""],["Tile",20,9,"rocky_floor_tiles",12,""],["Tile",20,10,"rocky_floor_tiles",12,""],["Tile",20,12,"rocky_floor_tiles",12,""],["Tile",20,13,"rocky_floor_tiles",12,""],["Tile",20,14,"rocky_floor_tiles",12,""],["Tile",21,11,"rocky_floor_tiles",12,""],["Tile",20,15,"rocky_floor_tiles",12,""],["Tile",21,9,"rocky_floor_tiles",12,""],["Tile",21,10,"rocky_floor_tiles",12,""],["Tile",21,12,"rocky_floor_tiles",12,""],["Tile",21,13,"rocky_floor_tiles",12,""],["Tile",21,14,"rocky_floor_tiles",12,""],["Tile",22,11,"rocky_floor_tiles",12,""],["Tile",22,8,"rocky_floor_tiles",12,""],["Tile",22,9,"rocky_floor_tiles",12,""],["Tile",22,10,"rocky_floor_tiles",12,""],["Tile",22,12,"rocky_floor_tiles",12,""],["Tile",22,13,"rocky_floor_tiles",12,""],["Tile",23,10,"rocky_floor_tiles",12,""],["Tile",22,14,"rocky_floor_tiles",12,""],["Tile",23,8,"rocky_floor_tiles",12,""],["Tile",23,9,"rocky_floor_tiles",12,""],["Tile",23,11,"rocky_floor_tiles",12,""],["Tile",23,12,"rocky_floor_tiles",12,""],["Tile",24,8,"rocky_floor_tiles",12,""],["Tile",21,15,"rocky_floor_tiles",12,""],["Tile",21,16,"rocky_floor_tiles",12,""],["Tile",22,15,"rocky_floor_tiles",12,""],["Tile",18,16,"rocky_floor_tiles",12,""],["Tile",19,16,"rocky_floor_tiles",12,""],["Tile",20,16,"rocky_floor_tiles",12,""],["Tile",21,17,"rocky_floor_tiles",12,""],["Tile",22,16,"rocky_floor_tiles",12,""],["Tile",17,17,"rocky_floor_tiles",12,""],["Tile",18,17,"rocky_floor_tiles",12,""],["Tile",19,17,"rocky_floor_tiles",12,""],["Tile",20,17,"rocky_floor_tiles",12,""],["Tile",20,18,"rocky_floor_tiles",12,""],["Tile",22,17,"rocky_floor_tiles",12,""],["Tile",23,17,"rocky_floor_tiles",12,""],["Tile",16,17,"rocky_floor_tiles",12,""],["Tile",17,18,"rocky_floor_tiles",12,""],["Tile",18,18,"rocky_floor_tiles",12,""],["Tile",19,18,"rocky_floor_tiles",12,""],["Tile",20,19,"rocky_floor_tiles",12,""],["Tile",21,18,"rocky_floor_tiles",12,""],["Tile",22,18,"rocky_floor_tiles",12,""],["Tile",16,18,"rocky_floor_tiles",12,""],["Tile",19,19,"rocky_floor_tiles",12,""],["Tile",15,18,"rocky_floor_tiles",12,""],["Tile",16,19,"rocky_floor_tiles",12,""],["Tile",17,19,"rocky_floor_tiles",12,""],["Tile",18,19,"rocky_floor_tiles",12,""],["Tile",19,20,"rocky_floor_tiles",12,""],["Tile",21,19,"rocky_floor_tiles",12,""],["Tile",22,19,"rocky_floor_tiles",12,""],["Tile",14,18,"rocky_floor_tiles",12,""],["Tile",15,19,"rocky_floor_tiles",12,""],["Tile",18,20,"rocky_floor_tiles",12,""],["Tile",13,19,"rocky_floor_tiles",12,""],["Tile",14,19,"rocky_floor_tiles",12,""],["Tile",14,20,"rocky_floor_tiles",12,""],["Tile",15,20,"rocky_floor_tiles",12,""],["Tile",16,20,"rocky_floor_tiles",12,""],["Tile",17,20,"rocky_floor_tiles",12,""],["Tile",17,21,"rocky_floor_tiles",12,""],["Tile",20,20,"rocky_floor_tiles",12,""],["Tile",13,20,"rocky_floor_tiles",12,""],["Tile",14,21,"rocky_floor_tiles",12,""],["Tile",15,21,"rocky_floor_tiles",12,""],["Tile",16,21,"rocky_floor_tiles",12,""],["Tile",17,22,"rocky_floor_tiles",12,""],["Tile",18,21,"rocky_floor_tiles",12,""],["Tile",19,21,"rocky_floor_tiles",12,""],["Tile",20,21,"rocky_floor_tiles",12,""],["Tile",21,20,"rocky_floor_tiles",12,""],["Tile",12,19,"rocky_floor_tiles",12,""],["Tile",12,20,"rocky_floor_tiles",12,""],["Tile",13,21,"rocky_floor_tiles",12,""],["Tile",16,22,"rocky_floor_tiles",12,""],["Tile",11,20,"rocky_floor_tiles",12,""],["Tile",11,21,"rocky_floor_tiles",12,""],["Tile",12,21,"rocky_floor_tiles",12,""],["Tile",12,22,"rocky_floor_tiles",12,""],["Tile",13,22,"rocky_floor_tiles",12,""],["Tile",14,22,"rocky_floor_tiles",12,""],["Tile",15,22,"rocky_floor_tiles",12,""],["Tile",15,23,"rocky_floor_tiles",12,""],["Tile",18,22,"rocky_floor_tiles",12,""],["Tile",11,22,"rocky_floor_tiles",12,""],["Tile",12,23,"rocky_floor_tiles",12,""],["Tile",13,23,"rocky_floor_tiles",12,""],["Tile",14,23,"rocky_floor_tiles",12,""],["Tile",15,24,"rocky_floor_tiles",12,""],["Tile",16,23,"rocky_floor_tiles",12,""],["Tile",17,23,"rocky_floor_tiles",12,""],["Tile",18,23,"rocky_floor_tiles",12,""],["Tile",19,22,"rocky_floor_tiles",12,""],["Tile",10,21,"rocky_floor_tiles",12,""],["Tile",10,22,"rocky_floor_tiles",12,""],["Tile",10,23,"rocky_floor_tiles",12,""],["Prop",10,23,"pine_half05",false],["Tile",11,23,"rocky_floor_tiles",12,""],["Tile",11,24,"rocky_floor_tiles",12,""],["Tile",12,24,"rocky_floor_tiles",12,""],["Tile",13,24,"rocky_floor_tiles",12,""],["Tile",14,24,"rocky_floor_tiles",12,""],["Tile",14,25,"rocky_floor_tiles",12,""],["Tile",16,24,"rocky_floor_tiles",12,""],["Tile",17,24,"rocky_floor_tiles",12,""],["Tile",9,21,"rocky_floor_tiles",12,""],["Tile",9,22,"rocky_floor_tiles",12,""],["Tile",9,23,"rocky_floor_tiles",12,""],["Tile",10,24,"rocky_floor_tiles",12,""],["Tile",13,25,"rocky_floor_tiles",12,""],["Tile",7,22,"rocky_floor_tiles",12,""],["Tile",7,23,"rocky_floor_tiles",12,""],["Tile",7,24,"rocky_floor_tiles",12,""],["Tile",8,21,"rocky_floor_tiles",12,""],["Tile",8,22,"rocky_floor_tiles",12,""],["Tile",8,23,"rocky_floor_tiles",12,""],["Tile",8,24,"rocky_floor_tiles",12,""],["Tile",8,25,"rocky_floor_tiles",12,""],["Tile",9,24,"rocky_floor_tiles",12,""],["Tile",9,25,"rocky_floor_tiles",12,""],["Tile",10,25,"rocky_floor_tiles",12,""],["Tile",11,25,"rocky_floor_tiles",12,""],["Tile",11,26,"rocky_floor_tiles",12,""],["Tile",12,25,"rocky_floor_tiles",12,""],["Tile",5,22,"rocky_floor_tiles",12,""],["Tile",6,22,"rocky_floor_tiles",12,""],["Tile",6,23,"rocky_floor_tiles",12,""],["Tile",6,24,"rocky_floor_tiles",12,""],["Tile",6,25,"rocky_floor_tiles",12,""],["Tile",7,25,"rocky_floor_tiles",12,""],["Tile",7,26,"rocky_floor_tiles",12,""],["Tile",8,26,"rocky_floor_tiles",12,""],["Tile",9,26,"rocky_floor_tiles",12,""],["Tile",10,26,"rocky_floor_tiles",12,""],["Tile",10,27,"rocky_floor_tiles",12,""],["Tile",12,26,"rocky_floor_tiles",12,""],["Tile",13,26,"rocky_floor_tiles",12,""],["Tile",4,23,"rocky_floor_tiles",12,""],["Tile",5,23,"rocky_floor_tiles",12,""],["Tile",5,24,"rocky_floor_tiles",12,""],["Tile",5,25,"rocky_floor_tiles",12,""],["Tile",5,26,"rocky_floor_tiles",12,""],["Tile",6,26,"rocky_floor_tiles",12,""],["Tile",6,27,"rocky_floor_tiles",12,""],["Tile",7,27,"rocky_floor_tiles",12,""],["Tile",8,27,"rocky_floor_tiles",12,""],["Tile",9,27,"rocky_floor_tiles",12,""],["Tile",9,28,"rocky_floor_tiles",12,""],["Tile",11,27,"rocky_floor_tiles",12,""],["Tile",12,27,"rocky_floor_tiles",12,""],["Tile",2,23,"rocky_floor_tiles",12,""],["Tile",3,23,"rocky_floor_tiles",12,""],["Tile",3,24,"rocky_floor_tiles",12,""],["Tile",3,25,"rocky_floor_tiles",12,""],["Tile",3,26,"rocky_floor_tiles",12,""],["Tile",4,22,"rocky_floor_tiles",12,""],["Tile",4,24,"rocky_floor_tiles",12,""],["Tile",4,25,"rocky_floor_tiles",12,""],["Tile",4,26,"rocky_floor_tiles",12,""],["Tile",4,27,"rocky_floor_tiles",12,""],["Tile",5,27,"rocky_floor_tiles",12,""],["Tile",7,28,"rocky_floor_tiles",12,""],["Tile",2,24,"rocky_floor_tiles",12,""],["Tile",3,27,"rocky_floor_tiles",12,""],["Tile",4,28,"rocky_floor_tiles",12,""],["Tile",5,28,"rocky_floor_tiles",12,""],["Tile",6,28,"rocky_floor_tiles",12,""],["Tile",8,28,"rocky_floor_tiles",12,""],["Tile",10,28,"rocky_floor_tiles",12,""],["Tile",1,24,"rocky_floor_tiles",12,""],["Tile",2,25,"rocky_floor_tiles",12,""],["Tile",2,26,"rocky_floor_tiles",12,""],["Tile",2,27,"rocky_floor_tiles",12,""],["Tile",3,28,"rocky_floor_tiles",12,""],["Tile",0,24,"rocky_floor_tiles",12,""],["Tile",1,23,"rocky_floor_tiles",12,""],["Tile",1,25,"rocky_floor_tiles",12,""],["Tile",1,26,"rocky_floor_tiles",12,""],["Tile",1,27,"rocky_floor_tiles",12,""],["Tile",2,28,"rocky_floor_tiles",12,""],["Tile",-1,25,"rocky_floor_tiles",12,""],["Tile",0,23,"rocky_floor_tiles",12,""],["Tile",0,25,"rocky_floor_tiles",12,""],["Tile",0,26,"rocky_floor_tiles",12,""],["Tile",0,27,"rocky_floor_tiles",12,""],["Tile",0,28,"rocky_floor_tiles",12,""],["Tile",1,28,"rocky_floor_tiles",12,""],["Tile",-2,25,"rocky_floor_tiles",12,""],["Tile",-1,24,"rocky_floor_tiles",12,""],["Tile",-1,26,"rocky_floor_tiles",12,""],["Tile",-1,27,"rocky_floor_tiles",12,""],["Tile",-1,28,"rocky_floor_tiles",12,""],["Tile",-3,25,"rocky_floor_tiles",12,""],["Tile",-2,24,"rocky_floor_tiles",12,""],["Tile",-2,26,"rocky_floor_tiles",12,""],["Tile",-2,27,"rocky_floor_tiles",12,""],["Tile",-2,28,"rocky_floor_tiles",12,""],["Tile",-4,25,"rocky_floor_tiles",12,""],["Tile",-3,24,"rocky_floor_tiles",12,""],["Tile",-3,26,"rocky_floor_tiles",12,""],["Tile",-3,27,"rocky_floor_tiles",12,""],["Tile",-3,28,"rocky_floor_tiles",12,""],["Tile",-5,26,"rocky_floor_tiles",12,""],["Tile",-4,24,"rocky_floor_tiles",12,""],["Tile",-4,26,"rocky_floor_tiles",12,""],["Tile",-4,27,"rocky_floor_tiles",12,""],["Tile",-4,28,"rocky_floor_tiles",12,""],["Tile",-6,26,"rocky_floor_tiles",12,""],["Tile",-5,24,"rocky_floor_tiles",12,""],["Tile",-5,25,"rocky_floor_tiles",12,""],["Tile",-5,27,"rocky_floor_tiles",12,""],["Tile",-5,28,"rocky_floor_tiles",12,""],["Tile",-7,26,"rocky_floor_tiles",12,""],["Tile",-6,24,"rocky_floor_tiles",12,""],["Tile",-6,25,"rocky_floor_tiles",12,""],["Tile",-6,27,"rocky_floor_tiles",12,""],["Tile",-6,28,"rocky_floor_tiles",12,""],["Tile",-8,26,"rocky_floor_tiles",12,""],["Tile",-7,24,"rocky_floor_tiles",12,""],["Tile",-7,25,"rocky_floor_tiles",12,""],["Tile",-7,27,"rocky_floor_tiles",12,""],["Tile",-7,28,"rocky_floor_tiles",12,""],["Tile",-9,26,"rocky_floor_tiles",12,""],["Tile",-8,24,"rocky_floor_tiles",12,""],["Tile",-8,25,"rocky_floor_tiles",12,""],["Tile",-8,27,"rocky_floor_tiles",12,""],["Tile",-8,28,"rocky_floor_tiles",12,""],["Tile",-9,27,"rocky_floor_tiles",12,""],["Tile",-10,27,"rocky_floor_tiles",12,""],["Tile",-9,24,"rocky_floor_tiles",12,""],["Tile",-9,25,"rocky_floor_tiles",12,""],["Tile",-9,28,"rocky_floor_tiles",12,""],["Tile",-11,27,"rocky_floor_tiles",12,""],["Tile",-10,24,"rocky_floor_tiles",12,""],["Tile",-10,25,"rocky_floor_tiles",12,""],["Tile",-10,26,"rocky_floor_tiles",12,""],["Tile",-10,28,"rocky_floor_tiles",12,""],["Tile",-12,27,"rocky_floor_tiles",12,""],["Tile",-11,24,"rocky_floor_tiles",12,""],["Tile",-11,25,"rocky_floor_tiles",12,""],["Tile",-11,26,"rocky_floor_tiles",12,""],["Tile",-13,26,"rocky_floor_tiles",12,""],["Tile",-12,23,"rocky_floor_tiles",12,""],["Tile",-12,24,"rocky_floor_tiles",12,""],["Tile",-12,25,"rocky_floor_tiles",12,""],["Tile",-12,26,"rocky_floor_tiles",12,""],["Tile",-12,28,"rocky_floor_tiles",12,""],["Tile",-11,23,"rocky_floor_tiles",12,""],["Tile",-14,26,"rocky_floor_tiles",12,""],["Tile",-13,23,"rocky_floor_tiles",12,""],["Tile",-13,24,"rocky_floor_tiles",12,""],["Tile",-13,25,"rocky_floor_tiles",12,""],["Tile",-13,27,"rocky_floor_tiles",12,""],["Tile",-13,28,"rocky_floor_tiles",12,""],["Tile",-15,26,"rocky_floor_tiles",12,""],["Tile",-14,23,"rocky_floor_tiles",12,""],["Tile",-14,24,"rocky_floor_tiles",12,""],["Tile",-14,25,"rocky_floor_tiles",12,""],["Tile",-14,27,"rocky_floor_tiles",12,""],["Tile",-14,28,"rocky_floor_tiles",12,""],["Tile",-16,26,"rocky_floor_tiles",12,""],["Tile",-15,23,"rocky_floor_tiles",12,""],["Tile",-15,24,"rocky_floor_tiles",12,""],["Tile",-15,25,"rocky_floor_tiles",12,""],["Tile",-15,27,"rocky_floor_tiles",12,""],["Tile",-15,28,"rocky_floor_tiles",12,""],["Tile",-16,25,"rocky_floor_tiles",12,""],["Tile",-17,25,"rocky_floor_tiles",12,""],["Tile",-16,23,"rocky_floor_tiles",12,""],["Tile",-16,24,"rocky_floor_tiles",12,""],["Tile",-16,27,"rocky_floor_tiles",12,""],["Tile",-16,28,"rocky_floor_tiles",12,""],["Tile",-18,25,"rocky_floor_tiles",12,""],["Tile",-17,22,"rocky_floor_tiles",12,""],["Tile",-17,23,"rocky_floor_tiles",12,""],["Tile",-17,24,"rocky_floor_tiles",12,""],["Tile",-17,26,"rocky_floor_tiles",12,""],["Tile",-17,27,"rocky_floor_tiles",12,""],["Tile",-17,28,"rocky_floor_tiles",12,""],["Tile",-19,25,"rocky_floor_tiles",12,""],["Tile",-18,22,"rocky_floor_tiles",12,""],["Tile",-18,23,"rocky_floor_tiles",12,""],["Tile",-18,24,"rocky_floor_tiles",12,""],["Tile",-18,26,"rocky_floor_tiles",12,""],["Tile",-18,27,"rocky_floor_tiles",12,""],["Tile",-18,28,"rocky_floor_tiles",12,""],["Tile",-20,25,"rocky_floor_tiles",12,""],["Tile",-19,22,"rocky_floor_tiles",12,""],["Tile",-19,23,"rocky_floor_tiles",12,""],["Tile",-19,24,"rocky_floor_tiles",12,""],["Tile",-19,26,"rocky_floor_tiles",12,""],["Tile",-19,27,"rocky_floor_tiles",12,""],["Tile",-19,28,"rocky_floor_tiles",12,""],["Tile",-20,24,"rocky_floor_tiles",12,""],["Tile",-21,24,"rocky_floor_tiles",12,""],["Tile",-20,22,"rocky_floor_tiles",12,""],["Tile",-20,23,"rocky_floor_tiles",12,""],["Tile",-20,26,"rocky_floor_tiles",12,""],["Tile",-20,27,"rocky_floor_tiles",12,""],["Tile",-21,23,"rocky_floor_tiles",12,""],["Tile",-21,25,"rocky_floor_tiles",12,""],["Tile",-21,26,"rocky_floor_tiles",12,""],["Tile",-21,27,"rocky_floor_tiles",12,""],["Tile",-20,28,"rocky_floor_tiles",12,""],["Tile",-21,28,"rocky_floor_tiles",12,""],["Tile",-21,-10,"dirt_tiles",1,""],["Tile",-21,-9,"dirt_tiles",1,""],["Tile",-21,-8,"dirt_tiles",1,""],["Tile",-21,-7,"dirt_tiles",1,""],["Tile",-21,-6,"dirt_tiles",1,""],["Tile",-21,-5,"dirt_tiles",1,""],["Tile",-20,-11,"dirt_tiles",1,""],["Tile",-20,-10,"dirt_tiles",1,""],["Tile",-20,-9,"dirt_tiles",1,""],["Tile",-20,-8,"dirt_tiles",1,""],["Tile",-20,-7,"dirt_tiles",1,""],["Tile",-20,-6,"dirt_tiles",1,""],["Tile",-19,-11,"dirt_tiles",1,""],["Tile",-19,-10,"dirt_tiles",1,""],["Tile",-19,-9,"dirt_tiles",1,""],["Tile",-19,-8,"dirt_tiles",1,""],["Tile",-19,-7,"dirt_tiles",1,""],["Tile",-19,-6,"dirt_tiles",1,""],["Tile",-18,-11,"dirt_tiles",1,""],["Tile",-18,-10,"dirt_tiles",1,""],["Tile",-18,-9,"dirt_tiles",1,""],["Tile",-18,-8,"dirt_tiles",1,""],["Prop",-18,-8,"pine_none01",false],["Tile",-18,-7,"dirt_tiles",1,""],["Tile",-17,-12,"dirt_tiles",1,""],["Tile",-17,-11,"dirt_tiles",1,""],["Tile",-17,-10,"dirt_tiles",1,""],["Tile",-17,-9,"dirt_tiles",1,""],["Tile",-17,-8,"dirt_tiles",1,""],["Tile",-16,-11,"dirt_tiles",1,""],["Tile",-16,-10,"dirt_tiles",1,""],["Tile",-16,-9,"dirt_tiles",1,""],["Tile",-16,-8,"dirt_tiles",1,""],["Tile",-15,-11,"dirt_tiles",1,""],["Tile",-15,-10,"dirt_tiles",1,""],["Tile",-15,-9,"dirt_tiles",1,""],["Tile",-15,-8,"dirt_tiles",1,""],["Tile",-14,-11,"dirt_tiles",1,""],["Tile",-14,-10,"dirt_tiles",1,""],["Tile",-14,-9,"dirt_tiles",1,""],["Tile",-13,-10,"dirt_tiles",1,""],["Tile",-13,-9,"dirt_tiles",1,""],["Tile",-16,-12,"dirt_tiles",1,""],["Tile",-13,-11,"dirt_tiles",1,""],["Tile",-12,-10,"dirt_tiles",1,""],["Tile",-12,-9,"dirt_tiles",1,""],["Tile",-18,-12,"dirt_tiles",1,""],["Tile",-15,-13,"dirt_tiles",1,""],["Tile",-15,-12,"dirt_tiles",1,""],["Tile",-14,-12,"dirt_tiles",1,""],["Tile",-13,-12,"dirt_tiles",1,""],["Tile",-12,-12,"dirt_tiles",1,""],["Tile",-12,-11,"dirt_tiles",1,""],["Tile",-11,-11,"dirt_tiles",1,""],["Tile",-11,-10,"dirt_tiles",1,""],["Tile",-13,-13,"dirt_tiles",1,""],["Tile",-11,-12,"dirt_tiles",1,""],["Tile",-10,-12,"dirt_tiles",1,""],["Tile",-10,-11,"dirt_tiles",1,""],["Tile",-10,-10,"dirt_tiles",1,""],["Tile",-9,-11,"dirt_tiles",1,""],["Tile",-9,-10,"dirt_tiles",1,""],["Tile",-16,-13,"dirt_tiles",1,""],["Tile",-14,-13,"dirt_tiles",1,""],["Tile",-12,-13,"dirt_tiles",1,""],["Tile",-11,-13,"dirt_tiles",1,""],["Tile",-9,-12,"dirt_tiles",1,""],["Tile",-8,-12,"dirt_tiles",1,""],["Tile",-8,-11,"dirt_tiles",1,""],["Tile",-8,-10,"dirt_tiles",1,""],["Tile",-7,-12,"dirt_tiles",1,""],["Tile",-7,-11,"dirt_tiles",1,""],["Tile",-7,-10,"dirt_tiles",1,""],["Tile",-6,-10,"dirt_tiles",1,""],["Tile",-6,-12,"dirt_tiles",1,""],["Tile",-6,-11,"dirt_tiles",1,""],["Tile",-6,-9,"dirt_tiles",1,""],["Tile",-5,-13,"dirt_tiles",1,""],["Tile",-5,-12,"dirt_tiles",1,""],["Tile",-5,-11,"dirt_tiles",1,""],["Tile",-5,-10,"dirt_tiles",1,""],["Tile",-4,-13,"dirt_tiles",1,""],["Tile",-4,-12,"dirt_tiles",1,""],["Tile",-4,-11,"dirt_tiles",1,""],["Tile",-4,-10,"dirt_tiles",1,""],["Tile",-3,-11,"dirt_tiles",1,""],["Tile",-3,-13,"dirt_tiles",1,""],["Tile",-3,-12,"dirt_tiles",1,""],["Tile",-3,-10,"dirt_tiles",1,""],["Tile",-3,-9,"dirt_tiles",1,""],["Tile",-2,-11,"dirt_tiles",1,""],["Tile",-2,-13,"dirt_tiles",1,""],["Tile",-2,-12,"dirt_tiles",1,""],["Tile",-2,-10,"dirt_tiles",1,""],["Tile",-2,-9,"dirt_tiles",1,""],["Tile",-1,-11,"dirt_tiles",1,""],["Tile",-1,-13,"dirt_tiles",1,""],["Tile",-1,-12,"dirt_tiles",1,""],["Tile",-1,-10,"dirt_tiles",1,""],["Tile",-1,-9,"dirt_tiles",1,""],["Tile",0,-11,"dirt_tiles",1,""],["Tile",0,-13,"dirt_tiles",1,""],["Tile",0,-12,"dirt_tiles",1,""],["Tile",0,-10,"dirt_tiles",1,""],["Tile",0,-9,"dirt_tiles",1,""],["Tile",1,-12,"dirt_tiles",1,""],["Tile",0,-8,"dirt_tiles",1,""],["Tile",1,-13,"dirt_tiles",1,""],["Tile",1,-11,"dirt_tiles",1,""],["Tile",1,-10,"dirt_tiles",1,""],["Tile",1,-9,"dirt_tiles",1,""],["Tile",2,-12,"dirt_tiles",1,""],["Tile",1,-8,"dirt_tiles",1,""],["Prop",1,-8,"pine_none01",false],["Tile",2,-13,"dirt_tiles",1,""],["Tile",2,-11,"dirt_tiles",1,""],["Tile",2,-10,"dirt_tiles",1,""],["Tile",2,-9,"dirt_tiles",1,""],["Tile",3,-12,"dirt_tiles",1,""],["Tile",2,-8,"dirt_tiles",1,""],["Tile",3,-13,"dirt_tiles",1,""],["Tile",3,-11,"dirt_tiles",1,""],["Tile",3,-10,"dirt_tiles",1,""],["Tile",3,-9,"dirt_tiles",1,""],["Tile",4,-12,"dirt_tiles",1,""],["Tile",3,-8,"dirt_tiles",1,""],["Tile",4,-13,"dirt_tiles",1,""],["Tile",4,-11,"dirt_tiles",1,""],["Tile",4,-10,"dirt_tiles",1,""],["Tile",4,-9,"dirt_tiles",1,""],["Tile",5,-12,"dirt_tiles",1,""],["Tile",1,-7,"dirt_tiles",1,""],["Prop",1,-7,"pine_none06",false],["Tile",4,-8,"dirt_tiles",1,""],["Prop",4,-8,"pine_none01",false],["Tile",5,-13,"dirt_tiles",1,""],["Tile",5,-11,"dirt_tiles",1,""],["Tile",5,-10,"dirt_tiles",1,""],["Tile",5,-9,"dirt_tiles",1,""],["Tile",6,-12,"dirt_tiles",1,""],["Tile",2,-7,"dirt_tiles",1,""],["Tile",6,-13,"dirt_tiles",1,""],["Tile",6,-11,"dirt_tiles",1,""],["Tile",6,-10,"dirt_tiles",1,""],["Tile",6,-9,"dirt_tiles",1,""],["Tile",7,-12,"dirt_tiles",1,""],["Tile",3,-7,"dirt_tiles",1,""],["Tile",7,-13,"dirt_tiles",1,""],["Tile",7,-11,"dirt_tiles",1,""],["Tile",7,-10,"dirt_tiles",1,""],["Tile",8,-12,"dirt_tiles",1,""],["Tile",8,-13,"dirt_tiles",1,""],["Tile",8,-11,"dirt_tiles",1,""],["Tile",8,-10,"dirt_tiles",1,""],["Tile",9,-12,"dirt_tiles",1,""],["Tile",9,-13,"dirt_tiles",1,""],["Tile",9,-11,"dirt_tiles",1,""],["Tile",10,-12,"dirt_tiles",1,""],["Tile",10,-13,"dirt_tiles",1,""],["Tile",10,-11,"dirt_tiles",1,""],["Tile",11,-12,"dirt_tiles",1,""],["Tile",11,-13,"dirt_tiles",1,""],["Tile",11,-11,"dirt_tiles",1,""],["Tile",12,-12,"dirt_tiles",1,""],["Tile",12,-13,"dirt_tiles",1,""],["Tile",13,-12,"dirt_tiles",1,""],["Tile",13,-13,"dirt_tiles",1,""],["Tile",14,-13,"dirt_tiles",1,""],["Tile",14,-12,"dirt_tiles",1,""],["Tile",15,-12,"dirt_tiles",1,""],["Tile",16,-12,"dirt_tiles",1,""],["Tile",17,-12,"dirt_tiles",1,""],["Tile",18,-13,"dirt_tiles",1,""],["Tile",19,-13,"dirt_tiles",1,""],["Tile",19,-12,"dirt_tiles",1,""],["Tile",20,-13,"dirt_tiles",1,""],["Tile",21,-13,"dirt_tiles",1,""],["Tile",22,-13,"dirt_tiles",1,""],["Tile",22,-12,"dirt_tiles",1,""],["Tile",23,-13,"dirt_tiles",1,""],["Tile",23,-12,"dirt_tiles",1,""],["Tile",24,-13,"dirt_tiles",1,""],["Tile",24,-12,"dirt_tiles",1,""],["Tile",-17,-13,"dirt_tiles",1,""],["Tile",-18,-13,"dirt_tiles",1,""],["Tile",-19,-13,"dirt_tiles",1,""],["Tile",-19,-12,"dirt_tiles",1,""],["Tile",-20,-13,"dirt_tiles",1,""],["Tile",-20,-12,"dirt_tiles",1,""],["Tile",-21,-13,"dirt_tiles",1,""],["Tile",-21,-12,"dirt_tiles",1,""],["Tile",-21,-11,"dirt_tiles",1,""],["Tile",-10,-13,"dirt_tiles",1,""],["Tile",-9,-13,"dirt_tiles",1,""],["Tile",-8,-13,"dirt_tiles",1,""],["Tile",-7,-13,"dirt_tiles",1,""],["Tile",-6,-13,"dirt_tiles",1,""],["Tile",15,-13,"dirt_tiles",1,""],["Tile",16,-13,"dirt_tiles",1,""],["Tile",17,-13,"dirt_tiles",1,""],["Tile",24,-3,"rocky_floor_tiles",12,""],["Tile",24,-2,"rocky_floor_tiles",12,""],["Tile",24,-1,"rocky_floor_tiles",12,""],["Tile",24,0,"rocky_floor_tiles",12,""],["Tile",24,9,"rocky_floor_tiles",12,""],["Tile",24,10,"rocky_floor_tiles",12,""],["Tile",24,11,"rocky_floor_tiles",12,""],["Tile",24,12,"rocky_floor_tiles",12,""],["Tile",24,13,"rocky_floor_tiles",12,""],["Tile",24,14,"rocky_floor_tiles",12,""],["Tile",23,15,"rocky_floor_tiles",12,""],["Tile",24,15,"rocky_floor_tiles",12,""],["Tile",23,16,"rocky_floor_tiles",12,""],["Tile",23,18,"rocky_floor_tiles",12,""],["Tile",23,14,"rocky_floor_tiles",12,""],["Tile",23,13,"rocky_floor_tiles",12,""],["Tile",24,16,"rocky_floor_tiles",12,""],["Tile",23,19,"rocky_floor_tiles",12,""],["Tile",24,17,"rocky_floor_tiles",12,""],["Tile",21,21,"rocky_floor_tiles",12,""],["Tile",22,20,"rocky_floor_tiles",12,""],["Tile",23,20,"rocky_floor_tiles",12,""],["Tile",24,18,"rocky_floor_tiles",12,""],["Tile",21,22,"rocky_floor_tiles",12,""],["Tile",22,21,"rocky_floor_tiles",12,""],["Tile",23,21,"rocky_floor_tiles",12,""],["Tile",24,19,"rocky_floor_tiles",12,""],["Tile",20,22,"rocky_floor_tiles",12,""],["Tile",21,23,"rocky_floor_tiles",12,""],["Tile",22,22,"rocky_floor_tiles",12,""],["Tile",23,22,"rocky_floor_tiles",12,""],["Tile",24,20,"rocky_floor_tiles",12,""],["Tile",19,23,"rocky_floor_tiles",12,""],["Tile",20,23,"rocky_floor_tiles",12,""],["Tile",21,24,"rocky_floor_tiles",12,""],["Tile",22,23,"rocky_floor_tiles",12,""],["Tile",23,23,"rocky_floor_tiles",12,""],["Tile",24,21,"rocky_floor_tiles",12,""],["Tile",20,24,"rocky_floor_tiles",12,""],["Tile",18,24,"rocky_floor_tiles",12,""],["Tile",19,24,"rocky_floor_tiles",12,""],["Tile",20,25,"rocky_floor_tiles",12,""],["Tile",22,24,"rocky_floor_tiles",12,""],["Tile",18,25,"rocky_floor_tiles",12,""],["Tile",19,25,"rocky_floor_tiles",12,""],["Tile",20,26,"rocky_floor_tiles",12,""],["Tile",21,25,"rocky_floor_tiles",12,""],["Tile",22,25,"rocky_floor_tiles",12,""],["Tile",18,26,"rocky_floor_tiles",12,""],["Tile",19,26,"rocky_floor_tiles",12,""],["Tile",20,27,"rocky_floor_tiles",12,""],["Tile",21,26,"rocky_floor_tiles",12,""],["Tile",22,26,"rocky_floor_tiles",12,""],["Tile",23,24,"rocky_floor_tiles",12,""],["Tile",17,25,"rocky_floor_tiles",12,""],["Tile",18,27,"rocky_floor_tiles",12,""],["Tile",19,27,"rocky_floor_tiles",12,""],["Tile",20,28,"rocky_floor_tiles",12,""],["Tile",21,27,"rocky_floor_tiles",12,""],["Tile",22,27,"rocky_floor_tiles",12,""],["Tile",23,25,"rocky_floor_tiles",12,""],["Tile",17,26,"rocky_floor_tiles",12,""],["Tile",18,28,"rocky_floor_tiles",12,""],["Tile",19,28,"rocky_floor_tiles",12,""],["Tile",21,28,"rocky_floor_tiles",12,""],["Tile",22,28,"rocky_floor_tiles",12,""],["Tile",23,26,"rocky_floor_tiles",12,""],["Tile",24,24,"rocky_floor_tiles",12,""],["Tile",24,23,"rocky_floor_tiles",12,""],["Tile",24,22,"rocky_floor_tiles",12,""],["Tile",23,27,"rocky_floor_tiles",12,""],["Tile",24,25,"rocky_floor_tiles",12,""],["Tile",23,28,"rocky_floor_tiles",12,""],["Tile",24,26,"rocky_floor_tiles",12,""],["Tile",17,27,"rocky_floor_tiles",12,""],["Tile",17,28,"rocky_floor_tiles",12,""],["Tile",24,28,"rocky_floor_tiles",12,""],["Tile",24,27,"rocky_floor_tiles",12,""],["Tile",16,27,"rocky_floor_tiles",12,""],["Tile",15,27,"rocky_floor_tiles",12,""],["Tile",16,25,"rocky_floor_tiles",12,""],["Tile",16,26,"rocky_floor_tiles",12,""],["Tile",16,28,"rocky_floor_tiles",12,""],["Tile",14,27,"rocky_floor_tiles",12,""],["Tile",15,25,"rocky_floor_tiles",12,""],["Tile",15,26,"rocky_floor_tiles",12,""],["Tile",15,28,"rocky_floor_tiles",12,""],["Tile",14,26,"rocky_floor_tiles",12,""],["Tile",14,28,"rocky_floor_tiles",12,""],["Tile",13,27,"rocky_floor_tiles",12,""],["Tile",13,28,"rocky_floor_tiles",12,""],["Tile",12,28,"rocky_floor_tiles",12,""],["Tile",11,28,"rocky_floor_tiles",12,""],["Tile",-11,28,"rocky_floor_tiles",12,""]]}],"transitions":[]}]}');

    this.playerPos = new Point();
    this.cameraOffsetPos = new Point();

    this.tileMode = TileMode.Add;
    this.swipeMode = SwipeMode.Off;
    this.canPlaceObject = true;
    this.inMenu = false;
    this.brushSize = 0;
    this.showDebugTiles = false;

    // Texts
    this.moveText = this.add.text(30, 30, "Move (WASD)", { color: '#000000', fontSize: '18px' });
    this.moveFasterText = this.add.text(30, 50, "Move Faster (Hold Shift)", { color: '#000000', fontSize: '18px' });
    this.tileModeText = this.add.text(30, 80, "TileMode : " + this.tileMode, { color: '#000000', fontSize: '18px' });
    this.addText = this.add.text(60, 100, "Add (Z)", { color: '#000000', fontSize: '18px' });
    this.deleteText = this.add.text(60, 120, "Delete (X)", { color: '#000000', fontSize: '18px' });
    this.configureText = this.add.text(60, 140, "Configure (C)", { color: '#000000', fontSize: '18px' });
    this.swipeText = this.add.text(60, 160, "Swipe (Space) : " + this.swipeMode, { color: '#000000', fontSize: '18px' });
    this.brushSizeText = this.add.text(60, 180, "Brush Size (-/+) : " + this.brushSize, { color: '#000000', fontSize: '18px' });
    this.zoomText = this.add.text(30, 210, "Zoom In/Out (Scroll)", { color: '#000000', fontSize: '18px' });
    this.newActText = this.add.text(30, 240, "New Act (U)", { color: '#000000', fontSize: '18px' });
    this.renameActText = this.add.text(30, 260, "Rename Act (I)", { color: '#000000', fontSize: '18px' });
    this.changeActText = this.add.text(30, 280, "Change Act (O/P)", { color: '#000000', fontSize: '18px' });
    this.deleteActText = this.add.text(30, 300, "Delete Act (Delete)", { color: '#000000', fontSize: '18px' });
    this.newAreaText = this.add.text(30, 330, "New Area (H)", { color: '#000000', fontSize: '18px' });
    this.renameAreaText = this.add.text(30, 350, "Rename Area (J)", { color: '#000000', fontSize: '18px' });
    this.changeAreaText = this.add.text(30, 370, "Change Area (K/L)", { color: '#000000', fontSize: '18px' });
    this.deleteAreaText = this.add.text(30, 390, "Delete Area (~)", { color: '#000000', fontSize: '18px' });
    this.createTransitionText = this.add.text(30, 420, "New Transition (T)", { color: '#000000', fontSize: '18px' });
    this.deleteTransitionText = this.add.text(30, 440, "Delete Transition (Y)", { color: '#000000', fontSize: '18px' });
    this.toggleDebugTiles = this.add.text(30, 470, "Toggle Debug Tiles (.)", { color: '#000000', fontSize: '18px' });
    this.quitText = this.add.text(30, 500, "Quit (\\)", { color: '#000000', fontSize: '18px' });

    this.unitPosText = this.add.text(1250, 30, "Unit Pos : 0,0", { color: '#000000', fontSize: '24px', align: 'right' });
    this.tilePosText = this.add.text(1250, 60, "Tile Pos : 0,0", { color: '#000000', fontSize: '24px', align: 'right' });
    this.currentActText = this.add.text(1250, 90, "Act (1/1) : ", { color: '#000000', fontSize: '24px', align: 'right' });
    this.currentAreaText = this.add.text(1250, 120, "Area (1/1) : ", { color: '#000000', fontSize: '24px', align: 'right' });

    this.unitPosText.setOrigin(1, 0);
    this.tilePosText.setOrigin(1, 0);
    this.currentActText.setOrigin(1, 0);
    this.currentAreaText.setOrigin(1, 0);

    // Forms
    this.renameActInput = new TextInput(this, 1250, 90, 0, 'Renaming act (Enter to submit): ', { color: '#000000', fontSize: '24px', align: 'right' });
    this.renameActInput.onSubmit = () => { this.renameAct() };
    this.renameActInput.focused = false;
    this.renameActInput.visible = false;
    this.renameActInput.setOrigin(1, 0);
    this.renameActInput.setBackgroundVisibility(false);
    this.renameActInput.setPadding(0);

    this.renameAreaInput = new TextInput(this, 1250, 120, 0, 'Renaming area (Enter to submit): ', { color: '#000000', fontSize: '24px', align: 'right' });
    this.renameAreaInput.onSubmit = () => { this.renameArea() };
    this.renameAreaInput.focused = false;
    this.renameAreaInput.visible = false;
    this.renameAreaInput.setOrigin(1, 0);
    this.renameAreaInput.setBackgroundVisibility(false);
    this.renameAreaInput.setPadding(0);

    this.transitionForm = new TransitionForm(this, CampaignManager.getInstance().getCampaign(), () => this.hideTransitionForm());
    this.transitionForm.hide();

    this.configureTileForm = new ConfigureTileForm(this, CampaignManager.getInstance().getCampaign(), () => this.hideConfigureTileForm());
    this.configureTileForm.hide();

    this.deleteTransitionForm = new DeleteTransitionForm(this, CampaignManager.getInstance().getCampaign(), () => this.hideDeleteTransitionForm());
    this.deleteTransitionForm.hide();

    this.gameObjectSelector = new GameObjectSelector(this);

    this.configureSpawnerForm = new ConfigureSpawnerForm(this, () => this.hideConfigureSpawnerForm());
    this.configureSpawnerForm.hide();

    // Inputs
    if (this.input && this.input.keyboard) {
      this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    // Prevent DOM from handling tab key
    this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TAB, true);

    this.input.on('pointerdown', (pointer, objects) => {
      if (objects.length === 0) {
        this.tileModeClick();
        this.canPlaceObject = true;
      }
      else
        this.canPlaceObject = false;
    });

    this.input!.keyboard!.on('keydown', (event: KeyboardEvent) => this.handleKeyDown(event));
    this.input.on('wheel', (pointer, currentlyOver, dx, dy, dz, event) => this.zoom(dy));

    // Handle cameras to make only specific elements affected by zoom
    this.cameras.main.ignore(
      [
        this.moveText,
        this.moveFasterText,
        this.tileModeText,
        this.addText,
        this.deleteText,
        this.configureText,
        this.swipeText,
        this.brushSizeText,
        this.zoomText,
        this.changeAreaText,
        this.renameAreaText,
        this.newAreaText,
        this.deleteAreaText,
        this.changeActText,
        this.renameActText,
        this.newActText,
        this.deleteActText,
        this.createTransitionText,
        this.deleteTransitionText,
        this.toggleDebugTiles,
        this.quitText,
        this.unitPosText,
        this.tilePosText,
        this.currentActText,
        this.currentAreaText,
        this.renameActInput,
        this.renameAreaInput,
        this.transitionForm,
        this.deleteTransitionForm,
        this.configureTileForm,
        this.gameObjectSelector,
        this.configureSpawnerForm,
      ]
    );
  }

  update() {
    this.handleCameraMovement();

    this.cursorUnitPos = new Phaser.Geom.Point(
      ((this.pointer.x - this.centerPoint.x + this.playerPos.x) / this.cameras.main.zoom) + this.cameraOffsetPos.x,
      ((this.pointer.y - this.centerPoint.y + this.playerPos.y) / this.cameras.main.zoom) + this.cameraOffsetPos.y
    );
    this.cursorTilePos = TileModule.getTilePosFromUnitPos(this.cursorUnitPos.x, this.cursorUnitPos.y);

    this.unitPosText.setText("Unit Pos : " + Math.round(this.cursorUnitPos.x) + ", " + Math.round(this.cursorUnitPos.y));
    this.tilePosText.setText("Tile Pos : " + this.cursorTilePos.x + ", " + this.cursorTilePos.y);
    this.currentActText.setText("Act (" + (CampaignManager.getInstance().getActIndex() + 1) + "/" + CampaignManager.getInstance().getActAmount() + ") : " + CampaignManager.getInstance().getActName());
    this.currentAreaText.setText("Area (" + (CampaignManager.getInstance().getAreaIndex() + 1) + "/" + CampaignManager.getInstance().getAreaAmount() + ") : " + CampaignManager.getInstance().getAreaName());
    this.cameras.main.setScroll(
      this.playerPos.x + this.cameraOffsetPos.x - this.cameras.main.width / 2,
      this.playerPos.y + this.cameraOffsetPos.y - this.cameras.main.height / 2
    );

    // Detect swipe + hold click (tilemode)
    if (this.swipeMode === SwipeMode.On && this.pointer.leftButtonDown() && this.canPlaceObject === true)
      this.tileModeClick();

    // Adjust brush size if placing spawners
    if (this.gameObjectSelector.getCurrentTab() === GameObjectSelector.SPAWNERS_TAB_KEY)
      this.brushSize = 0;

    this.drawTileSet();
  }

  private handleCameraMovement(): void {
    const MOVE_SPEED = MapEditor.MOVE_CAMERA_SPEED * (this.shiftKey.isDown ? MapEditor.MOVE_CAMERA_FASTER_MULTIPLIER : 1);

    if (this.inMenu) return;

    // Move camera left
    if (this.aKey.isDown)
      this.cameraOffsetPos.x -= MOVE_SPEED;

    // Move camera right
    if (this.dKey.isDown)
      this.cameraOffsetPos.x += MOVE_SPEED;

    // Move camera up
    if (this.wKey.isDown)
      this.cameraOffsetPos.y -= MOVE_SPEED;

    // Move camera down
    if (this.sKey.isDown)
      this.cameraOffsetPos.y += MOVE_SPEED;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.inMenu) return;

    const PRESSED_KEY = event.key.toLowerCase();

    if (PRESSED_KEY === 'z') {
      this.changeTileMode(TileMode.Add);
      this.gameObjectSelector.setVisible(true);
    }

    else if (PRESSED_KEY === 'x') {
      this.changeTileMode(TileMode.Delete);
      this.gameObjectSelector.setVisible(false);
    }

    else if (PRESSED_KEY === 'c') {
      this.changeTileMode(TileMode.Configure);
      this.gameObjectSelector.setVisible(false);
    }

    else if (PRESSED_KEY === ' ') {
      this.swipeMode = (this.swipeMode === SwipeMode.Off ? SwipeMode.On : SwipeMode.Off);
      this.swipeText.setText("Swipe (Space) : " + this.swipeMode);
    }

    else if (PRESSED_KEY === '-' && this.brushSize > MapEditor.MIN_BRUSH_SIZE) {
      this.brushSize--;
      this.brushSizeText.setText("Brush Size (-/+) : " + this.brushSize);
    }

    else if (PRESSED_KEY === '+' && this.brushSize < MapEditor.MAX_BRUSH_SIZE) {
      this.brushSize++;
      this.brushSizeText.setText("Brush Size (-/+) : " + this.brushSize);
    }

    // New act
    else if (PRESSED_KEY === 'u') {
      CampaignManager.getInstance().addAct("New Act");
    }

    // Rename current act
    else if (PRESSED_KEY === 'i') {
      this.inMenu = true;
      this.renameActInput.focused = true;
      this.renameActInput.visible = true;
      this.currentActText.visible = false;
      this.renameActInput.updateInputText(CampaignManager.getInstance().getActName());
    }

    // Go to previous act
    else if (PRESSED_KEY === 'o')
      CampaignManager.getInstance().previousAct();

    // Go to next act
    else if (PRESSED_KEY === 'p')
      CampaignManager.getInstance().nextAct();

    // Delete current act
    else if (PRESSED_KEY === 'delete')
      CampaignManager.getInstance().deleteCurrentAct();

    // New area
    else if (PRESSED_KEY === 'h')
      CampaignManager.getInstance().addArea("New Area");

    // Rename current area
    else if (PRESSED_KEY === 'j') {
      this.inMenu = true;
      this.renameAreaInput.focused = true;
      this.renameAreaInput.visible = true;
      this.currentAreaText.visible = false;
      this.renameAreaInput.updateInputText(CampaignManager.getInstance().getAreaName());
    }

    // Go to previous area
    else if (PRESSED_KEY === 'k')
      CampaignManager.getInstance().previousArea();

    // Go to next area
    else if (PRESSED_KEY === 'l')
      CampaignManager.getInstance().nextArea();

    // Delete current area
    else if (PRESSED_KEY === '~')
      CampaignManager.getInstance().deleteCurrentArea();

    // Create transition
    else if (PRESSED_KEY === 't') {
      this.transitionForm.show();
      this.inMenu = true;
    }

    // Delete transition
    else if (PRESSED_KEY === 'y') {
      this.deleteTransitionForm.show();
      this.inMenu = true;
    }

    // Toggle debug tiles
    else if (PRESSED_KEY === '.')
      this.showDebugTiles = !this.showDebugTiles;

    // Exit map editor
    else if (PRESSED_KEY === '\\')
      this.scene.start('MainScene');

    const EXPORT = CampaignSerializer.export(CampaignManager.getInstance().getCampaign());
    console.log(EXPORT);
  }

  private tileModeClick(): void {
    if (this.inMenu) return;

    const CURSOR_TILES_POS = TileModule.getProximityTilePos(this.cursorTilePos.x, this.cursorTilePos.y, this.brushSize);

    if (this.tileMode === TileMode.Add)
      for (const TILE_POS of CURSOR_TILES_POS)
        CampaignManager.getInstance().addGameObject(this.gameObjectSelector.getSelectedGameObject(TILE_POS.x, TILE_POS.y));

    else if (this.tileMode === TileMode.Delete)
      for (const TILE_POS of CURSOR_TILES_POS)
        CampaignManager.getInstance().deleteGameObjects(TILE_POS.x, TILE_POS.y);

    else if (this.tileMode === TileMode.Configure) {
      this.configure(this.cursorTilePos.x, this.cursorTilePos.y);
    }
  }

  private configure(tileX: number, tileY: number) {
    // Check if trying to configure spawner
    const SPAWNER: Spawner | undefined = CampaignManager.getInstance().getGameObjectByType(tileX, tileY, Spawner);
    if (SPAWNER) {
      this.inMenu = true;
      this.configureSpawnerForm.show(SPAWNER);
      return;
    }

    // Check if trying to configure tile
    const TILE: Tile | undefined = CampaignManager.getInstance().getTile(tileX, tileY);
    if (TILE) {
      this.inMenu = true;
      this.configureTileForm.show(TILE);
    }
  }

  private zoom(dy: number): void {
    if (this.inMenu) return;

    let newZoom = this.cameras.main.zoom + (dy * MapEditor.ZOOM_SPEED / 1000);
    newZoom = Math.min(Math.max(newZoom, MapEditor.MIN_ZOOM), MapEditor.MAX_ZOOM);
    this.cameras.main.setZoom(newZoom);
  }

  private drawTileSet(): void {
    CampaignManager.getInstance().clearDebugTiles();

    if (this.showDebugTiles) {
      CampaignManager.getInstance().drawDebugPoint(this.playerPos.x, this.playerPos.y, TileColor.Player);
      CampaignManager.getInstance().drawDebugTile(this.playerPos.x, this.playerPos.y, TileColor.Player);
      CampaignManager.getInstance().drawDebugCurrentTileSet();
      CampaignManager.getInstance().drawDebugSpawnerRange();
    }

    // Draw cursor tile
    let cursorColor = 0x000000;
    if (this.tileMode === TileMode.Add) cursorColor = TileColor.Floor;
    else if (this.tileMode === TileMode.Delete) cursorColor = TileColor.Delete;
    else if (this.tileMode === TileMode.Configure) cursorColor = TileColor.Configure;

    if (this.tileMode === TileMode.Configure)
      // Don't apply brush size when in "configure" mode
      CampaignManager.getInstance().drawDebugTile(this.cursorUnitPos.x, this.cursorUnitPos.y, cursorColor);
    else
      CampaignManager.getInstance().drawDebugProximityTilePos(this.cursorUnitPos.x, this.cursorUnitPos.y, cursorColor, this.brushSize);
  }

  private renameAct(): void {
    CampaignManager.getInstance().renameAct(this.renameActInput.inputText);
    this.renameActInput.focused = false;
    this.renameActInput.visible = false;
    this.currentActText.visible = true;
    this.inMenu = false;
  }

  private renameArea(): void {
    CampaignManager.getInstance().renameArea(this.renameAreaInput.inputText);
    this.renameAreaInput.focused = false;
    this.renameAreaInput.visible = false;
    this.currentAreaText.visible = true;
    this.inMenu = false;
  }

  private hideTransitionForm(): void {
    this.inMenu = false;
    this.transitionForm.hide();
  }

  private hideConfigureTileForm(): void {
    this.inMenu = false;
    this.configureTileForm.hide();
  }

  private hideDeleteTransitionForm(): void {
    this.inMenu = false;
    this.deleteTransitionForm.hide();
  }

  private hideConfigureSpawnerForm(): void {
    this.inMenu = false;
    this.configureSpawnerForm.hide();
  }

  private changeTileMode(mode: TileMode): void {
    this.tileMode = mode;
    this.tileModeText.setText("TileMode : " + mode);
  }
}
