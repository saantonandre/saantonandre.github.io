import { MapEditor } from "./MapEditor";

export function renderGrid(this: MapEditor) {
  this.context.lineWidth = 1;
  const gridSize = 1;
  const xOffset = -this.x % gridSize;
  const yOffset = -this.y % gridSize;
  const wLines = this.w / gridSize + 1;
  const hLines = this.h / gridSize + 1;
  const sizeMult = this.tilesize * this.ratio;
  const DEFAULT_COLOR = "#222";
  const AXES_COLOR = "darkgreen";
  this.context.strokeStyle = DEFAULT_COLOR;
  this.context.beginPath();
  for (let i = 0; i < wLines; i++) {
    // vertical lines
    const x = xOffset + i * gridSize;
    this.context.moveTo(x * sizeMult, 0);
    this.context.lineTo(x * sizeMult, this.h * sizeMult);
  }
  for (let i = 0; i < hLines; i++) {
    // horizontal lines
    const y = yOffset + i * gridSize;
    this.context.moveTo(0, y * sizeMult);
    this.context.lineTo(this.w * sizeMult, y * sizeMult);
  }
  this.context.closePath();
  this.context.stroke();
  // render axes
  this.context.strokeStyle = AXES_COLOR;
  this.context.beginPath();
  this.context.moveTo(-this.x * sizeMult, 0);
  this.context.lineTo(-this.x * sizeMult, this.h * sizeMult);
  this.context.moveTo(0,-this.y * sizeMult );
  this.context.lineTo(this.w * sizeMult,-this.y * sizeMult);
  this.context.closePath();
  this.context.stroke();
}
