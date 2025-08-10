import { FumobeatSession } from "game/Modes/BeatsMode/FumobeatSession";
import { firstCoffee } from "game/ModesManager/ModesManager";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { eventStream } from "game/gameEvents";
import { ComputeProps } from "modules/Entity/Entity";
import { GameText } from "modules/Entity/GameText";
import { View } from "modules/View";
import { sequenceColor } from "utils/sequenceColor";
export class ComboCounter extends InterfaceEntity {
  counter = 0;
  fontSize = 25;
  fontSizeUp = 40;
  shakeAmount = 0;
  text: GameText;
  overText: GameText;
  scoreText: GameText;
  type = "combo";
  session: FumobeatSession;
  constructor(session: FumobeatSession) {
    super(2, 12.5);
    this.text = createText(this.x, this.y);
    this.text.fontSize = this.fontSize;
    this.overText = createText(this.x, this.y);
    this.overText.fontSize = this.fontSize;
    this.overText.shadow = false;
    this.overText.opacity = 0;
    this.scoreText = createText(21.5, 1);
    this.scoreText.fontSize = this.fontSize;
    this.scoreText.align = "right";
    this.session = session;
  }
  private addCombo(perfect: boolean) {
    this.counter++;
    this.text.fontSize = this.fontSizeUp;
    this.overText.fontSize = this.fontSizeUp;
    this.overText.color = sequenceColor();
    this.overText.opacity = 1;
    const SCORE_HIT = 100;
    const SCORE_COMBO = 20 * (this.counter - 1);
    const PERFECT_MULT = perfect ? 2 : 1;
    const addedScore = (SCORE_HIT + SCORE_COMBO) * PERFECT_MULT;
    this.session.score += addedScore;
    if (this.counter > this.session.largestCombo) {
      this.session.largestCombo = this.counter;
    }
    if (perfect) {
      this.session.perfectHits++;
    }
  }
  private breakCombo() {
    this.counter = 0;
    this.shakeAmount = 10;
    eventStream.post("combo-break", { combo: this.counter });
  }
  compute(props: ComputeProps) {
    eventStream.read("player-damaged", () => {
      props.sound.play("_oh_wav", { volume: 0.5 });
    });
    eventStream.read("fumo-missed", () => {
      this.breakCombo();
      this.session.missedFumos++;
      props.sound.play("_neuro_gymbag_mp3");
    });
    eventStream.read("player-hit", ({ perfect }) => {
      this.addCombo(perfect);
    });
    this.computeText(props);
  }

  computeText(props: ComputeProps) {
    if (this.text.fontSize > this.fontSize) {
      this.text.fontSize -= props.dt;
      if (this.text.fontSize < this.fontSize) {
        this.text.fontSize = this.fontSize;
      }
    }
    if (this.overText.opacity) {
      this.overText.opacity -= props.dt / 10;
      this.overText.fontSize += props.dt;
      if (this.overText.opacity < 0) {
        this.overText.opacity = 0;
      }
    }
    if (this.shakeAmount) {
      this.text.x = this.x + (Math.random() * 0.4 - 0.2) * props.dt;
      this.shakeAmount -= props.dt;
      if (this.shakeAmount <= 0) {
        this.shakeAmount = 0;
        this.text.x = this.x;
      }
    }
    this.text.content = this.counter + "x";
    this.overText.content = this.counter + "x";
    this.scoreText.content = this.session.score.toFixed();
  }
  render(view: View) {
    this.scoreText.render(view);
    if (this.shakeAmount) {
      view.context.globalAlpha = 0.8;
    }
    this.text.render(view);
    if (this.overText.opacity) {
      this.overText.render(view);
    }
    view.context.globalAlpha = 1;
  }
  reset() {
    this.counter = 0;
  }
}
function createText(x: number, y: number) {
  const text = new GameText(x, y);
  text.absolute = true;
  text.content = "x0";
  text.color = "#f0eceb";
  text.align = "left";
  text.baseline = "top";
  text.shadow = true;
  text.font = firstCoffee.family;
  return text;
}
