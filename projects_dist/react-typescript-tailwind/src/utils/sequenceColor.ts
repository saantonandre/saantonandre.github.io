const colors = [
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

const gen = colorGen(colors, (Math.random() * colors.length) | 0);

export const sequenceColor = () => {
  return gen.next().value as string;
};

export default sequenceColor;
