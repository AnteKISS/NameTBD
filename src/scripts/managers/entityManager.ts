import { ActiveEntity } from "../entities/activeEntity";
import { InactiveEntity } from "../entities/inactiveEntity";
import { PlayerEntity } from "../entities/playerEntity";
import { MonsterEntity } from "../entities/monsterEntity";
import { BaseEntity } from "../entities/baseEntity";
import { MonsterFactory } from "../factories/monsterFactory";
import NotImplementedError from "../errors/notImplementedError";

class EntityManager {
  private static _instance: EntityManager;
  private _entities: BaseEntity[];

  private constructor() {
    this._entities = [];
  }

  public static get instance(): EntityManager {
    if (!EntityManager._instance) {
        EntityManager._instance = new EntityManager();
    }
    return EntityManager._instance;
  }

  private addEntity(entity: BaseEntity): void {
    this._entities.push(entity);
  }

  private removeEntity(entity: BaseEntity): void {
    const index = this._entities.indexOf(entity);
    if (index == -1) {
      return;
    }
    this._entities.splice(index, 1);
  }

  public update(deltaTime: number): void {
    this._entities.forEach(entity => {
      entity.update(deltaTime);
    });
}

  public resetEntities(): void {
    this._entities.forEach(entity => {
      if (entity.isResetReady) {
        entity.reset();              
      }
    });
  }

  public getEntities(): BaseEntity[] {
    return this._entities;
  }

  public getPlayers(): PlayerEntity[] {
    return this._entities.filter(entity => entity instanceof PlayerEntity) as PlayerEntity[];
  }

  public getMonsters(): MonsterEntity[] {
    return this._entities.filter(entity => entity instanceof MonsterEntity) as MonsterEntity[];
  }

  // TODO: Add function to get all npcs

  public createPlayer(scene: Phaser.Scene): PlayerEntity {
    throw new NotImplementedError();
    // TODO: Create factory for player and call it here
    // this.addEntity(player);
    // return player;
  }

  public createMonster(monsterCode: string, scene: Phaser.Scene): MonsterEntity {
    throw new NotImplementedError();
    // TODO: Create factory for monster and call it here
    // MonsterFactory.createMonster("deader_than_dead", scene);
    // this.addEntity(monster);
    // return monster;
  }

  // TODO: Add function to create npc
}