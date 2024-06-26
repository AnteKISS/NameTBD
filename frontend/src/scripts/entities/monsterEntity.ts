import { ActiveEntity } from './activeEntity';
import NotImplementedError from '../errors/notImplementedError';
import { AnimationManager } from '../managers/animationManager';
import { getOrientationString } from '../enums/entityOrientation';
import { MathModule } from '../utilities/mathModule';
import { Physics } from '../physics/collider';
import { IFightable } from './IFightable';
import { BaseEntity } from './baseEntity';
import { time } from 'console';
import { EntityManager } from '../managers/entityManager';
import { InventorySprite } from './inventorySprite';
import { ActiveEntityAnimator } from './activeEntityAnimator';
import { ActiveEntityAnimationState, ActiveEntityBehaviorState } from './entityState';
import { Behavior } from '../behaviors/behavior';
import { RusherBehavior } from '../behaviors/rusherBehavior';

export class MonsterEntity extends ActiveEntity implements IFightable {

  public baseSprite: InventorySprite;
  public hitArea: Phaser.Geom.Rectangle;
  public currentBehaviorState: ActiveEntityBehaviorState;
  public behavior: Behavior;

  constructor(scene, monsterCode) {
    super(scene);
    this.code = monsterCode;
    scene.add.existing(this);
    this.type = 'MonsterEntity';
    this.baseSprite = scene.add.sprite(0, 0, 'baseTexture');
    this.baseSprite.scale = 1.5;
    this.baseSprite.textureName = monsterCode.toUpperCase();
    this.add(this.baseSprite);
    this.initializeAnimations();

    this.baseSprite.setOrigin(0.5, 0.75);
    this.setDepth(0);
    this.truncatedSpriteWidth = 32 * this.baseSprite.scaleX;
    this.truncatedSpriteHeight = 64 * this.baseSprite.scaleY;

    this.positionX = this.scene.cameras.main.width / 2;
    this.positionY = this.scene.cameras.main.height / 2;

    this.baseSprite.setInteractive({ hitArea: new Phaser.Geom.Rectangle(this.truncatedSpriteWidth, this.truncatedSpriteHeight * this.originY, 32, 64), hitAreaCallback: Phaser.Geom.Rectangle.Contains });

    this.baseSprite.on('pointerover', (pointer: Phaser.Input.Pointer) => {
      window['selectedMonster'] = this;
    });
    this.baseSprite.on('pointerout', (pointer: Phaser.Input.Pointer) => {
      window['selectedMonster'] = null;
    });

    this.currentBehaviorState = new ActiveEntityBehaviorState();
    this.currentBehaviorState.state = ActiveEntityBehaviorState.State.IDLE;

    this.collider = new Physics.Collider(this, this.baseSprite, this.onSpriteColliding, this.onEntityColliding);
    this.animator = new ActiveEntityAnimator(this);
    this.behavior = new RusherBehavior(this);
  }

  // Getters/Setters


  // Methods
  public update(time: number, deltaTime: number): void {
    
    this.updatePosition();
    this.animator.update(time, deltaTime);
    this.behavior.update(time, deltaTime);

    if (this._debugMode) {
      this.collider.displayDebugGraphics();
    }
    this.collider.checkSpriteCollision();
    this.setOrientationRad(Phaser.Math.Angle.Between(this.positionX, this.positionY, this.destinationX, this.destinationY));
  }

  public reset(): void {
    throw new NotImplementedError();
  }

  public initializeAnimations(): void {
    AnimationManager.createAnimations(this, `${this.code}_AnimationConfig`);
  }

  public attack(target: IFightable): void {
    throw new NotImplementedError();
  }

  public damage(amount: number): void {
    // TODO: take into account gear, active effects then apply damage
    if (this.stats.health == 0) {
      return;
    }
    this.stats.health -= amount;
    if (this.stats.health <= 0) {
      this.stats.health = 0;
      this.destinationX = this.positionX;
      this.destinationY = this.positionY;
      this.currentAnimationState.state = ActiveEntityAnimationState.State.DEATH;
      this.currentBehaviorState.state = ActiveEntityBehaviorState.State.DEATH;
    }
  }

  public isAttacking(): boolean {
    // TODO: Add a boolean attribute that is set if the player is attacking instead of validating with an animation state
    return this.currentAnimationState.state == ActiveEntityAnimationState.State.MELEEATTACK || this.currentAnimationState.state == ActiveEntityAnimationState.State.MELEEATTACK_2;
  }

  public isDead(): boolean {
    return this.stats.health <= 0;
  }

  public onPointerOver(): void {
    // console.log('pointerover');
  }

  onSpriteColliding = (hitEntity: BaseEntity): void => {
    if (hitEntity.list.length == 0) {
      return;
    }
    let selfHeight: number = this.positionY + this.baseSprite.displayHeight;
    let otherHeight: number = hitEntity.positionY + (hitEntity.list.at(0) as Phaser.GameObjects.Sprite).displayHeight;
    if (selfHeight < otherHeight) {
      this.depth = 0;
      hitEntity.depth = 1;
    } else {
      this.depth = 1;
      hitEntity.depth = 0;
    }
  }

  onEntityColliding = (hitEntity: BaseEntity): void => {

  }
}
