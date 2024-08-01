import { MonsterPack } from '../behaviors/monsterPack';
import { RusherBehavior } from '../behaviors/rusherBehavior';
import { SkirmisherBehavior } from '../behaviors/skirmisherBehavior';
import { MonsterEntity } from '../entities/monsterEntity';
import { NpcEntity } from '../entities/npcEntity';
import { PlayerEntity } from '../entities/playerEntity';
import { EntitySpecies } from '../enums/entitySpecies';
import { MonsterRarity } from '../enums/monsterRarity';
import InvalidMonsterCodeError from '../errors/invalidMonsterCodeError';
import { MonsterData } from '../mappers/MonsterEntityMapper';
import FireBolt from '../spells/craftedSpells/firebolt';
import ThrowSpear from '../spells/craftedSpells/throwSpear';

export class ActiveEntityFactory {
  public static loadedMonsters: Map<string, MonsterData> = new Map();

  public static createPlayer(scene: Phaser.Scene): PlayerEntity {
    let entity: PlayerEntity = new PlayerEntity(scene);
    entity.code = 'player';
    entity.species = EntitySpecies.HUMAN;
    entity.dynamicStats = {
      mana: 100,
      health: 100,
      level: 1,
      experience: 0,
    };
    entity.baseModifierStats = {
      strength: 0,
      dexterity: 0,
      vitality: 0,
      intelligence: 0,
      maxMana: 100,
      maxHealth: 100,
      healthRegeneration: 2,
      manaRegeneration: 2,
      basePhysicalDamage: 0,
      baseMagicalDamage: 0,
      attackSpeed: 1,
      sightDistance: 500,
      meleeRange: 100,
      projectileRange: 500,
      defense: 0,
      baseMovementSpeed: 150,
      movementSpeed: 0,
    };
    entity.states = {
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
    entity.attributeConversion();
    return entity;
  }

  // public static createMonster(scene: Phaser.Scene, monsterCode: string): MonsterEntity {
  //   for (const monster of this.loadedMonsters.values()) {
  //     if (monsterCode === monster.baseCode.toLowerCase()) {
  //       break;
  //     }
  //   }
  //   const possibleMonsterCodes = Array.from(this.loadedMonsters.values()).filter((monster) => monster.baseCode.toLowerCase() === monsterCode);
  //   if (possibleMonsterCodes.length === 0) {
  //     throw new InvalidMonsterCodeError(`No monster data for monster with code: ${monsterCode}.`);
  //   }
  //   const randomMonster = possibleMonsterCodes[Math.floor(Math.random() * possibleMonsterCodes.length)];
  //   const monsterData: MonsterData = this.loadedMonsters.get(randomMonster.uuid)!;
  //   let entity: MonsterEntity = new MonsterEntity(scene, monsterData.baseCode.toLowerCase());
  //   entity.code = monsterCode;
  //   entity.name = monsterData.name;
  //   entity.species = EntitySpecies.UNDEAD;
  //   entity.quality = monsterData.qualityCode as MonsterRarity;
  //   monsterData.modifiers.forEach((key, value) => {
  //     entity.appliedModifiers.push(value)
  //   });
  //   entity.dynamicStats = {
  //     mana: 0,
  //     health: monsterData.dynamicStats.health,
  //     level: 1,
  //     experience: 0,
  //   };
  //   entity.totalModifierStats = {
  //     strength: 0,
  //     dexterity: 0,
  //     vitality: 0,
  //     intelligence: 0,
  //     maxMana: monsterData.totalModifierStats.maxMana,
  //     maxHealth: monsterData.totalModifierStats.maxHealth,
  //     healthRegeneration: 0,
  //     manaRegeneration: 0,
  //     basePhysicalDamage: monsterData.totalModifierStats.basePhysicalDamage,
  //     baseMagicalDamage: 0,
  //     attackSpeed: monsterData.totalModifierStats.attackSpeed,
  //     sightDistance: monsterData.totalModifierStats.sightDistance,
  //     meleeRange: monsterData.totalModifierStats.meleeRange,
  //     projectileRange: 500,
  //     defense: monsterData.totalModifierStats.defense,
  //     baseMovementSpeed: monsterData.totalModifierStats.baseMovementSpeed,
  //     movementSpeed: monsterData.totalModifierStats.movementSpeed,
  //   };
  //   entity.dynamicStats.health = entity.totalModifierStats.maxHealth;
  //   entity.dynamicStats.mana = entity.totalModifierStats.maxMana;
  //   entity.states = {
  //     isInvincible: false,
  //     isStunned: false,
  //     isSilenced: false,
  //     isRooted: false,
  //     isFeared: false,
  //     isCharmed: false,
  //     isTaunted: false,
  //     isBlinded: false,
  //     isInvisible: false,
  //     isUntargetable: false
  //   };
  //   if (monsterCode === 'goblin') {
  //     entity.spellBook.addSpell(new ThrowSpear(entity));
  //     entity.behavior = new SkirmisherBehavior(entity);
  //     entity.lootTable.setTable([
  //       "Chainmail Armor",
  //       "Chainmail Gloves",
  //       "Chainmail Boots",
  //       "Chainmail Belt",
  //       "Chainmail Hood",
  //       "Silver Ring",
  //     ]);
  //   } else if (monsterCode === 'wyvern_composite') {
  //     entity.spellBook.addSpell(new FireBolt(entity));
  //     entity.behavior = new SkirmisherBehavior(entity);
  //     entity.lootTable.setTable([
  //       "Golden Kopis",
  //       "Golden Kopis",
  //       "Gold Ring",
  //       "Talisman of Baphomet",
  //       "Chainmail Belt",
  //       "Chainmail Boots",
  //       "Bone Sword",
  //       "Bone Sword",
  //     ]);
  //   } else if (monsterCode === 'goblin_lumberjack_black') {
  //     entity.behavior = new RusherBehavior(entity);
  //     entity.lootTable.setTable([
  //       "Chainmail Armor",
  //       "Chainmail Gloves",
  //       "Chainmail Boots",
  //       "Chainmail Belt",
  //       "Chainmail Hood",
  //       "Silver Ring",
  //       "Dagger",
  //     ]);
  //   } else if (monsterCode === 'minotaur') {
  //     entity.behavior = new RusherBehavior(entity);
  //     entity.lootTable.setTable([
  //       "Golden Kopis",
  //       "Golden Kopis",
  //       "Knight Helmet",
  //       "Wooden Shield",
  //       "Temple Amulet",
  //       "Chainmail Armor",
  //       "Chainmail Gloves",
  //       "Chainmail Hood",
  //     ]);
  //   } else if (monsterCode === 'zombie') {
  //     entity.behavior = new RusherBehavior(entity);
  //     entity.lootTable.setTable([
  //       "Leather Armor",
  //       "Leather Gloves",
  //       "Leather Boots",
  //       "Leather Belt",
  //       "Leather Hood",
  //       "Bronze Ring",
  //       "Dagger",
  //       "Dagger",
  //       "Lethal Dagger",
  //       "Lethal Dagger",
  //       "Wooden Shield",
  //     ]);
  //   } else if (monsterCode === 'skeleton') {
  //     entity.behavior = new RusherBehavior(entity);
  //     entity.lootTable.setTable([
  //       "Silver Ring",
  //       "Temple Amulet",
  //       "Dagger",
  //       "Dagger",
  //       "Lethal Dagger",
  //       "Lethal Dagger",
  //       "Bone Sword",
  //       "Wooden Shield",
  //       "Leather Hood",
  //       "Leather Armor",
  //       "Leather Gloves",
  //       "Leather Boots",
  //       "Leather Belt",
  //     ]);
  //   } else {
  //     entity.behavior = new RusherBehavior(entity);
  //   }
  //   switch (entity.quality) {
  //     case MonsterRarity.Elite:
  //     case MonsterRarity.RARE:
  //     case MonsterRarity.UNIQUE:
  //       const randomTintColor = Math.floor(Math.random() * 0xFFFFFF);
  //       entity.getSprite().setTint(randomTintColor);
  //       break;
  //     case MonsterRarity.SUPERUNIQUE:
  //     case MonsterRarity.BOSS:
  //       entity.getSprite().setTint(0xFF0000);
  //       break;
  //   }
  //   return entity;
  // }

  public static createMonster(scene: Phaser.Scene, monsterCode: string, quality: MonsterRarity = MonsterRarity.NORMAL): MonsterEntity {
    // for (const monster of this.loadedMonsters.values()) {
    //   if (monsterCode === monster.baseCode.toLowerCase()) {
    //     break;
    //   }
    // }
    const normalQualityMonsterFromCode = 
      (Array.from(this.loadedMonsters.values()).filter((monster) => {
        return monster.baseCode.toLowerCase() === monsterCode && monster.qualityCode === quality;
      }));
    if (normalQualityMonsterFromCode.length === 0) {
      throw new InvalidMonsterCodeError(`No monster data for normal quality monster with code: ${monsterCode}.`);
    }
    const randomMonster = normalQualityMonsterFromCode[Math.floor(Math.random() * normalQualityMonsterFromCode.length)];
    // if (Array.from(this.loadedMonsters.values()).filter((monster) => 
    //   monster.baseCode.toLowerCase() === monsterCode).length === 0) {
    //   throw new InvalidMonsterCodeError(`No monster data for monster with code: ${monsterCode}.`);
    // }
    // const possibleMonsterCodes = Array.from(this.loadedMonsters.values()).filter((monster) => monster.baseCode.toLowerCase() === monsterCode);
    // if (possibleMonsterCodes.length === 0) {
    //   throw new InvalidMonsterCodeError(`No monster data for monster with code: ${monsterCode}.`);
    // }
    // const randomMonster = possibleMonsterCodes[Math.floor(Math.random() * possibleMonsterCodes.length)];
    const monsterData: MonsterData = this.loadedMonsters.get(randomMonster.uuid)!;
    let entity: MonsterEntity = new MonsterEntity(scene, monsterData.baseCode.toLowerCase());
    entity.code = monsterCode;
    entity.name = monsterData.name;
    entity.species = EntitySpecies.UNDEAD;
    entity.quality = monsterData.qualityCode as MonsterRarity;
    monsterData.modifiers.forEach((key, value) => {
      entity.appliedModifiers.push(value)
    });
    entity.dynamicStats = {
      mana: 0,
      health: monsterData.dynamicStats.health,
      level: 1,
      experience: 0,
    };
    entity.totalModifierStats = {
      strength: 0,
      dexterity: 0,
      vitality: 0,
      intelligence: 0,
      maxMana: monsterData.totalModifierStats.maxMana,
      maxHealth: monsterData.totalModifierStats.maxHealth,
      healthRegeneration: 0,
      manaRegeneration: 0,
      basePhysicalDamage: monsterData.totalModifierStats.basePhysicalDamage,
      baseMagicalDamage: 0,
      attackSpeed: monsterData.totalModifierStats.attackSpeed,
      sightDistance: monsterData.totalModifierStats.sightDistance,
      meleeRange: monsterData.totalModifierStats.meleeRange,
      projectileRange: 500,
      defense: monsterData.totalModifierStats.defense,
      baseMovementSpeed: monsterData.totalModifierStats.baseMovementSpeed,
      movementSpeed: monsterData.totalModifierStats.movementSpeed,
    };
    entity.dynamicStats.health = entity.totalModifierStats.maxHealth;
    entity.dynamicStats.mana = entity.totalModifierStats.maxMana;
    entity.states = {
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
    if (monsterCode === 'goblin') {
      entity.spellBook.addSpell(new ThrowSpear(entity));
      entity.behavior = new SkirmisherBehavior(entity);
      entity.lootTable.setTable([
        "Chainmail Armor",
        "Chainmail Gloves",
        "Chainmail Boots",
        "Chainmail Belt",
        "Chainmail Hood",
        "Silver Ring",
      ]);
    } else if (monsterCode === 'wyvern_composite') {
      entity.spellBook.addSpell(new FireBolt(entity));
      entity.behavior = new SkirmisherBehavior(entity);
      entity.lootTable.setTable([
        "Golden Kopis",
        "Golden Kopis",
        "Gold Ring",
        "Talisman of Baphomet",
        "Chainmail Belt",
        "Chainmail Boots",
        "Bone Sword",
        "Bone Sword",
      ]);
    } else if (monsterCode === 'goblin_lumberjack_black') {
      entity.behavior = new RusherBehavior(entity);
      entity.lootTable.setTable([
        "Chainmail Armor",
        "Chainmail Gloves",
        "Chainmail Boots",
        "Chainmail Belt",
        "Chainmail Hood",
        "Silver Ring",
        "Dagger",
      ]);
    } else if (monsterCode === 'minotaur') {
      entity.behavior = new RusherBehavior(entity);
      entity.lootTable.setTable([
        "Golden Kopis",
        "Golden Kopis",
        "Knight Helmet",
        "Wooden Shield",
        "Temple Amulet",
        "Chainmail Armor",
        "Chainmail Gloves",
        "Chainmail Hood",
      ]);
    } else if (monsterCode === 'zombie') {
      entity.behavior = new RusherBehavior(entity);
      entity.lootTable.setTable([
        "Leather Armor",
        "Leather Gloves",
        "Leather Boots",
        "Leather Belt",
        "Leather Hood",
        "Bronze Ring",
        "Dagger",
        "Dagger",
        "Lethal Dagger",
        "Lethal Dagger",
        "Wooden Shield",
      ]);
    } else if (monsterCode === 'skeleton') {
      entity.behavior = new RusherBehavior(entity);
      entity.lootTable.setTable([
        "Silver Ring",
        "Temple Amulet",
        "Dagger",
        "Dagger",
        "Lethal Dagger",
        "Lethal Dagger",
        "Bone Sword",
        "Wooden Shield",
        "Leather Hood",
        "Leather Armor",
        "Leather Gloves",
        "Leather Boots",
        "Leather Belt",
      ]);
    } else {
      entity.behavior = new RusherBehavior(entity);
    }
    switch (entity.quality) {
      case MonsterRarity.Elite:
      case MonsterRarity.RARE:
      case MonsterRarity.UNIQUE:
        const randomTintColor = Math.floor(Math.random() * 0xFFFFFF);
        entity.getSprite().setTint(randomTintColor);
        break;
      case MonsterRarity.SUPERUNIQUE:
      case MonsterRarity.BOSS:
        entity.getSprite().setTint(0xFF0000);
        break;
    }
    return entity;
  }

  public static createMonsterWithMinions(scene: Phaser.Scene, monsterCode: string, quality?: MonsterRarity, numberOfMinions?: number): MonsterEntity[] {
    let canMonsterHaveMinions: boolean = false;
    let possibleMonsterCodes = Array.from(this.loadedMonsters.values()).filter((monster) => monster.baseCode.toLowerCase() === monsterCode);
    if (possibleMonsterCodes.length === 0) {
      throw new InvalidMonsterCodeError(`No monster data for monster with code: ${monsterCode}.`);
    }
    let possibleMonsterCodesCopy = possibleMonsterCodes.slice();
    for (const monster of possibleMonsterCodesCopy) {
      if (monsterCode === monster.baseCode.toLowerCase()) {
        if (quality) {
          if (monster.qualityCode === quality) {
            canMonsterHaveMinions = true;
          } else {
            possibleMonsterCodes.splice(possibleMonsterCodes.indexOf(monster), 1);
          }
        } else {
          if (monster.qualityCode !== MonsterRarity.NORMAL) {
            canMonsterHaveMinions = true;
          } else {
            possibleMonsterCodes.splice(possibleMonsterCodes.indexOf(monster), 1);
          }
        }
      }
    }
    if (!canMonsterHaveMinions) {
      return [];
    }
    const randomMonster: MonsterData = possibleMonsterCodes[Math.floor(Math.random() * possibleMonsterCodes.length)];
    let entities: MonsterEntity[] = [];
    let monster = this.createMonster(scene, randomMonster.baseCode.toLowerCase(), randomMonster.qualityCode as MonsterRarity);
    // let monsterPack: MonsterPack = new MonsterPack();
    monster.monsterPack.setLeader(monster);
    // monsterPack.setLeader(monster);
    entities.push(monster);
    for (let i = 0; i < (numberOfMinions || 5); i++) {
      let minion = this.createMonster(scene, monsterCode);
      minion.positionX = monster.positionX + (Math.random() * 100 - 50);
      minion.positionY = monster.positionY + (Math.random() * 100 - 50);
      entities.push(minion);
      monster.monsterPack.addMinion(minion);
      // monsterPack.addMinion(minion);
    }
    return entities;
  }

  public static createNPC(scene: Phaser.Scene, npcCode: string): NpcEntity {
    // Check if monsterCode is valid then proceed
    let entity: NpcEntity = new NpcEntity(scene, npcCode);
    entity.code = npcCode;
    entity.species = EntitySpecies.UNDEAD;
    entity.dynamicStats = {
      mana: 0,
      health: 100,
      level: 1,
      experience: 0,
    };
    entity.totalModifierStats = {
      strength: 0,
      dexterity: 0,
      vitality: 0,
      intelligence: 0,
      maxMana: 0,
      maxHealth: 100,
      healthRegeneration: 0,
      manaRegeneration: 0,
      basePhysicalDamage: 10,
      baseMagicalDamage: 0,
      attackSpeed: 1,
      sightDistance: 500,
      meleeRange: 100,
      projectileRange: 500,
      defense: 0,
      baseMovementSpeed: 1,
      movementSpeed: 100,
    };
    entity.states = {
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
