export interface IFightable {
    attack(target: IFightable): void;
    damage(amount: number): void;
    isAttacking(): boolean;
    isDead(): boolean;
}