import { useState } from "react";

function Square({ value, onSquareClick, isWinnerSquare }) {
  return (
    <button
      className={`square ${isWinnerSquare ? "winner" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function TicTacToeApp() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDescending, setIsDescending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function getMoveLocation(prevSquares, currentSquares) {
    for (let i = 0; i < prevSquares.length; i++) {
      if (prevSquares[i] !== currentSquares[i]) {
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        return [row, col];
      }
    }
    return [0, 0];
  }

  const moves = history.map((squares, move) => {
    if (move > 0) {
      const [prevRow, prevCol] = getMoveLocation(history[move - 1], squares);
      const description = `Go to move #${move} (${prevRow}, ${prevCol})`;
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>Go to game start</button>
        </li>
      );
    }
  });

  const sortedMoves = isDescending ? moves : moves.slice().reverse();

  const winnerSquares = calculateWinner(currentSquares);
  const status = winnerSquares
    ? "Winner: " + currentSquares[winnerSquares[0]]
    : "Next player: " + (xIsNext ? "X" : "O");

  function toggleSortOrder() {
    setIsDescending(!isDescending);
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = 3 * row + col;
      const isWinnerSquare =
        winnerSquares && winnerSquares.includes(squareIndex);
      rowSquares.push(
        <Square
          key={squareIndex}
          value={currentSquares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinnerSquare={isWinnerSquare}
        />
      );
    }
    boardRows.push(
      <div className="board-row" key={row}>
        {rowSquares}
      </div>
    );
  }

  function handleClick(i) {
    if (calculateWinner(currentSquares) || currentSquares[i]) {
      return;
    }
    const nextSquares = currentSquares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    handlePlay(nextSquares);
  }

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        {boardRows}
      </div>
      <div className="game-info">
        <div>
          {currentMove === history.length - 1
            ? `You are at move #${currentMove}`
            : null}
        </div>
        <ol>{sortedMoves}</ol>
        <button onClick={toggleSortOrder}>
          Sort {isDescending ? "Ascending" : "Descending"}
        </button>
      </div>
    </div>
  );
}

export default TicTacToeApp;
