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
    const getActivePlayer = ()=>{return activePlayer};
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
        if(gameBoard.placePiece(activePlayer.marker, index)){
            const board = gameBoard.getBoard();
            if (isWon(activePlayer)) {
                console.log(`${activePlayer.getName()} wins!`);
                return "win";
            } else if(board.every(marker => marker !== " ")) {
                console.log("Tie!")
                return "tie";
            } else {
                console.log("Switching turns, active player will change")
                switchTurn();
                return "continue";
            }
        }
        console.log("Spot already taken, active plaayer will remain the same")
        return "invalid";
    }
    const resetGame = () =>{
        gameBoard.reset();
        activePlayer = player1;
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

    return { playTurn, getActivePlayer, resetGame, getBoard: gameBoard.getBoard, printBoard};
})();

// const displayController (() => {
//     //renderboard

//     //event listeners for board spots

//     //event listener for restart game

//     //event listener
// })();

  gameLogic.resetGame();
gameLogic.playTurn(0); // X plays top-left
gameLogic.printBoard();
gameLogic.playTurn(3); // O plays middle-left
gameLogic.playTurn(1); // X plays top-middle
gameLogic.printBoard();
gameLogic.playTurn(4); // O plays center
gameLogic.playTurn(2); // X plays top-right -> Returns "win"
gameLogic.printBoard();

gameLogic.resetGame();
gameLogic.playTurn(1); // X plays top-middle
gameLogic.playTurn(0); // O plays top-left
gameLogic.printBoard();
gameLogic.playTurn(2); // X plays top-right
gameLogic.playTurn(4); // O plays center
gameLogic.playTurn(3); // X plays middle-left
gameLogic.playTurn(8); // O plays bottom-right -> Returns "win"
gameLogic.printBoard();

gameLogic.resetGame();
gameLogic.playTurn(0); // X
gameLogic.playTurn(4); // O
gameLogic.playTurn(1); // X
gameLogic.playTurn(2); // O
gameLogic.playTurn(5); // X
gameLogic.playTurn(3); // O
gameLogic.playTurn(6); // X
gameLogic.playTurn(8); // O
gameLogic.playTurn(7); // X -> Returns "tie"
gameLogic.printBoard();

gameLogic.resetGame();
gameLogic.playTurn(0); // X plays top-left
gameLogic.printBoard();

// INVALID MOVE TEST: O tries to play in the exact same spot (0)
gameLogic.playTurn(0); // Should return "invalid" (or not allow it)
gameLogic.getActivePlayer(); // Should STILL be Player O's turn (turn didn't advance)

// Correct move for O:
gameLogic.playTurn(4); // O plays center successfully
gameLogic.printBoard();


