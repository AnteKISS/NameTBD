import { ActiveEntity } from "../entities/activeEntity";
import { ActiveEntityAnimationState, ActiveEntityBehaviorState } from "../entities/entityState";
import { MonsterEntity } from "../entities/monsterEntity";
import { PlayerEntity } from "../entities/playerEntity";
import Point from "../types/point";
import Vector from "../types/vector";
import { MathModule } from "../utilities/mathModule";
import { Behavior } from "./behavior";
import { BehaviorFactors } from "./behaviorFactors";

class SkirmisherBehaviorFactors implements BehaviorFactors {
  retreatFactor: number = 0.00;
  roamFactor: number = 0.25;
  meleeAttackFactor: number = 1.00;
  rangeAttackFactor: number = 0.50;
  castFactor: number = 0.00;
  attackCooldownFactor: number = 0.25;
}

export class SkirmisherBehavior extends Behavior {

  private lastTargetKnownPosition: Point = { x: 0, y: 0 };
  
  public constructor(parent: ActiveEntity) {
    super(parent);
    this.factors = new SkirmisherBehaviorFactors();
  }

  public selectTarget(): void {
    const entities: ActiveEntity[] = this.getNearbyEnemies();
    if (entities.length <= 0) {
      return;
    }
    let target: ActiveEntity = entities.at(0)!;
    this.parent.target = target;
    this.setBehaviorState(ActiveEntityBehaviorState.State.CHARGING);
  }

