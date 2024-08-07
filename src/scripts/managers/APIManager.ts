import { ItemType } from "../inventory/itemType";
import axios from "axios";
import Item from "../inventory/item";
import ActiveEntityModifierStats from "../entities/activeEntityModifierStats";
import StatModule from "../entities/statModule";
import { MonsterData, MonsterEntityMapper } from "../mappers/MonsterEntityMapper";
import { ActiveEntityFactory } from "../factories/activeEntityFactory";

class ItemInfo {
  code: number;
  name: string;
  type: ItemType;
  width: number;
  height: number;
  inventorySprite: string;
  entitySprite: string;
  modifierStats: ActiveEntityModifierStats;
}

export default class APIManager {
  private static monsterDatas: Map<string, MonsterData>;
  private static itemCodeRegistry: Map<number, ItemInfo>;
  private static itemNameRegistry: Map<string, ItemInfo>;

  public static getNewItemByCode(scene: Phaser.Scene, code: number): Item | undefined {
    const info = this.itemCodeRegistry.get(code);

    if (!info) {
      console.error("APIManager::getNewItemByCode - Failed to get new item by code:", code);
      return undefined;
    }

    return this.fetchItem(scene, info);
  }

  public static getNewItemByName(scene: Phaser.Scene, name: string): Item | undefined {
    const info = this.itemNameRegistry.get(name);

    if (!info) {
      console.error("APIManager::getNewItemByName - Failed to get new item by name:", name);
      return undefined;
    }

    return this.fetchItem(scene, info);
  }

  public static async loadItems(): Promise<void> {
    console.log("Starting to load items from 'localhost:8082/Item/GetAll'...");

    this.itemCodeRegistry = new Map<number, ItemInfo>;
    this.itemNameRegistry = new Map<string, ItemInfo>;

    // Fetch items from DB
    const response = await axios.get("http://localhost:8082/Item/GetAll");
    const items = response.data;

    for (const json of items) {
      const [width, height] = this.itemSizeFromCode(json.itemSizeCode);
      const [inventorySprite, entitySprite] = this.itemSpriteFromName(json.itemName);
      const info = new ItemInfo;

      // Extract data from json into ItemInfo struct
      info.code = json.itemId;
      info.name = json.itemName;
      info.type = this.itemTypeFromCode(json.itemSlotCode);
      info.width = width;
      info.height = height;
      info.inventorySprite = inventorySprite;
      info.entitySprite = entitySprite;
      info.modifierStats = new ActiveEntityModifierStats();
      StatModule.resetModifierStats(info.modifierStats);

      // Apply base stats to item info
      for (const modifier of json.itemBaseStats) {
        this.itemModifierStatFromCodeValue(info.modifierStats, modifier.statCode, modifier.statValue);
      }

      // Apply modifier stats to item info
      for (const modifier of json.itemModifiers) {
        console.log(modifier);
        this.itemModifierStatFromCodeValue(info.modifierStats, modifier.itemModifierCode, modifier.modifierValue);
      }

      // Add item info to registry to fetch later from game
      this.itemCodeRegistry.set(info.code, info);
      this.itemNameRegistry.set(info.name, info);
    }

    console.log("Item load finished:", this.itemNameRegistry);
  }

  private static fetchItem(scene: Phaser.Scene, info: ItemInfo): Item | undefined {
    return new Item(scene, info.code, info.name, info.type, info.width, info.height, info.inventorySprite, info.entitySprite, info.modifierStats);
  }

  private static itemTypeFromCode(code: string): ItemType {
    switch (code) {
      case "FING": return ItemType.RING;
      case "NECK": return ItemType.AMULET;
      case "CHES": return ItemType.ARMOR;
      case "HAND": return ItemType.GLOVES;
      case "FEET": return ItemType.BOOTS;
      case "MHAN": return ItemType.WEAPON;
      case "OHAN": return ItemType.WEAPON;
      case "WAIS": return ItemType.BELT;
      case "HEAD": return ItemType.HELMET;
    }
    throw new Error("Item type does not exist: " + code);
  }

