import { ActiveEntity } from "../entities/activeEntity";
import { BaseEntity } from "../entities/baseEntity";
import { IFightable } from "../entities/IFightable";
import ItemEntity from "../entities/itemEntity";
import { MonsterEntity } from "../entities/monsterEntity";
import { NpcEntity } from "../entities/npcEntity";
import { EntityManager } from "../managers/entityManager";
import { SpellCollider } from "./spellCollider";

export class ProjectileCollider extends SpellCollider {
    private collidingCallbackPierce: (sprite: Phaser.Physics.Arcade.Sprite, collider: ProjectileCollider) => void;
    private truncatedSpriteWidth: number;
    private truncatedSpriteHeight: number;

    constructor(owner: BaseEntity, parentObject: Phaser.Physics.Arcade.Sprite, collidingCallback: (hitEntity: BaseEntity) => void, collidingCallbackPierce: (sprite: Phaser.Physics.Arcade.Sprite, collider: ProjectileCollider) => void) {
        super(owner, parentObject, collidingCallback);

        this.collidingCallbackPierce = collidingCallbackPierce;
        this.truncatedSpriteWidth = parentObject.displayWidth / 3;
        this.truncatedSpriteHeight = parentObject.displayHeight / 3;

        if (this?.parentObject?.scene?.cameras?.getCamera("uiCamera")) {
            this.parentObject.scene.cameras.getCamera("uiCamera")!.ignore(this.debugGraphics);
        }
        if (this?.parentObject?.scene?.cameras?.getCamera("minimapCamera")) {
            this.parentObject.scene.cameras.getCamera("minimapCamera")!.ignore(this.debugGraphics);
        }
    }

    public displayDebugGraphics(): void {
        this.debugGraphics.clear();

        this.debugGraphics.fillStyle(this.SPRITE_HITBOX_COLOR, 0.5);
        this.debugGraphics.fillRect(
            this.parentObject.x - (this.truncatedSpriteWidth / 2),
            this.parentObject.y - (this.truncatedSpriteHeight / 2),
            this.truncatedSpriteWidth,
            this.truncatedSpriteHeight
        );

        this.debugGraphics.fillStyle(this.SPRITE_ORIGIN_COLOR, 0.5);
        this.debugGraphics.fillCircle(this.parentObject.x, this.parentObject.y, 5);
    }

    public checkCollision(): boolean {
        const positionX: number = this.parentObject.x;
        const positionY: number = this.parentObject.y + this.parentObject.displayHeight / 2;
        const originX: number = this.parentObject.originX;
        const originY: number = this.parentObject.originY;

        for (const entity of EntityManager.instance.getCurrentAreaEntities()) {
            if (entity === this.owner) {
                continue;
            }
            if (entity instanceof ItemEntity) {
                continue;
            }
            if (entity instanceof NpcEntity) {
                continue;
            }
            if (this.owner instanceof MonsterEntity && entity instanceof MonsterEntity) {
                continue;
            }
            if ((entity as unknown as IFightable).isDead() == true) {
                continue;
            }
            if (!(positionX + (this.truncatedSpriteWidth / 2) > entity.positionX - (entity.truncatedSpriteWidth / 2))) {
                continue;
            }
            if (!(positionX + (this.truncatedSpriteWidth / 2) > entity.positionX - (entity.truncatedSpriteWidth / 2))) {
                continue;
            }
            if (!(positionX - (this.truncatedSpriteWidth / 2) < entity.positionX + (entity.truncatedSpriteWidth / 2))) {
                continue;
            }
            if (!(positionY - (this.truncatedSpriteHeight / 2) < entity.positionY + (entity.truncatedSpriteHeight - (entity.truncatedSpriteHeight * originY)))) {
                continue;
            }
            if (!this.alreadyHitEntities.includes(entity)) {
                this.alreadyHitEntities.push(entity);
                this.collidingCallback(entity);
                this.collidingCallbackPierce(this.parentObject, this);
            }
        }
        return true;
    }
}
