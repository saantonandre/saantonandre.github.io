//@ts-check
import { c, useState } from "../lib/base.js";
import { Container } from "./Container.js";

export const App = () => {
  return Container(
    [
      Container([Location(), Player()], sectionStyles),
      Container([], sectionStyles),
      Container([], sectionStyles),
    ],
    {
      width: "720px",
      height: "480px",
      margin: "auto",
      border: "1px solid white",
    }
  );
};

const Location = () => {
  return c("div", () => ({ children: ["Miniera maledetta"] }));
};

const Player = () => {
  const [g, s] = useState(0);
  document.onclick = () => {
    console.log(g());
    s(g() + 1);
  };
  return Container(
    [
      c("img", () => ({
        tag: "img",
        props: { src: "./assets/player.svg" },
        style: {
          width: "100%",
        },
      })),
      FilledBar(g, () => 10),
    ],
    {
      flexDirection: "column",
    }
  );
};

/**
 * @param {()=>number} value
 * @param {()=>number} total
 */
const FilledBar = (value, total) => {
  const commonStyles = {
    boxSizing: "border-box",
    top: "0px",
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "pink",
  };
  return Container(
    [
      c("div", () => ({ style: { ...commonStyles } })),
      c("div", () => ({
        style: {
          ...commonStyles,
          backgroundColor: "red",
          width: Math.floor((value() / total()) * 100) + "%",
        },
      })),
    ],
    {
      width: "100%",
      position: "relative",
      border: "1px solid black",
      borderRadius: "20px",
      height: "30px",
    }
  );
};
const sectionStyles = {
  boxSizing: "border-box",
  flexDirection: "column",
  height: "100%",
  flex: "1",
  border: "1px solid white",
};
