import { othersIndex } from "assets/others";
import { firstCoffee } from "game/ModesManager/ModesManager";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { UIButton } from "game/entities/interface/UIButton";
import { eventStream } from "game/gameEvents";
import { ComputeProps } from "modules/Entity/Entity";
import { GameText } from "modules/Entity/GameText";
import { View } from "modules/View";

const commitsJson = othersIndex._commits_json;
type Commit = (typeof commitsJson)[number];
function formatDate(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}
/** Commits before this date are irrelevant */
const START_DATE = "2024-04-13";
const SHOWN_UPDATES_KEY = "shown-updates";

const commitsByDate = commitsJson.reduce<Record<string, Commit[]>>(
  (acc, curr) => {
    const date = formatDate(curr.authorDate);
    if (date < START_DATE) return acc;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
  },
  {}
);
const aggregatedCommits: [string, Commit[]][] = Object.entries(commitsByDate);
abstract class UserUpdatesManager {
  /** Last time the user has seen updates */
  static get userUpdatedTo() {
    const lsDate = localStorage.getItem(SHOWN_UPDATES_KEY);
    if (lsDate) return lsDate;
    const today = new Date().toISOString().slice(0, 10);
    this.userUpdatedTo = today;
    return today;
  }
  static set userUpdatedTo(date: string) {
    localStorage.setItem(SHOWN_UPDATES_KEY, date);
    this.newUpdatesCount = this.countNewUpdates();
  }
  static countNewUpdates = () => {
    const count = commitsJson.reduce((acc, curr) => {
      if (curr.authorDate < START_DATE) return acc;
      if (curr.authorDate > this.userUpdatedTo) {
        return ++acc;
      }
      return acc;
    }, 0);
    return count;
  };
  static newUpdatesCount = this.countNewUpdates();
}

export class GitlogButton extends InterfaceEntity {
  button: UIButton;
  ents: InterfaceEntity[] = [];
  open: boolean = false;
  text = new GameText(0, 0);
  yOffset = 0;

  constructor(view: View) {
    super();
    this.button = new UIButton({
      x: view.w - 0.5,
      y: view.h - 0.5,
      align: "right",
      fontSize: 10,
      onClick: () => this.toggleOpen(),
      // content: `view updates (v: ${formatDate(commitsJson[0].authorDate)})`,
      content: ``,
    });
    window.addEventListener("click", () => {
      if (this.open) this.toggleOpen();
    });
    this.text.absolute = true;
    this.text.align = "left";
    this.text.font = firstCoffee.family;
  }
  toggleOpen() {
    this.open = !this.open;
    if (!this.open) {
      UserUpdatesManager.userUpdatedTo = new Date().toISOString().slice(0, 10);
    }
    this.yOffset = 0;
  }
  compute(props: ComputeProps) {

    const label = `View updates (${
      UserUpdatesManager.newUpdatesCount
        ? `${UserUpdatesManager.newUpdatesCount} new ones!`
        : `you're up to date`
    })`;
    this.button.content = label;
    this.button.text.content = label;
    this.button.compute(props);
  }
  render(view: View) {
    this.button.render(view);
    if (!this.open) return;
    // If the scroll event is fired, change the offset respectively
    eventStream.read("scroll", ({ direction }) => {
      this.yOffset -= 1 * direction;
      const MAX = 0;
      const MIN = -aggregatedCommits.length + 1;
      // Prevent out-of-bounds scrolling
      if (this.yOffset > MAX) {
        this.yOffset = MAX;
      } else if (this.yOffset < MIN) {
        this.yOffset = MIN;
      }
    });

    const prevAlpha = view.context.globalAlpha;
    view.context.globalAlpha = 0.85;
    view.context.fillStyle = "black";
    view.context.fillRect(0, 0, view.canvas.width, view.canvas.height);

    view.context.globalAlpha = prevAlpha;
    this.text.color = "white";
    // Iterates over each commit aggregation [date, commitList]
    for (let i = 0, lines = 0; i < aggregatedCommits.length; i++) {
      const [date, commits] = aggregatedCommits[i];
      this.text.y = 5 + lines + this.yOffset;
      // Do not render and continue the iteration if out-of-bounds
      if (this.text.y > view.h || this.text.y < 5) {
        lines++;
        continue;
      }
      this.text.x = view.w / 2 - 8;
      this.text.fontSize = 10;
      this.text.content = date;
      view.context.globalAlpha = 0.6;
      this.text.render(view);
      view.context.globalAlpha = 1;
      lines++;
      // Iterates over each commit
      for (let i = 0; i < commits.length; i++) {
        this.text.y = 5 + lines + this.yOffset;
        // Do not render and continue the iteration if off-bounds
        if (this.text.y > view.h || this.text.y < 5) {
          lines++;
          continue;
        }
        this.text.x = view.w / 2 - 7;
        this.text.fontSize = 10;
        this.text.content = commits[i].subject;
        this.text.render(view);
        renderTextPrefix(
          view,
          this.text,
          commits[i].authorDate > UserUpdatesManager.userUpdatedTo
        );
        lines++;
      }
    }
  }
}
const renderTextPrefix = (view: View, text: GameText, isNew: boolean) => {
  view.context.fillStyle = "#ff818f" + (isNew ? "" : "66");
  const GAP = 0.1;
  const DOT_WIDTH = 0.4;
  let prefixTextWidth = 0;
  if (isNew) {
    const newText = "new!";
    prefixTextWidth =
      view.context.measureText(newText).width / view.tilesize / view.ratio;
    view.context.fillText(
      newText,
      ...view.parsePoint(
        { x: text.x - prefixTextWidth - GAP, y: text.y },
        { absolute: true }
      )
    );
  }
  view.context.beginPath();
  view.context.arc(
    ...view.parsePoint(
      { x: text.x - prefixTextWidth - GAP - DOT_WIDTH, y: text.y - 0.1 },
      { absolute: true }
    ),
    (DOT_WIDTH / 2) * view.tilesize * view.ratio,
    0,
    Math.PI * 2
  );
  view.context.closePath();
  view.context.fill();
};
