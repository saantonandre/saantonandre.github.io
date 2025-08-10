//@ts-check

export class Entity {
  /** @param {string} name */
  constructor(name = "entity") {
    this.name = name;
  }
  #lv = 1;
  get lv() {
    return this.#lv;
  }
  set lv(newLv) {
    this.#lv = newLv;
    this.exp = this.prevLevelExp;
  }
  maxHp = 10;
  atk = 1;
  name = "entity";
  #hp = this.maxHp;
  get hp() {
    return this.#hp;
  }
  set hp(newValue) {
    this.#hp = newValue;
    if (this.#hp < 0) {
      this.#hp = 0;
    }
  }
  maxMp = 20;
  mp = this.maxMp;
  #exp = 0;
  get exp() {
    return this.#exp;
  }
  set exp(newExp) {
    if (newExp < this.prevLevelExp) {
      this.#exp = this.prevLevelExp;
    }
    this.#exp = newExp;
    while (newExp > this.nextLevelExp) {
      this.levelUp();
    }
  }

  get expValue() {
    return this.lv * 2;
  }
  get prevLevelExp() {
    if (this.lv <= 1) return 0;
    return (this.lv - 1) ** 2;
  }
  get nextLevelExp() {
    return (this.lv + 1) ** 2;
  }
  /** @param {Entity} entity*/
  attack(entity) {
    const dmg = this.atk;
    entity.hp -= dmg;
    return dmg;
  }
  /** @param {Entity} killer*/
  die(killer) {
    killer.exp += this.expValue;
  }
  levelUp() {
    this.lv++;
    this.maxHp += this.lv;
    this.hp = this.maxHp;
    this.maxMp += this.lv * 2;
    this.mp = this.maxMp;
  }
}