  private static itemSizeFromCode(code: string): [number, number] {
    switch (code) {
      case "XSML": return [1, 1];
      case "VSML": return [1, 2];
      case "HSML": return [2, 1];
      case "SMED": return [2, 2];
      case "VMED": return [1, 3];
      case "SLAR": return [2, 3];
      case "VLAR": return [1, 4];
      case "XLAR": return [2, 4];
    }
    return [0, 0];
  }

  private static itemSpriteFromName(name: string): [string, string] {
    switch (name) {
      // Weapons
      case "Bone Sword": return ["bone_sword_inv", "dropped_sword"];
      case "Golden Kopis": return ["golden_kopis_inv", "dropped_sword"];
      case "Knoppix": return ["golden_kopis_inv", "dropped_sword"];
      case "Lethal Dagger": return ["stone_dagger_inv", "dropped_sword"];
      case "Dagger": return ["stone_dagger_inv", "dropped_sword"];

      // Amulets
      case "Talisman of Baphomet": return ["baphomets_talisman_inv", "dropped_amulet"];
      case "Temple Amulet": return ["temple_amulet_inv", "dropped_amulet"];

      // Rings
      case "Bronze Ring": return ["bronze_ring_inv", "dropped_ring"];
      case "Silver Ring": return ["silver_ring_inv", "dropped_ring"];
      case "Gold Ring": return ["gold_ring_inv", "dropped_ring"];
      case "Bb": return ["gold_ring_inv", "dropped_ring"];

      // Armor
      case "Leather Armor": return ["leather_armor_inv", "dropped_armor"];
      case "Chainmail Armor": return ["chainmail_armor_inv", "dropped_armor"];

      // Belt
      case "Leather Belt": return ["leather_belt_inv", "dropped_belt"];
      case "Chainmail Belt": return ["chainmail_belt_inv", "dropped_belt"];

      // Boots
      case "Leather Boots": return ["leather_boots_inv", "dropped_boots"];
      case "Chainmail Boots": return ["chainmail_boots_inv", "dropped_boots"];

      // Gloves
      case "Leather Gloves": return ["leather_gloves_inv", "dropped_gloves"];
      case "Chainmail Gloves": return ["chainmail_gloves_inv", "dropped_gloves"];

      // Helmets & Hoods
      case "Leather Hood": return ["leather_hood_inv", "dropped_hood"];
      case "Chainmail Hood": return ["chainmail_hood_inv", "dropped_hood"];
      case "Knight Helmet": return ["knight_helmet_inv", "dropped_helmet"];

      // Shield
      case "Wooden Shield": return ["wooden_shield_inv", "dropped_shield"];
    }
    return ["", ""];
  }

  private static itemModifierStatFromCodeValue(stats: ActiveEntityModifierStats, stat: string, value: number): void {
    switch (stat) {
      case "ATK_SPEED_MOD": stats.attackSpeed += value; break;
      case "DAMAGE": stats.basePhysicalDamage += value; break;
      case "DAMAGE_MAGIC": stats.baseMagicalDamage += value; break;
      case "INC_DAMAGE": stats.basePhysicalDamage += value; break;
      case "INC_DAMAGE_MAGIC": stats.baseMagicalDamage += value; break;
      case "DEFENSE": stats.defense += value; break;
      case "MOV_SPEED_MOD": stats.movementSpeed += value; break;
    }
  }

  public static async loadMonsters(): Promise<void> {
    console.log("Starting to load monsters from 'localhost:8082/Monster/GetAll'...");

    const response = await axios.get("http://localhost:8082/Monster/GetAll");
    const monsters = response.data;

    APIManager.monsterDatas = new Map<string, MonsterData>();

    for (const monster of monsters) {
      let monsterData: MonsterData = new MonsterData();
      try {
        monsterData = MonsterEntityMapper.mapMonsterData(monster);
      } catch (error) {
        console.error("Error while trying to map monster data.", error);
      }
      if (!APIManager.monsterDatas.has(monsterData.uuid)) {
        APIManager.monsterDatas.set(monsterData.uuid, monsterData);
      }
      if (!ActiveEntityFactory.loadedMonsters.has(monsterData.uuid)) {
        ActiveEntityFactory.loadedMonsters.set(monsterData.uuid, monsterData);
      }
    }
    console.log("Monster load finished:", APIManager.monsterDatas);
  }
}
