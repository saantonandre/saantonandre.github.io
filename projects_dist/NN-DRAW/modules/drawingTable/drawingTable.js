import { pointRectCol } from "../physics/physics.js";

export class DrawingTable {
    constructor(canvas, context, width, height) {
        this.matrix = [];
        this.array = [];
        this.width = width;
        this.height = height;
        this.mouseCol = false;
        this.brush = new Image();
        this.brush.src = "./assets/brush.png";
        this.leftButton = false;
        this.rightButton = false;
        this.changed = false;

        this.clearButton = document.createElement("button");
        this.clearButton.innerHTML = "clear";
        this.clearButton.style.position = "absolute";
        this.clearButton.style.right = "50px";
        this.clearButton.style.top = "0px";
        this.clearButton.onclick = () => { this.clear(canvas, context) };
        document.body.appendChild(this.clearButton);
        this.initialize(canvas, context);
    }
    updateLastMousePos(mouse) {

    }
    initialize(canvas, c) {
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.center();
        this.clear(canvas, c);
        this.matrix = [];
        for (let i = 0; i < this.height / 10; i++) {
            this.matrix.push([]);
            for (let j = 0; j < this.width / 10; j++) {
                this.matrix[i].push(0);
            }
        }
    }
    toMatrix(c) {
        for (let i = 0; i < this.height / 10; i++) {
            for (let j = 0; j < this.width / 10; j++) {
                this.matrix[j][i] = this.round(c.getImageData(i * 10, j * 10, 10, 10))
            }
        }
    }
    toArray(c) {
        this.array = [];
        for (let i = 0; i < this.height / 10; i++) {
            for (let j = 0; j < this.width / 10; j++) {
                this.array.push(this.round(c.getImageData(j * 10, i * 10, 10, 10)));
            }
        }
        return this.array;
    }
    round(imageData) {
        let total = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
            total += ((imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3) / 255 * (imageData.data[i + 3] / 255); //(r+g+b)/3*a
        }
        total = 1 - (total / (imageData.data.length / 4));
        return total;
    }
    clear(canvas, c) {
        c.clear();
        c.fillStyle = "white";
        c.fillRect(0, 0, canvas.width, canvas.height);
    }
    update(mouse, canvas, c) {
        this.mouseCol = pointRectCol(mouse.absolute, canvas.hitbox());
        // if (this.leftButton && !mouse.leftButton) {
        // this.leftButton = mouse.leftButton;
        // return this.toArray(c);
        // }
        this.leftButton = mouse.leftButton;
        if (!this.rightButton && mouse.rightButton) {
            this.toMatrix(c);
            c.clear();
            for (let i = 0; i < this.matrix.length; i++) {
                for (let j = 0; j < this.matrix[i].length; j++) {
                    let a = this.matrix[i][j];
                    c.fillStyle = `rgba(${255-255*a},${255-255*a},${255-255*a},1)`;
                    c.fillRect(
                        j * 10,
                        i * 10,
                        10,
                        10
                    )
                }
            }

        }
        this.rightButton = mouse.rightButton;
        this.render(mouse, c)
        if (this.changed) {
            return this.toArray(c);
        }
    }
    render(mouse, c) {
        this.changed = false;
        if (this.mouseCol && mouse.leftButton) {
            c.fillStyle = "black";
            c.beginPath();
            c.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
            c.closePath()
            c.fill();
            this.changed = true;
        }
    }
    getData() {

    }
}