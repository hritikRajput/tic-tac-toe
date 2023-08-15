//generates player objects
const playerFactory = (name, marker) => {
  return { name, marker };
};

//the gameBoard module
const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const getBoard = () => board;
  const updateBoard = (index, marker) => {
    // Check if the cell is empty before updating
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    // Reset all cells to an empty state
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, updateBoard, resetBoard };
})();

//Create the displayController Module
const displayController = (() => {
  const boxes = document.querySelectorAll(".box");
  const restartButton = document.querySelector(".restart");
  const currentPlayerDisplay = document.querySelector(".currentPlayer");

  const renderBoard = () => {
    // Update UI to reflect the current state of the game board
    const board = gameBoard.getBoard();
    boxes.forEach((box, index) => {
      box.querySelector(".boxText").textContent = board[index];
    });
  };

  const handleBoxClick = (box, index) => {
    // Handle logic for box clicks
    const currentPlayer = gameFlow.getCurrentPlayer();
    if (gameBoard.updateBoard(index, currentPlayer.marker)) {
      renderBoard();
      if (gameFlow.checkWin(currentPlayer.marker)) {
        announceWinner(currentPlayer);
      } else if (gameFlow.checkTie()) {
        announceTie();
      } else {
        gameFlow.switchPlayer();
        updateCurrentPlayerDisplay();
      }
    }
  };

  const announceWinner = (player) => {
    // Display winner message
    currentPlayerDisplay.textContent = `${player.name} wins!`;
    disableClicks();
  };

  const announceTie = () => {
    // Display tie message
    currentPlayerDisplay.textContent = `It's a tie!`;
    disableClicks();
  };

  const disableClicks = () => {
    // Remove click event listeners from boxes
    boxes.forEach((box) => {
      box.removeEventListener("click", boxClickHandler);
    });
  };

  const updateCurrentPlayerDisplay = () => {
    // Update UI to display current player
    currentPlayerDisplay.textContent = `Current Player: ${
      gameFlow.getCurrentPlayer().name
    }`;
  };

  const boxClickHandler = (event) => {
    // Event listener for box clicks
    const index = Array.from(boxes).indexOf(event.target);
    handleBoxClick(event.target, index);
  };

  const init = () => {
    // Initialize UI elements and event listeners
    renderBoard();
    boxes.forEach((box) => {
      box.addEventListener("click", boxClickHandler);
    });
    restartButton.addEventListener("click", gameFlow.resetGame);
    updateCurrentPlayerDisplay();
  };

  return { init };
})();

const gameFlow = (() => {
  const player1 = playerFactory("Player 1", "X");
  const player2 = playerFactory("Player 2", "O");
  let currentPlayer = player1;

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = (marker) => {
    const board = gameBoard.getBoard();
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winConditions.some((condition) =>
      condition.every((index) => board[index] === marker)
    );
  };

  const checkTie = () => {
    const board = gameBoard.getBoard();
    return board.every((cell) => cell !== "");
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    currentPlayer = player1;
    displayController.init();
  };

  return { getCurrentPlayer, switchPlayer, checkWin, checkTie, resetGame };
})();

// Initialize the game
displayController.init();
