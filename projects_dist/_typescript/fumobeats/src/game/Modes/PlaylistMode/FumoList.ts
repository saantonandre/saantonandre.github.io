import { Fumobeat } from "game/Fumobeat";
import { FumoPreview } from "game/Modes/PlaylistMode/FumoPreview";
import { FumobeatCard } from "game/Modes/PlaylistMode/FumobeatCard";
import { PLAYLIST_AUDIO } from "game/Modes/PlaylistMode/PlaylistMode";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";
import { eventStream } from "game/gameEvents";
import { ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";

const GAP = 0.5;
const SCROLL_STRENGTH = 1;
export class FumoList extends InterfaceEntity {
  fumobeats: Fumobeat[];
  fumoCards: FumobeatCard[] = [];
  fumoPreview = new FumoPreview(this);
  yOffset = 0;
  prevLength = 0;
  hoveredFumo: null | Fumobeat = null;
  sound: ComputeProps["sound"];
  constructor(
    fumobeats: Fumobeat[],
    sound: ComputeProps["sound"],
    x: number,
    y: number
  ) {
    super(x, y);
    this.sound = sound;
    this.fumobeats = fumobeats;
    for (const fumobeat of fumobeats) {
      this.fumoCards.push(
        new FumobeatCard(x, y, fumobeat, (v, prev) => this.setHovered(v, prev))
      );
    }

    this.behaviors.push(createClickBehavior());
  }
  setHovered(fumobeat: Fumobeat | null, prev?: Fumobeat) {
    if (prev && prev !== this.hoveredFumo) return;
    this.hoveredFumo = fumobeat;
    if (fumobeat === null) {
      this.sound.destroyCustomAudio(PLAYLIST_AUDIO);
      return;
    }
    const audio = this.sound.addCustom(PLAYLIST_AUDIO, fumobeat.file);
    const original = audio.instances[0].original;
    const triggerOnce = (fn: () => void) => {
      let triggered = false;
      return () => {
        if (triggered) return;
        triggered = true;
        fn();
      };
    };
    original.onplaying = triggerOnce(() => {
      original.currentTime = original.duration * 0.33;
    });
    this.sound.playCustom(PLAYLIST_AUDIO);
  }
  handleChange() {
    console.log("Handling changes");
    // Checks for deleted fumobeats
    for (let i = this.fumoCards.length - 1; i >= 0; i--) {
      const fumobeat = this.fumoCards[i].fumobeat;
      const index = this.fumobeats.indexOf(fumobeat);
      if (index < 0) this.fumoCards.splice(i, 1);
    }
    // Checks for added fumobeats
    for (const fumobeat of this.fumobeats) {
      const hasFumobeat = !!this.fumoCards.find((f) => f.fumobeat === fumobeat);
      if (!hasFumobeat) {
        this.fumoCards.push(
          new FumobeatCard(this.x, this.y, fumobeat, (v, prev) =>
            this.setHovered(v, prev)
          )
        );
      }
    }
  }
  compute(props: ComputeProps) {
    if (this.fumobeats.length !== this.prevLength) {
      this.prevLength = this.fumobeats.length;
      this.handleChange();
    }
    eventStream.read("scroll", ({ direction }) => {
      this.yOffset -= SCROLL_STRENGTH * direction;
      const MIN = -(this.fumoCards.length - 1) * (GAP + 2);
      const MAX = 0;
      if (this.yOffset < MIN) {
        this.yOffset = MIN;
      }
      if (this.yOffset > MAX) {
        this.yOffset = MAX;
      }
    });
    for (let i = 0; i < this.fumoCards.length; i++) {
      const card = this.fumoCards[i];
      card.y = this.y + this.yOffset + (GAP + card.h) * i;
      if (card.y > props.view.h) break;
      if (card.y + card.h < 0) continue;
      card.compute(props);
    }
    this.fumoPreview.compute(props);
  }
  render(view: View) {
    for (const card of this.fumoCards) {
      if (card.y > view.h) break;
      if (card.y + card.h < 0) continue;
      card.render(view);
    }
    this.fumoPreview.render(view);
  }
}
