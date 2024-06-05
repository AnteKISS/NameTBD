export class ActiveEntityState {

  state: ActiveEntityState.State;

  constructor() {
    this.state = ActiveEntityState.State.IDLE;
  }

  public static getNonRepeatingAnimationState(): string[] {
    return ['MELEEATTACK', 'MELEEATTACK_2', 'RANGEDATTACK', 'RANGEDATTACK_2', 'CASTSPELL', 'BLOCK', 'CHEER', 'HIT', 'DEATH', 'CRITICAL_DEATH'];
  }

  public static getRepeatingAnimationState(): string[] {
    return ['IDLE', 'RUN'];
  }
}

export namespace ActiveEntityState {
  export enum State {
    IDLE = 'IDLE',
    RUN = 'RUN',
    MELEEATTACK = 'MELEEATTACK',
    MELEEATTACK_2 = 'MELEEATTACK_2',
    RANGEDATTACK = 'RANGEDATTACK',
    RANGEDATTACK_2 = 'RANGEDATTACK_2',
    CASTSPELL = 'CASTSPELL',
    BLOCK = 'BLOCK',
    CHEER = 'CHEER',
    HIT = 'HIT',
    DEATH = 'DEATH',
    CRITICALDEATH = 'CRITICAL_DEATH'
  }
}