  public update(time: number, deltaTime: number): void {
    const factor: number = Math.random();
    const monster = this.parent as MonsterEntity;

    this.attackCooldown_ms -= deltaTime;
    this.roamCooldown_ms -= deltaTime;
    
    switch (monster.currentBehaviorState.state) {
      case ActiveEntityBehaviorState.State.IDLE:
        if (this.factors.roamFactor <= 0) {

        }
        if (this.roamCooldown_ms <= 0) {
          this.setBehaviorState(ActiveEntityBehaviorState.State.ROAMING);
          this.roamCooldown_ms = this.delayBetweenRoam * this.factors.roamFactor;
        }
        if (!this.isTargetValid()) {
          this.selectTarget();
        }
        break;
      case ActiveEntityBehaviorState.State.CHARGING:
        this.parent.animator.setFutureAnimatorState(ActiveEntityAnimationState.State.RUN);
        if (this.parent.animator.isNonReapeatingAnimationPlaying()) {
          return;
        }
        if (!this.isTargetValid() || !this.isTargetInRange(this.parent.totalModifierStats.sightDistance)) {
          this.parent.target = null;
          this.setBehaviorState(ActiveEntityBehaviorState.State.IDLE);
          if (this.lastTargetKnownPosition.x !== 0 && this.lastTargetKnownPosition.y !== 0) {
            setTimeout(() => {
              this.parent.setDestination(this.lastTargetKnownPosition.x, this.lastTargetKnownPosition.y);
              this.lastTargetKnownPosition = { x: 0, y: 0 };
              this.setBehaviorState(ActiveEntityBehaviorState.State.CHARGING);
            }, 1000);
          }
        }
        else if (this.isTargetValid() && !this.isEntityInMeleeRange()) {
          if (this.parent.spellBook.getAllSpells()[0].canCast()) {
            if (this.parent.code === 'wyvern_composite') {
              this.setBehaviorState(ActiveEntityBehaviorState.State.CASTING_SPELL);
            } else {
              this.setBehaviorState(ActiveEntityBehaviorState.State.RANGED_ATTACKING);
            }
          } else {
            const parentPos: Point = { x: this.parent.positionX, y: this.parent.positionY };
            const targetPos: Point = { x: this.parent.target!.positionX, y: this.parent.target!.positionY };
            let vector: Vector = MathModule.normalizeVector(MathModule.getInverseVectorFromTarget(parentPos, targetPos));
            vector.x *= this.parent.totalModifierStats.sightDistance;
            vector.y *= this.parent.totalModifierStats.sightDistance;
            this.parent.setDestination(parentPos.x + vector.x, parentPos.y + vector.y);
            this.lastTargetKnownPosition = { x: this.parent.target!.positionX, y: this.parent.target!.positionY };
          }
        } else if (this.isEntityInMeleeRange()) {
          this.setBehaviorState(ActiveEntityBehaviorState.State.MELEE_ATTACKING);
        }
        break;        
      case ActiveEntityBehaviorState.State.RUN:
        // Might not be necessary
        break;
      case ActiveEntityBehaviorState.State.ROAMING:
        const roamPoint = MathModule.getRandomPointInCircle(this.parent.positionX, this.parent.positionY, 100);
        this.parent.setDestination(roamPoint.x, roamPoint.y);
        this.setBehaviorState(ActiveEntityBehaviorState.State.IDLE);
        break;
      case ActiveEntityBehaviorState.State.MELEE_ATTACKING:
        this.attackCooldown_ms = this.delayBetweenAttack * this.factors.attackCooldownFactor;
        if (!this.isTargetValid()) {
          this.setBehaviorState(ActiveEntityBehaviorState.State.IDLE);
        } else if (!this.isEntityInMeleeRange()) {
          this.setBehaviorState(ActiveEntityBehaviorState.State.CHARGING);
        } else {
          this.parent.setDestination(this.parent.positionX, this.parent.positionY);
          if (factor >= 0.5) {
            this.parent.animator.setAnimatorState(ActiveEntityAnimationState.State.MELEEATTACK);
          } else {
            this.parent.animator.setAnimatorState(ActiveEntityAnimationState.State.MELEEATTACK_2);
          }
        }
        break;
      case ActiveEntityBehaviorState.State.RANGED_ATTACKING:
        this.attackCooldown_ms = this.delayBetweenAttack * this.factors.attackCooldownFactor;
        if (!this.isTargetValid()) {
          this.setBehaviorState(ActiveEntityBehaviorState.State.IDLE);
        }
        if (!this.parent.spellBook.getAllSpells()[0].canCast()) {
          if (this.isEntityInMeleeRange()) {
            this.setBehaviorState(ActiveEntityBehaviorState.State.MELEE_ATTACKING);
          } else {
            // this.parent.animator.setAnimatorState(ActiveEntityAnimationState.State.IDLE);
            this.setBehaviorState(ActiveEntityBehaviorState.State.CHARGING);
          }
          return;
        }
        // if (factor >= 0.5) {
          this.parent.setDestination(this.parent.positionX, this.parent.positionY);
          this.parent.animator.setAnimatorState(ActiveEntityAnimationState.State.RANGEDATTACK);
        // } else {
          // this.parent.animator.setAnimatorState(ActiveEntityAnimationState.State.RANGEDATTACK_2);
        // }
        break;
      case ActiveEntityBehaviorState.State.CASTING_SPELL:
        if (!this.isTargetValid()) {
          this.setBehaviorState(ActiveEntityBehaviorState.State.IDLE);
        }
        if (!this.parent.spellBook.getAllSpells()[0].canCast()) {
          if (this.isEntityInMeleeRange()) {
            this.setBehaviorState(ActiveEntityBehaviorState.State.MELEE_ATTACKING);
          } else {
            this.setBehaviorState(ActiveEntityBehaviorState.State.CHARGING);
          }
          return;
        }
        this.parent.setDestination(this.parent.positionX, this.parent.positionY);
        this.parent.animator.setAnimatorState(ActiveEntityAnimationState.State.CASTSPELL);
        break;
      case ActiveEntityBehaviorState.State.BLOCKING:
        break;
      case ActiveEntityBehaviorState.State.HIT:
        break;
      case ActiveEntityBehaviorState.State.DEATH:
        break;
    }
  }

  public onNonRepeatingAnimationEnd(animationState: ActiveEntityAnimationState): void {

  }

  public onYoyoAnimationMiddleFrame(animationState: ActiveEntityAnimationState): void {
    switch (animationState.state) {
      case ActiveEntityAnimationState.State.MELEEATTACK:
      case ActiveEntityAnimationState.State.MELEEATTACK_2:
        if (this.isTargetValid() && this.isEntityInMeleeRange()) {
          (this.parent.target! as PlayerEntity).damage(this.parent.totalModifierStats.basePhysicalDamage, this.parent);
        }
        break;
      case ActiveEntityAnimationState.State.RANGEDATTACK:
      case ActiveEntityAnimationState.State.CASTSPELL:
        this.parent.spellBook.getAllSpells()[0].onCast();
        break;
    }
  }
}