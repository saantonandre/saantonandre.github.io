import { getDummyFumobeat } from "game/Fumobeat";
import { FumobeatSession } from "game/Modes/BeatsMode/FumobeatSession";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { UIButton } from "game/entities/interface/UIButton";
import { eventStream } from "game/gameEvents";
import { Sprite } from "modules/Entity";
import { ComputeProps, Entity, EntityLike } from "modules/Entity/Entity";
import { GameText } from "modules/Entity/GameText";
import { View } from "modules/View";
import { Rect } from "modules/types/shapes";

type DataRow<T extends object, K extends keyof T> = [
  K,
  string,
  (v: T[K], obj: T) => string
];
type DataRows<T extends object> = DataRow<T, keyof T>;
const dummySession: FumobeatSession = {
  fumobeat: getDummyFumobeat(),
  largestCombo: 200,
  perfectHits: 100,
  missedFumos: 15,
  score: 2141410,
  hasEnded: true,
  reset() {},
};

const getRank = (session: FumobeatSession) => {
  const HIT_VALUE = 1;
  const hits = session.fumobeat.beats.length - session.missedFumos;
  const maxScore = session.fumobeat.beats.length * HIT_VALUE * 2;
  const userScore = hits * HIT_VALUE + session.perfectHits * HIT_VALUE;
  const scoreRatio = userScore / maxScore;
  const scores = ["F", "C", "B", "A", "S"];
  if (userScore === maxScore) return "SS";
  return scores[Math.floor(scores.length * scoreRatio)];
};
export class SongEndScreen extends InterfaceEntity {
  active: boolean = false;
  x = 0;
  y = 0;
  fillColor = "#00000099";
  private session: FumobeatSession;
  private container: Rect;
  private title: GameText;
  private author: GameText;
  private continueButton: UIButton;
  private displayData: DataRows<FumobeatSession>[] = [
    ["largestCombo", "Greatest combo:", (v) => String(v)],
    ["missedFumos", "Missed fumos:", (v) => String(v)],
    // TODO: Create accuracy algorithm
    [
      "hasEnded",
      "Precision:",
      (_, session) => {
        session.fumobeat;
        const fumos = session.fumobeat.beats.length - session.missedFumos;
        const scoreRatio = session.perfectHits / fumos;
        return Math.floor(scoreRatio * 100) + "%";
      },
    ],
    ["score", "Total score:", (v) => String(v)],
  ];
  private rank: GameText;
  private rankValue: GameText;
  private dataText: GameText;
  private dataSeparator: Sprite;
  constructor(view: View, session: FumobeatSession = dummySession) {
    super();
    this.session = session;
    this.w = view.w;
    this.h = view.h;
    const textColor = "#ffffff";
    const CONT_W = 14;
    const CONT_H = 9;
    this.container = new Rect(
      (view.w - CONT_W) / 2,
      (view.h - CONT_H) / 3,
      CONT_W,
      CONT_H
    );
    this.title = new GameText().setup((e) => {
      e.content = "";
      e.fontSize = 16;
      e.align="center"
      e.absolute = true;
      e.x = this.container.w / 2+this.container.x;
      e.y = this.container.y + 1;
      e.color = textColor;
    });
    this.author = new GameText().setup((e) => {
      e.content = "";
      e.fontSize = 10;
      e.absolute = true;
      e.x = this.container.w + this.container.x;
      e.y = this.container.y + 2;
      e.align = "right";
      e.color = textColor;
    });
    this.dataSeparator = new Sprite().setup((e) => {
      e.render = e.renderRect;
      e.x = this.container.x;
      e.y = this.container.y;
      e.w = this.container.w;
      e.h = 1 / view.tilesize;
      e.absolute = true;
    });
    this.dataText = new GameText().setup((e) => {
      e.x = this.container.x;
      e.fontSize = 10;
      e.color = textColor;
      e.baseline = "bottom";
      e.absolute = true;
    });
    this.rank = new GameText().setup((e) => {
      e.content = "RANK:";
      e.fontSize = 15;
      e.absolute = true;
      e.x = this.container.x + this.container.w * 0.8;
      e.align = "right";
      e.color = textColor;
    });
    this.rankValue = new GameText().setup((e) => {
      e.content = "A";
      e.fontSize = 20;
      e.absolute = true;
      e.x = this.container.x + this.container.w * 0.8 + 0.5;
      e.align = "left";
      e.color = textColor;
      e.shadow = true;
      e.shadowColor = "#000000";
    });

    this.continueButton = new UIButton({
      x: this.container.x + this.container.w / 2,
      content: "Continue",
      onClick: () => {
        eventStream.post("switch-mode", { mode: "playlist" });
      },
      fontSize: 15,
    });
  }
  compute(props: ComputeProps) {
    eventStream.read("fumobeat-end", () => {
      this.active = true;
      this.rankValue.content = getRank(this.session);
      console.log(this.session);
      props.sound.play("_clap_mp3");
    });
    eventStream.read("switch-mode", () => {
      this.active = false;
    });
    if (!this.active) return;
    this.continueButton.compute(props);
  }
  render(view: View) {
    if (!this.active) return;
    this.renderRect(view);
    this.title.content = this.session.fumobeat.metadata.name;
    this.title.render(view);
    this.author.content = "by "+this.session.fumobeat.metadata.author;
    this.author.render(view);
    const yStart = this.author.y + 2;
    let i = 0;
    for (i; i < this.displayData.length; i++) {
      const [key, label, formatter] = this.displayData[i];
      this.dataText.align = "left";
      this.dataText.x = this.container.x;
      this.dataText.content = label;
      this.dataText.y = yStart + i;
      this.dataText.render(view);
      this.dataText.x = this.container.x + this.container.w;
      this.dataText.align = "right";
      this.dataText.content = formatter(this.session[key], this.session);
      this.dataText.render(view);
      this.dataSeparator.y = yStart + i;
      this.dataSeparator.render(view);
    }
    this.rank.y = yStart + i + 0.5;
    this.rank.render(view);
    this.rankValue.y = yStart + i + 0.5;
    this.rankValue.render(view);
    this.continueButton.y = yStart + i + 2.5;
    this.continueButton.render(view);
  }
}
