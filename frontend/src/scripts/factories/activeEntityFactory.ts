import { MonsterEntity } from '../entities/monsterEntity';
import { PlayerEntity } from '../entities/playerEntity';
import { EntitySpecies } from '../enums/entitySpecies';

export class ActiveEntityFactory {

  public static createPlayer(scene: Phaser.Scene): PlayerEntity {
    let entity: PlayerEntity = new PlayerEntity(scene);
    entity.code = 'player';
    entity.species = EntitySpecies.HUMAN;
    entity.stats = {
      strength: 0,
      dexterity: 0,
      vitality: 0,
      energy: 0,
      mana: 150,
      maxMana: 150,
      health: 100,
      maxHealth: 100,
      healthRegeneration: 0,
      basePhysicalDamage: 0,
      baseMagicalDamage: 0,
      attackAccuracy: 0,
      criticalChance: 0,
      criticalMultiplier: 1,
      attackSpeed: 1,
      sightDistance: 500,
      meleeRange: 100,
      projectileRange: 500,
      defense: 0,
      physicalResistance: 0,
      magicResistance: 0,
      fireResistance: 0,
      coldResistance: 0,
      lightningResistance: 0,
      poisonResistance: 0,
      physicalAbsorption: 0,
      magicAbsorption: 0,
      fireAbsorption: 0,
      coldAbsorption: 0,
      lightningAbsorption: 0,
      poisonAbsorption: 0,
      baseMovementSpeed: 1,
      movementSpeed: 150,
      level: 1,
      experience: 0,
      isInvincible: false,
      isStunned: false,
      isSilenced: false,
      isRooted: false,
      isFeared: false,
      isCharmed: false,
      isTaunted: false,
      isBlinded: false,
      isInvisible: false,
      isUntargetable: false
    };
    return entity;
  }

  public static createMonster(scene: Phaser.Scene, monsterCode: string): MonsterEntity {
    // Check if monsterCode is valid then proceed
    let entity: MonsterEntity = new MonsterEntity(scene, monsterCode);
    entity.code = monsterCode;
    entity.species = EntitySpecies.UNDEAD;
    entity.stats = {
      strength: 0,
      dexterity: 0,
      vitality: 0,
      energy: 0,
      mana: 0,
      maxMana: 0,
      health: 100,
      maxHealth: 100,
      healthRegeneration: 0,
      basePhysicalDamage: 5,
      baseMagicalDamage: 0,
      attackAccuracy: 0,
      criticalChance: 0,
      criticalMultiplier: 1,
      attackSpeed: 1,
      sightDistance: 500,
      meleeRange: 100,
      projectileRange: 500,
      defense: 0,
      physicalResistance: 0,
      magicResistance: 0,
      fireResistance: 0,
      coldResistance: 0,
      lightningResistance: 0,
      poisonResistance: 0,
      physicalAbsorption: 0,
      magicAbsorption: 0,
      fireAbsorption: 0,
      coldAbsorption: 0,
      lightningAbsorption: 0,
      poisonAbsorption: 0,
      baseMovementSpeed: 1,
      movementSpeed: 50,
      level: 1,
      experience: 0,
      isInvincible: false,
      isStunned: false,
      isSilenced: false,
      isRooted: false,
      isFeared: false,
      isCharmed: false,
      isTaunted: false,
      isBlinded: false,
      isInvisible: false,
      isUntargetable: false
    };
    return entity;
  }
}
