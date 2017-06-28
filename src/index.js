import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const totalRows = 3;
const squaresPerRow = 3;

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                id={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(row) {
        const sq = [];
        const offset = row * squaresPerRow;
        for (let s = 0; s < squaresPerRow; s++) {
            sq.push(this.renderSquare(s+offset));
        }
        return (<div className="board-row">{sq}</div>);
    }

    render() {
        const rows = [];
        for (let i = 0; i < totalRows; i++) {
            rows.push(this.renderRow(i))
        }
        return (<div>{rows}</div>);
    //     return (
    //         <div>
    //             <div className="board-row">
    //                 {this.renderSquare(0)}
    //                 {this.renderSquare(1)}
    //                 {this.renderSquare(2)}
    //             </div>
    //             <div className="board-row">
    //                 {this.renderSquare(3)}
    //                 {this.renderSquare(4)}
    //                 {this.renderSquare(5)}
    //             </div>
    //             <div className="board-row">
    //                 {this.renderSquare(6)}
    //                 {this.renderSquare(7)}
    //                 {this.renderSquare(8)}
    //             </div>
    //         </div>
    //     );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{squares: Array(9).fill(null),}],
            xIsNext: true,
            stepNumber: 0,
        };
}

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).winner : null;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + move :
                'Game start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            if (this.state.stepNumber >= totalRows * squaresPerRow) {
                status = "It's a draw!";
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
            return {winner: squares[a], coords: [a, b, c]};
        }
    }
    return null;
}
