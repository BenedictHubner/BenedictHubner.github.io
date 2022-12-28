const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 576;
canvas.height = 576;

const cellSize = 30;
const mineNumber = 15;

const mouse = {
    x: undefined,
    y: undefined
}

const activeTile = {
    i: null,
    j: null,
    x: null,
    y: null
}

class Board {
    constructor({ width, height, position }) {
        this.width = width;
        this.height = height;
        this.position = position;
        this.bgCells = [];
        // M for mine, 0 empty, 1-8 for no. of adj mines
        this.fgCells = [];
        // 1 for covered, 0 for revealed
        for (let i = 0; i < this.height; i++) {
            this.fgCells[i] = [];
            this.bgCells[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.bgCells[i][j] = 0;
                this.fgCells[i][j] = 1;
            }
        }
    }

    draw() {
        c.fillStyle = "lightgray";
        c.fillRect(this.position.x, this.position.y, this.width * cellSize, this.height * cellSize);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let curX = this.position.x + j * cellSize;
                let curY = this.position.y + i * cellSize;
                let char = this.bgCells[i][j];
                c.fillStyle = "black";
                c.font = "bold 24px monospace";
                c.textAlign = "center";
                if (this.bgCells[i][j] != 0) {
                    c.fillText(`${char}`, curX + 15, curY + 24)
                }
                if (this.fgCells[i][j] == 1 || this.fgCells[i][j] == 2) {
                    c.fillStyle = "gray";
                    c.fillRect(curX + 1, curY + 1, cellSize - 2, cellSize - 2);
                    if (this.fgCells[i][j] == 2) {
                        c.fillStyle = "red";
                        c.fillRect(curX + 5, curY + 5, cellSize - 10, cellSize - 10);
                    }
                } else if (this.fgCells[i][j] == 3) {
                    c.fillStyle = "rgba(100, 0, 0, 0.5)";
                    c.fillRect(curX, curY, cellSize, cellSize);
                }
                c.strokeStyle = "black";
                c.strokeRect(curX, curY, cellSize, cellSize);
            }
        }
    }
}

function fill(mineNo, board) {
    while (mineNo > 0) {
        let randj = Math.floor(Math.random() * board.width);
        let randi = Math.floor(Math.random() * board.height);
        if (board.bgCells[randi][randj] != "M") {
            board.bgCells[randi][randj] = "M";
            mineNo--;
        }
    }
    for (let i = 0; i < board.width; i++) {
        for (let j = 0; j < board.height; j++) {
            let sum = 0;
            if (board.bgCells[i][j] != "M") {
                try {
                    if (board.bgCells[i - 1][j - 1] == "M") sum++;
                } catch (e) { } try {
                    if (board.bgCells[i - 1][j] == "M") sum++;
                } catch (e) { } try {
                    if (board.bgCells[i - 1][j + 1] == "M") sum++;
                } catch (e) { } try {
                    if (board.bgCells[i][j - 1] == "M") sum++;
                } catch (e) { } try {
                    if (board.bgCells[i][j + 1] == "M") sum++;
                } catch (e) { } try {
                    if (board.bgCells[i + 1][j - 1] == "M") sum++;
                } catch (e) { } try {
                    if (board.bgCells[i + 1][j] == "M") sum++;
                } catch (e) { } try {
                    if (board.bgCells[i + 1][j + 1] == "M") sum++;
                } catch (e) { };
                board.bgCells[i][j] = sum;
            }
        }
    }
}

function gameOver() {
    board.fgCells.forEach((row) => row.fill(0));
    board.fgCells[activeTile.i][activeTile.j] = 3;
    console.log(board.fgCells);
    board.draw();
    c.fillStyle = "red";
    c.font = "72px Arial";
    c.fillText("Game", canvas.width / 2, 100);
    c.fillText("Over", canvas.width / 2, 520);
    cancelAnimationFrame(end);
}

function win() {
    board.draw();
    c.fillStyle = "green";
    c.font = "72px Arial";
    c.fillText("You", canvas.width / 2, 100);
    c.fillText("Won", canvas.width / 2, 520);
    cancelAnimationFrame(end);
}

let board = new Board({
    width: 10,
    height: 10,
    position: {
        x: canvas.width / 2 - cellSize * 10 / 2,
        y: canvas.height / 2 - cellSize * 10 / 2
    }
});

fill(mineNumber, board);
let tileSum = board.width * board.height - mineNumber;

function animate() {
    end = requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "white";
    c.fillRect(5, 5, canvas.width - 10, canvas.height - 10);
    board.draw();
    if (activeTile.x != null) {
        if (board.fgCells[activeTile.i][activeTile.j] == 1) {
            c.fillStyle = "rgba(255, 255, 255, 0.35)";
            c.fillRect(activeTile.x, activeTile.y, cellSize, cellSize);
        }
    }
    let sum = 0;
    for (i = 0; i < board.height; i++) {
        for (j = 0; j < board.width; j++) {
            if (board.fgCells[i][j] == 0) sum++;
        }
    }
    if (sum == tileSum) win();
}

animate();

canvas.addEventListener('mousedown', (e) => {
    if (activeTile.x != null && e.button == 0) {
        if (board.fgCells[activeTile.i][activeTile.j] == 1) {
            board.fgCells[activeTile.i][activeTile.j] = 0;
            if (board.bgCells[activeTile.i][activeTile.j] == "M") {
                gameOver();
            } else if (board.bgCells[activeTile.i][activeTile.j] == 0) {

            }
        }
    } else if (activeTile.x != null && e.button == 2) {
        if (board.fgCells[activeTile.i][activeTile.j] == 1) {
            board.fgCells[activeTile.i][activeTile.j] = 2;
        } else if (board.fgCells[activeTile.i][activeTile.j] == 2) {
            board.fgCells[activeTile.i][activeTile.j] = 1;
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    mouse.y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height

    activeTile.i = null;
    activeTile.j = null;
    activeTile.x = null;
    activeTile.y = null;
    for (i = 0; i < board.height; i++) {
        for (j = 0; j < board.width; j++) {
            const tileX = board.position.x + j * cellSize;
            const tileY = board.position.y + i * cellSize;
            if (mouse.x > tileX && mouse.x < tileX + cellSize &&
                mouse.y > tileY && mouse.y < tileY + cellSize) {
                activeTile.i = i;
                activeTile.j = j;
                activeTile.x = tileX;
                activeTile.y = tileY;
                break;
            }
        }
    }
});