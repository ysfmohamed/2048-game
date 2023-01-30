class Game {
  constructor() {
    this.board = new Board();
  }

  getBoard = () => {
    return this.board;
  };
}

class Board {
  constructor() {
    this.createBoard();
    this.loadBoardWithGridCells();
    this.putFirstTwoBlocks();
  }

  createBoard = () => {
    this.matrix = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.matrix[i] = new Array(4);
    }
  };

  loadBoardWithGridCells = () => {
    const gridContainer = document.querySelector(".grid-container");

    for (let i = 0; i < gridContainer.children.length; i++) {
      this.matrix[i] = gridContainer.children[i].children;
    }
  };

  putFirstTwoBlocks = () => {
    const randomizeFirstCell = Random.randomize(0, 4);
    const randomizeSecondCell = Random.randomize(0, 4);

    const positions = Random.handleRandomization(
      randomizeFirstCell,
      randomizeSecondCell
    );

    this.matrix[positions.firstTilePos.row][
      positions.firstTilePos.col
    ].innerHTML = "<div>2</div>";
    this.matrix[positions.secondTilePos.row][
      positions.secondTilePos.col
    ].innerHTML = "<div>2</div>";
  };

  clearGridCells = () => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.matrix[i][j].innerHTML = "";
      }
    }
  };

  getMatrix = () => {
    return this.matrix;
  };
}

class Random {
  constructor() {}

  static randomCellContent = () => {
    return Math.random() > 0.9 ? 2 : 4;
  };

  static randomize = (min, max) => {
    const row = Math.floor(Math.random() * (max - min) + min);
    const col = Math.floor(Math.random() * (max - min) + min);

    return { row, col };
  };

  static handleRandomization(firstTilePos, secondTilePos) {
    if (
      firstTilePos.row === secondTilePos.row &&
      firstTilePos.col === secondTilePos.col
    ) {
      let temp = secondTilePos.row;
      secondTilePos.row = secondTilePos.col;
      secondTilePos.col = temp;
    } else if (
      ((firstTilePos.row === firstTilePos.col) === secondTilePos.row) ===
      secondTilePos.col
    ) {
      if (firstTilePos.row === 3) {
        firstTilePos.row -= 1;
      } else {
        secondTilePos.row += 1;
      }
    }

    return { firstTilePos, secondTilePos };
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      console.log("Up");
      break;
    case "ArrowDown":
      console.log("Down");
      break;
    case "ArrowRight":
      console.log("Right");
      UserEvent.shiftBlocksToRight(game.getBoard().getMatrix());
      break;
    case "ArrowLeft":
      console.log("Left");
      break;
  }
});

/* ########## START NEW GAME ########## */
const newGameButton = document.querySelector(".newgame-button");
newGameButton.addEventListener("click", () => {
  game.getBoard().clearGridCells();
  new Board();
});

/* ########## START GAME ########## */
let game = new Game();
console.log(game.getBoard().getMatrix());
