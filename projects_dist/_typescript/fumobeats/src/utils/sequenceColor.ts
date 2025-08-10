export const old_sequenceColors = [
  "#1E75FF",
  "#FF974A",
  "#FC5A5A",
  "#82C43C",
  "#A461D8",
  "#50B5FF",
  "#FF9AD5",
  "#FFC542",
  "#3DD598",
];
export const sequenceColors = [
  "#FF0000",
  "#0000FF",
  "#00FF00",
  "#B22222",
  "#FF7F50",
  "#9ACD32",
  "#FF4500",
  "#2E8B57",
  "#DAA520",
  "#D2691E",
  "#5F9EA0",
  "#1E90FF",
  "#FF69B4",
  "#8A2BE2",
  "#00FF7F",
];
function* colorGen(colors: string[], index: number) {
  let count = index;
  while (true) {
    if (count >= colors.length || count < 0) {
      count = 0;
    }
    yield colors[count];
    count++;
  }
}

const gen = colorGen(
  sequenceColors,
  (Math.random() * sequenceColors.length) | 0
);

export const sequenceColor = () => {
  return gen.next().value as string;
};
export const colorGenGenerator = () => {
  const gen = colorGen(
    sequenceColors,
    (Math.random() * sequenceColors.length) | 0
  );
  const sequenceColor = () => {
    return gen.next().value as string;
  };
  return sequenceColor;
};
