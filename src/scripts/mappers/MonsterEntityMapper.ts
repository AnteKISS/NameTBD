import { ActiveEntity } from "../entities/activeEntity";
import ActiveEntityDynamicStats from "../entities/activeEntityDynamicStats";
import ActiveEntityModifierStats from "../entities/activeEntityModifierStats";
import { MonsterEntity } from "../entities/monsterEntity";
import MonsterDataInvalidError from "../errors/monsterDataInvalidError";
import { EntityManager } from "../managers/entityManager";

export class MonsterEntityMapper {
  public static mapMonsterData(data: any): MonsterData {
    if (!data) {
      throw new MonsterDataInvalidError("Monster data is null or undefined.");
    }
    if (!data.baseCode) {
      throw new MonsterDataInvalidError("Monster data is missing a base code.");
    }
    let monsterData: MonsterData = new MonsterData();
    monsterData.dynamicStats = new ActiveEntityDynamicStats();
    monsterData.baseModifierStats = new ActiveEntityModifierStats();
    monsterData.tempModifierStats = new ActiveEntityModifierStats();
    monsterData.totalModifierStats = new ActiveEntityModifierStats();
    monsterData.modifiers = new Map<string, string>();
    monsterData.name = data.name || monsterData.name;
    monsterData.code = data.code;
    monsterData.baseCode = data.baseCode || monsterData.baseCode;
    monsterData.qualityCode = data.qualityCode || monsterData.qualityCode;
    data.monsterStats.forEach((stat: any) => {
      switch (stat.statCode) {
        case 'HEALTH':
          monsterData.baseModifierStats.maxHealth = stat.statValue || monsterData.baseModifierStats.maxHealth;
          monsterData.tempModifierStats.maxHealth = stat.statValue || monsterData.tempModifierStats.maxHealth;
          monsterData.totalModifierStats.maxHealth = stat.statValue || monsterData.totalModifierStats.maxHealth;
          monsterData.dynamicStats.health = stat.statValue || monsterData.dynamicStats.health;
          break;
        case 'MOV_SPEED':
          monsterData.baseModifierStats.baseMovementSpeed = stat.statValue || monsterData.baseModifierStats.baseMovementSpeed;
          monsterData.baseModifierStats.movementSpeed = stat.statValue || monsterData.baseModifierStats.movementSpeed;
          monsterData.tempModifierStats.baseMovementSpeed = stat.statValue || monsterData.tempModifierStats.baseMovementSpeed;
          monsterData.tempModifierStats.movementSpeed = stat.statValue || monsterData.tempModifierStats.movementSpeed;
          monsterData.totalModifierStats.baseMovementSpeed = stat.statValue || monsterData.totalModifierStats.baseMovementSpeed;
          monsterData.totalModifierStats.movementSpeed = stat.statValue || monsterData.totalModifierStats.movementSpeed;
          break;
        case 'ATTACK_SPEED':
          monsterData.baseModifierStats.attackSpeed = stat.statValue || monsterData.baseModifierStats.attackSpeed;
          monsterData.tempModifierStats.attackSpeed = stat.statValue || monsterData.tempModifierStats.attackSpeed
          monsterData.totalModifierStats.attackSpeed = stat.statValue || monsterData.totalModifierStats.attackSpeed;
          break;
        case 'DAMAGE':
          monsterData.baseModifierStats.basePhysicalDamage = stat.statValue || monsterData.baseModifierStats.basePhysicalDamage;
          monsterData.tempModifierStats.basePhysicalDamage = stat.statValue || monsterData.tempModifierStats.basePhysicalDamage;
          monsterData.totalModifierStats.basePhysicalDamage = stat.statValue || monsterData.totalModifierStats.basePhysicalDamage;
          break;
      }
    });
    data.monsterModifiers.forEach((modifier: any) => {
      monsterData.modifiers.set(modifier.modifierCode, modifier.modifierValue);
    });
    return monsterData;
  }
}

export class MonsterData {
  public code: string;
  public baseCode: string;
  public name: string;
  public qualityCode: string;
  public dynamicStats: ActiveEntityDynamicStats;
  public baseModifierStats: ActiveEntityModifierStats;
  public tempModifierStats: ActiveEntityModifierStats;
  public totalModifierStats: ActiveEntityModifierStats;
  public modifiers: Map<string, string>;
}