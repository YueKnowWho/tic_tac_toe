const gameBoard = (() =>{
    let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    const isSpotEmpty = (index) => board[index] === " ";
    const getBoard = () => board;
    const placePiece = (piece, index) => {
        if(isSpotEmpty(index)){
            board[index] = piece;
            return true;
        }
        return false;                             
    }
    const reset = () => board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    return {placePiece, reset, isSpotEmpty, getBoard};
})();

const createPlayer = (name, marker) => {
    const getName = () => {
        return name;
    }
    const changeName = (newName) =>{
        name = newName;
    }
    return { marker,getName, changeName};
};

const gameLogic = (()=>{
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
    
    let activePlayer = player1;
    let gameOver = false;
    const getActivePlayer = ()=>{return activePlayer};
    const isGameOver = () => gameOver;
    const getPlayers = () => ({ X: player1, O: player2 });
    const switchTurn = () =>{
        activePlayer = activePlayer === player1 ? player2 : player1;
    }
    const isWon = (activePlayer) => {
        const board = gameBoard.getBoard();
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]              // diagonals
        ];
        // check each winning combo check if all of the indexes are the same marker
        for(const combo of winningCombos){
            if(combo.every(index => board[index] === activePlayer.marker)){
                return true;
            }
        }
        return false;
    }
    const playTurn = (index) => {
        if (gameOver) {
            return "finished";
        }
        if(gameBoard.placePiece(activePlayer.marker, index)){
            const board = gameBoard.getBoard();
            if (isWon(activePlayer)) {
                gameOver = true;
                return "win";
            } else if(board.every(marker => marker !== " ")){
                gameOver = true;
                return "tie";
            } else {
                switchTurn();
                return "continue";
            }
        }
        return "invalid";
    }
    const resetGame = () =>{
        gameBoard.reset();
        activePlayer = player1;
        gameOver = false;
    }
    const printBoard = () => {
        board = gameBoard.getBoard();
        console.log(
            `${board[0]} | ${board[1]} | ${board[2]}\n` +
            `-----------\n` +
            `${board[3]} | ${board[4]} | ${board[5]}\n` +
            `-----------\n` +
            `${board[6]} | ${board[7]} | ${board[8]}`
        );
    }
    // Test making a move

    return { playTurn, getActivePlayer, isGameOver, getPlayers, resetGame, getBoard: gameBoard.getBoard, printBoard};
})();

const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const messageDiv = document.querySelector(".game-message");
    const turnOutput = document.querySelector(".player-turn");
    const resetButton = document.querySelector(".reset-btn");
    const playerForms = document.querySelectorAll(".player-form");
    const players = gameLogic.getPlayers();

    const render = () => {
        const board = gameLogic.getBoard();
        cells.forEach((cell, index) => {
            const marker = board[index];
            cell.textContent = marker === " " ? "" : marker;
            cell.disabled = marker !== " " || gameLogic.isGameOver();
        });
        turnOutput.textContent = gameLogic.getActivePlayer().getName();
    };

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            const result = gameLogic.playTurn(index);
            render();
            if (result === "win") {
                messageDiv.textContent = `${gameLogic.getActivePlayer().getName()} wins!`;
            } else if (result === "tie") {
                messageDiv.textContent = "It's a tie!";
            }
        });
    });

    playerForms.forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const marker = form.dataset.player;
            const nameInput = form.elements.namedItem("name");
            const name = nameInput.value.trim();
            if (!name) {
                nameInput.setCustomValidity("Enter a name.");
                nameInput.reportValidity();
                return;
            }
            nameInput.setCustomValidity("");
            players[marker].changeName(name);
            render();
        });
    });

    resetButton.addEventListener("click", () => {
        gameLogic.resetGame();
        messageDiv.textContent = "";
        render();
    });

    render();

    return { render };
})();
