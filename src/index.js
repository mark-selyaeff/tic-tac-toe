import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const totalRows = 3;
const squaresPerRow = 3;

function Square(props) {
    const bgColor = props.won ? 'red' : 'white';

    return (
        <button className="square" onClick={props.onClick} style={{background: bgColor }}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let won = false;
        if (this.props.coords.includes(i)) {
            won = true;
        }
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)} won={won}
            />
        );
    }

    renderRow(row) {
        const sq = [];
        const offset = row * squaresPerRow;
        for (let s = 0; s < squaresPerRow; s++) {
            sq.push(this.renderSquare(s+offset));
        }
        return (<div className="board-row" key={row}>{sq}</div>);
    }

    render() {
        const rows = [];
        for (let i = 0; i < totalRows; i++) {
            rows.push(this.renderRow(i))
        }
        return (<div>{rows}</div>);
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{squares: Array(9).fill(null), coordsChanged: null}],
            xStarted: true,
            stepNumber: 0,
        };
}

    getCurrentPlayer(moveNumber) {
        //If X started (true), then return an 'X' when move number length is odd
        //If O started (false), then return an 'O' when move number is odd
        return (moveNumber % 2) - this.state.xStarted ? 'O' : 'X';
    }

    getCoords(cellNumber) {
        let res = {x: cellNumber % squaresPerRow, y: Math.floor(cellNumber / totalRows) };
        return '(' + res.y + ',' + res.x + ')'
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        console.log(history.length);
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.getCurrentPlayer(history.length);

        this.setState({
            history: history.concat([{
                squares: squares, coordsChanged: i
            }]),
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const isWin = calculateWinner(current.squares) ? calculateWinner(current.squares) : null;
        const winner = isWin ? isWin.winner : null;
        const coords = isWin ? isWin.coords : [];

        const moves = history.map((step, moveNumber) => {
            const desc = moveNumber ?
                'Move #' + this.getCurrentPlayer(moveNumber) + ' ' + this.getCoords(step.coordsChanged) : 'Game start';
            return (
                <li key={moveNumber}>
                    <a href="#" style={{'font-weight': moveNumber === this.state.stepNumber ? 'bold' : 'normal'}}
                       onClick={() => this.jumpTo(moveNumber)}>{desc}</a>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + this.getCurrentPlayer(history.length);
            if (this.state.stepNumber >= totalRows * squaresPerRow) {
                status = "It's a draw!";
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board coords={coords} squares={current.squares} onClick={(i) => this.handleClick(i)} />
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

