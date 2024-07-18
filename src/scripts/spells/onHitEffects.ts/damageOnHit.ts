import { IFightable } from "../../entities/IFightable";
import { ActiveEntity } from "../../entities/activeEntity";
import { BaseEntity } from "../../entities/baseEntity";
import Spell from "../spell"

export default class DamageOnHit implements IOnHitEffect
{
    spell: Spell;
    damageType: DamageType;
    baseDamage: number;
    scaling: number;
    scalingStat;

    constructor(spell: Spell, baseDamage: number)
    {
        this.spell = spell;
        this.baseDamage = baseDamage;
        spell.addOnHitEffect(this);
    }

    public onHit(hitEntity: BaseEntity): void
    {
        console.log('HIT');
        const totalDamage = this.baseDamage + this.spell.spellOwner.stats.baseMagicalDamage;
        
        const entity = hitEntity as unknown as IFightable;
        entity.damage(totalDamage);
    }

    public onMaxRange(position: any, castDirection: any, movementDirection: any): void {
        
    }
}