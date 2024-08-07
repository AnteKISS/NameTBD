import { EntityOrientation } from '../enums/entityOrientation';
import { Physics } from '../physics/collider';
import Area from '../tiles/area';

export abstract class BaseEntity extends Phaser.GameObjects.Container {

  public id: number;
  public uuid: string;
  public code: string;
  public orientation: EntityOrientation = EntityOrientation.DOWN;
  public isResetReady: boolean = false;
  public truncatedSpriteWidth: number;
  public truncatedSpriteHeight: number;
  public collider: Physics.Collider;
  public isTargetable: boolean = false;
  public area: Area;

  protected _positionX: number = 0;
  protected _positionY: number = 0;
  protected _orientation_rad: number;
  protected _debugMode: boolean = false;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    scene.cameras.getCamera("uiCamera")?.ignore(this);
    scene.cameras.getCamera("minimapCamera")?.ignore(this);
    this.type = 'BaseEntity';
    this.uuid = Phaser.Math.RND.uuid();
  }

  // Properties
  public get positionX(): number {
    return this._positionX;
  }

  public set positionX(v: number) {
    this._positionX = v;
    this.setX(v)
  }

  public get positionY(): number {
    return this._positionY;
  }

  public set positionY(v: number) {
    this._positionY = v;
    this.setY(v);
  }

  // Methods
  public getType(): string {
    return this.type;
  }

  public updateOrientation(): boolean {
    let orientation_deg = Phaser.Math.RadToDeg(this._orientation_rad);
    let currentOrientation = this.orientation;
    if ((orientation_deg >= -22.5 && orientation_deg < 0) || (orientation_deg >= 0 && orientation_deg < 22.5)) {
      this.orientation = EntityOrientation.RIGHT;
    } else if (orientation_deg >= 22.5 && orientation_deg < 67.5) {
      this.orientation = EntityOrientation.DOWN_RIGHT;
    } else if (orientation_deg >= 67.5 && orientation_deg < 112.5) {
      this.orientation = EntityOrientation.DOWN;
    } else if (orientation_deg >= 112.5 && orientation_deg < 157.5) {
      this.orientation = EntityOrientation.DOWN_LEFT;
    } else if ((orientation_deg >= 157.5 && orientation_deg <= 180) || (orientation_deg >= -180 && orientation_deg < -157.5)) {
      this.orientation = EntityOrientation.LEFT;
    } else if (orientation_deg >= -157.5 && orientation_deg < -112.5) {
      this.orientation = EntityOrientation.UP_LEFT;
    } else if (orientation_deg >= -112.5 && orientation_deg < -67.5) {
      this.orientation = EntityOrientation.UP;
    } else if (orientation_deg >= -67.5 && orientation_deg < -22.5) {
      this.orientation = EntityOrientation.UP_RIGHT;
    }
    return currentOrientation != this.orientation;
  }

  public setDebugMode(enableDebugMode: boolean): void {
    this._debugMode = enableDebugMode;
  }

  abstract update(time: number, deltaTime: number): void;
  abstract reset(): void;
  abstract initializeAnimations(): void;
  abstract onSpriteColliding(hitEntity: BaseEntity): void;
  abstract onEntityColliding(hitEntity: BaseEntity): void;
  abstract getSprite(): Phaser.GameObjects.Sprite;
}
