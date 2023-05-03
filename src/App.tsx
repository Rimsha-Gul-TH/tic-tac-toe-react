import { createContext, useContext, useState } from "react";
import "./App.css";

const ThemeContext = createContext<string | null>(null);

function Square({ value, onSquareClick, children }: any) {
  const theme = useContext(ThemeContext);
  const className = "square-" + theme;
  return (
    <button className={className} onClick={onSquareClick}>
      {value} {children}
    </button>
  );
}

function calculateWinner(squares: any) {
  const lines = [
    [0, 1, 2], // row win
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // column win
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonal win
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({ xsTurn, squares, onPlay, children }: any) {
  const theme = useContext(ThemeContext);
  const className = "status-" + theme;
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(hasValue)) {
    status = "Game Drawn";
  } else {
    status = "Player " + (xsTurn ? "X" : "O") + "'s turn";
  }

  function hasValue(sq: any) {
    if (sq) {
      return true;
    } else {
      return false;
    }
  }
  function handleClick(i: any) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    xsTurn ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    onPlay(nextSquares);
  }

  return (
    <>
      <div className={className}>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      {children}
    </>
  );
}

function Game({ children }: any) {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xsTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const gameTheme = useContext(ThemeContext);
  const className = "ol-" + gameTheme;

  function handlePlay(nextSquares: any) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: any) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_squares, move, _children) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button className={className} onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div>
          <Board xsTurn={xsTurn} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-light">
          <ol className={className}>{moves}</ol>
        </div>
      </div>

      {children}
    </>
  );
}

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Game />
      </ThemeContext.Provider>
      <button
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        Toggle theme
      </button>
    </>
  );
}

export default App;
