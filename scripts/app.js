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
    return Math.random() > 0.9 ? 4 : 2;
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

class Logic {
  constructor() {}

  static moveBlocksToLeft = (matrix) => {
    let changeAfterMove = false;

    let { isChanged: changeAfterFirstCompress } = this.compress(matrix);
    let { isChanged: changedAfterMerge } = this.merge(matrix);
    let { isChanged: changedAfterSecondCompress } = this.compress(matrix);

    if (changeAfterFirstCompress === true || changedAfterMerge === true) {
      changeAfterMove = true;
    }

    return { matrix, changeAfterMove };
  };

  static moveBlocksToRight = (matrix) => {
    this.reverse(matrix);
    let { changeAfterMove } = this.moveBlocksToLeft(matrix);

    this.reverse(matrix);

    return { matrix, changeAfterMove };
  };

  static moveBlocksToUp = (matrix) => {
    this.transpose(matrix);
    let { changeAfterMove } = this.moveBlocksToLeft(matrix);
    this.transpose(matrix);

    return { matrix, changeAfterMove };
  };

  static moveBlocksToDown = (matrix) => {
    this.transpose(matrix);
    let { changeAfterMove } = this.moveBlocksToRight(matrix);
    this.transpose(matrix);

    return { matrix, changeAfterMove };
  };

  static generateCell = (matrix) => {
    let pos = Random.randomize(0, 4);

    while (matrix[pos.row][pos.col].innerHTML !== "") {
      pos = Random.randomize(0, 4);
    }

    const cellContent = Random.randomCellContent();
    matrix[pos.row][pos.col].innerHTML = `<div>${cellContent}</div>`;
  };

  static compress = (matrix) => {
    let pos = 0;
    let isChanged = false;

    for (let i = 0; i < 4; i++) {
      pos = 0;
      for (let j = 0; j < 4; j++) {
        if (matrix[i][j].innerHTML !== "") {
          matrix[i][pos].innerHTML = matrix[i][j].innerHTML;
          if (j !== pos) {
            matrix[i][j].innerHTML = "";
            isChanged = true;
          }
          pos += 1;
        }
      }
      pos = 0;
    }

    return { matrix, isChanged };
  };

  static merge = (matrix) => {
    let isChanged = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          matrix[i][j].innerText === matrix[i][j + 1].innerText &&
          matrix[i][j].innerText !== ""
        ) {
          let currentValue = parseInt(matrix[i][j].innerText) * 2;
          matrix[i][j].innerHTML = `<div>${currentValue}</div>`;
          matrix[i][j + 1].innerHTML = "";
          isChanged = true;
        }
      }
    }

    return { matrix, isChanged };
  };

  static reverse = (matrix) => {
    let start = 0;
    let end = 3;
    for (let i = 0; i < 4; i++) {
      start = 0;
      end = 3;
      for (; start <= end; ) {
        let temp = matrix[i][start].innerHTML;
        matrix[i][start].innerHTML = matrix[i][end].innerHTML;
        matrix[i][end].innerHTML = temp;
        start += 1;
        end -= 1;
      }
    }
  };

  static transpose = (matrix) => {
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        let temp = matrix[i][j].innerHTML;
        matrix[i][j].innerHTML = matrix[j][i].innerHTML;
        matrix[j][i].innerHTML = temp;
      }
    }
  };
}

window.addEventListener("keydown", (event) => {
  const board = game.getBoard().getMatrix();
  let isChangedAfterMove;

  switch (event.key) {
    case "ArrowUp":
      isChangedAfterMove = Logic.moveBlocksToUp(board).changeAfterMove;
      break;
    case "ArrowDown":
      isChangedAfterMove = Logic.moveBlocksToDown(board).changeAfterMove;
      break;
    case "ArrowRight":
      isChangedAfterMove = Logic.moveBlocksToRight(board).changeAfterMove;
      break;
    case "ArrowLeft":
      isChangedAfterMove = Logic.moveBlocksToLeft(board).changeAfterMove;
      break;
  }

  if (isChangedAfterMove) {
    Logic.generateCell(board);
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
