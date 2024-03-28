import React from "react";
import { useState } from "react";

function Square({value, onSquareClick}) {
    return (
        <button className="square" onClick={onSquareClick}>
            { value }
        </button>
        );
}

function Board({xIsNext, squares, onPlay}) {

    function handleClick(i) {
        if(squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next Player: " + (xIsNext ? "X" : "O");
    }

    function renderBoard() {
        let rows = [];

        for (let i = 0; i < 3; i++) {
            let rowSquares = [];
            for (let j = 0; j < 3; j++) {
                const index = i * 3 + j;
                rowSquares.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)} />) 
            }
            rows.push(<div className="board-row">{rowSquares}</div>)
        }
        return rows;
    } 

    return (
        <>
            <div className="status">{status}</div>
            {renderBoard()}
        </>
    )
}

function Toggle({isAsc, onToggleClick}) {
    const [asc, setAsc] = useState(isAsc);

    function handleClick() {
        onToggleClick();
        setAsc(!asc);
    }

    const order = isAsc ? "Ascending": "Descending";

    return <button onClick={handleClick}>{order} order</button>

}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [isAsc, setIsAsc] = useState(true);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    function handleToggle() {
        setIsAsc(!isAsc);
    }

    const moves = history.map((squares, move) => {
        let description;
        let currentMoveIndex = history.length - 1;

        if (move > 0 && move !== currentMoveIndex){
        description = "Go to move #" + move;
        } else if (move === currentMoveIndex) {
            description = "You are at move #" + move;
        } else {
            description = "Go to game start";
        }
    
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>
                    {description}
                </button>
            </li>
        )
    })

    const reversedMoves = [...moves].reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <Toggle isAsc={isAsc} onToggleClick={() => handleToggle()} />
                <ol>{isAsc ? moves : reversedMoves}</ol>
            </div>
        </div>
    );
}


function calculateWinner(squares) {
    const lines = [ //declare an array of the possible winning combinations
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i <lines.length; i++) { //cycle through the length of the lines array and check if the squares in those positions are the same - makes so much sense!
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}