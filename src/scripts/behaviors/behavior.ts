import { ActiveEntity } from "../entities/activeEntity";
import { BaseEntity } from "../entities/baseEntity";
import { ActiveEntityBehaviorState } from "../entities/entityState";
import { MonsterEntity } from "../entities/monsterEntity";
import { PlayerEntity } from "../entities/playerEntity";
import NotImplementedError from "../errors/notImplementedError";
import { EntityManager } from "../managers/entityManager";
import { MathModule } from "../utilities/mathModule";
import { nameOf } from "../utilities/nameOf";
import { BehaviorFactors } from "./behaviorFactors";

export abstract class Behavior {
  public parent: ActiveEntity;
  public factors: BehaviorFactors;
  // public monsterPack: MonsterPack;

  public constructor(parent: ActiveEntity) {
    this.parent = parent;
  }

  protected isTargetInRange(distance: number): boolean {
    if (!this.isTargetValid()) {
      return false;
    }
    return MathModule.scaledDistanceBetween(
      this.parent.positionX, 
      this.parent.positionY, 
      this.parent.target!.positionX, 
      this.parent.target!.positionY
    ) <= distance;
  }

  protected isEntityInMeleeRange(): boolean {
    if (!this.isTargetValid()) {
      return false;
    }
    return MathModule.scaledDistanceBetween(
      this.parent.positionX, 
      this.parent.positionY, 
      this.parent.target!.positionX, 
      this.parent.target!.positionY
    ) <= this.parent.stats.meleeRange;
  }

  protected isEntityInProjectileRange(): boolean {
    if (!this.isTargetValid()) {
      return false;
    }
    return MathModule.scaledDistanceBetween(
      this.parent.positionX, 
      this.parent.positionY, 
      this.parent.target!.positionX, 
      this.parent.target!.positionY
    ) <= this.parent.stats.projectileRange;
  }

  protected isTargetValid(): boolean {
    if (this.parent.target === null || this.parent.target === undefined) {
      return false;
    }
    return true;
  }

  protected setBehaviorState(state: ActiveEntityBehaviorState.State): void {
    const monster = this.parent as MonsterEntity;
    monster.currentBehaviorState.state = state;
  }

  protected getNearbyEnemies(): ActiveEntity[] {
    let entities: ActiveEntity[] = [];
    const sightDistance = this.parent.stats.sightDistance;
    // TODO: Use this when area has list of entities
    // for (let entity: ActiveEntity of this.parent.area.getEntities) {

    // }
    for (let entity of EntityManager.instance.getEntities()) {
      if (entity.type != nameOf(PlayerEntity)) {
        continue;
      }
      const distanceBetweenEntities: number = MathModule.distanceBetween(
        this.parent.positionX, 
        this.parent.positionY,
        entity.positionX,
        entity.positionY
      )
      if (distanceBetweenEntities > this.parent.stats.sightDistance) {
        continue;
      }
      entities.push(entity as ActiveEntity);
    }
    return entities;
  }

  // public abstract getFactors(): BehaviorFactors;
  public abstract selectTarget(): void;
  public abstract update(deltaTime: number): void;
}