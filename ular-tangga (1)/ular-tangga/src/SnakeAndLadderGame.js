import React, { useState } from 'react';

const SnakeAndLadderGame = () => {
    const [players, setPlayers] = useState([0, 0, 0, 0]); // Array of player positions
    const [currentPlayer, setCurrentPlayer] = useState(0); // Index of current player
    const [diceValue, setDiceValue] = useState(); // Current dice value
    const [diceLog, setDiceLog] = useState('');
    const [darkMode, setDarkMode] = useState(false); // State for dark mode

    const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 40 };
    const ladders = { 7: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

    const rollDice = () => {
        if (diceValue === undefined) {
            const newDiceValue = Math.floor(Math.random() * 6) + 1;
            setDiceValue(newDiceValue);
            setDiceLog(`Dadu: ${newDiceValue}`); // Add the new dice value to the log array
            movePlayer(currentPlayer, newDiceValue);
        }
    };

    const movePlayer = (playerIndex, steps) => {
        let newPlayers = [...players];
        let newPosition = newPlayers[playerIndex] + steps;

        if (newPosition > 100) {
            newPosition = 100;
        }

        if (newPosition in snakes) {
            newPosition = snakes[newPosition];
        } else if (newPosition in ladders) {
            newPosition = ladders[newPosition];
        }

        newPlayers[playerIndex] = newPosition;

        setTimeout(() => {
            setPlayers(newPlayers);
        }, 100);

        setDiceValue(steps);
        checkClimbLadder(playerIndex, newPlayers);
        checkWin(newPosition);
        switchPlayer();
    };

    const checkClimbLadder = (playerIndex, players) => {
        const playerPosition = players[playerIndex];

        if (playerPosition in ladders && playerPosition !== 0) {
            const ladderEnd = ladders[playerPosition];

            if (!players.includes(ladderEnd)) {
                players[playerIndex] = ladderEnd;
                setPlayers([...players]);
            }
        }
    };

    const checkWin = (position) => {
        if (position === 100) {
            alert(`Player ${currentPlayer + 1} wins!`);
            resetGame();
        }
    };

    const switchPlayer = () => {
        setCurrentPlayer((currentPlayer + 1) % 4);
        setDiceValue(undefined); // Reset dice value for the next player
    };

    const resetGame = () => {
        setDiceValue(undefined);
        setDiceLog(''); // Set log to an empty string
        setPlayers([0, 0, 0, 0]);
        setCurrentPlayer(0);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`game-container ${darkMode ? 'dark' : ''}`}>
            <div className="board">
                {[...Array(100)].map((_, index) => {
                    const row = Math.floor(index / 10);
                    const col = index % 10;
                    const position = index + 1;
                    const isSnake = position in snakes;
                    const isLadder = position in ladders;
                    const snakeOrLadder = isSnake ? 'snake' : isLadder ? 'ladder' : '';

                    let number;
                    if (position === 1) {
                        number = '1';
                    } else if (position === 100) {
                        number = '100';
                    } else {
                        number = position;
                    }

                    return (
                        <div
                            key={index}
                            className={`square ${snakeOrLadder}`}
                            style={{
                                gridColumn: `${col + 1}`,
                                gridRow: `${9 - row + 1}`,
                            }}
                        >
                            {number}
                        </div>
                    );
                })}
                {players.map((player, index) => (
                    <div
                        key={index}
                        className={`player player-${index + 1} ${player === 0 ? 'player-start' : ''}`}
                        style={{
                            bottom: `${Math.floor((player - 1) / 10) * 10}%`,
                            left: `${((player - 1) % 10) * 10}%`,
                        }}
                    >
                        {player === 0 ? '' : index + 1}
                    </div>
                ))}
            </div>

            <div className="info-container">
                <div className="game-info">
                    <h3>Pemain {currentPlayer + 1}</h3>
                    <button onClick={rollDice} disabled={players[currentPlayer] === 100}>
                        {diceValue === undefined
                            ? `Player ${currentPlayer + 1}, Roll Dice`
                            : `Player ${currentPlayer + 1} rolled ${diceValue}`}
                    </button>
                    <p>{diceLog}</p>
                    <button onClick={resetGame}>Reset Game</button>
                    <button onClick={toggleDarkMode}>
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
                <div className="snake-info">
                    <h3>Posisi Ular:</h3>
                    <ul>
                        {Object.entries(snakes).map(([start, end]) => (
                            <li key={start}>
                                Dari {start} ke {end}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="ladder-info">
                    <h3>Posisi Tangga:</h3>
                    <ul>
                        {Object.entries(ladders).map(([start, end]) => (
                            <li key={start}>
                                Dari {start} ke {end}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="color-description">
                <h3>Deskripsi Warna:</h3>
                <ul>
                    <li>
                        <span className="color-box snake-color"></span> Ular
                    </li>
                    <li>
                        <span className="color-box ladder-color"></span> Tangga
                    </li>
                    {/* Tambahkan deskripsi warna lainnya di sini */}
                </ul>
            </div>

            <style>{`
        .game-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .dark {
          background-color: #1a1a1a;
          color: #fff;
        }

        .board {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-template-rows: repeat(10, 1fr);
          width: 750px;
          height: 750px;
          border: 2px solid #000;
          background-color: #fff;
        }

        .dark .board {
          background-color: #1a1a1a;
        }

        .square {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          border: 1px solid #000;
        }

        .dark .square {
          color: #fff;
          border-color: #fff;
        }

        .snake {
          background-color: #ff4d4d;
          color: #fff;
        }

        .ladder {
          background-color: #66cc66;
          color: #fff;
        }

        .player {
          position: absolute;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .player-1 {
          background-color: #ff0000;
          color: #fff;
        }

        .player-2 {
          background-color: #00ff00;
          color: #000;
        }

        .player-3 {
          background-color: #0000ff;
          color: #fff;
        }

        .player-4 {
          background-color: #ffff00;
          color: #000;
        }

        .color-description {
            border: 1px solid #000;
            padding: 10px;
          }
  
          .color-box {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }
  
          .snake-color {
            background-color: #ff4d4d;
          }
  
          .ladder-color {
            background-color: #66cc66;
          }

        .player-start {
          visibility: hidden;
        }

        .info-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          justify-content: center;
          width: 300px;
        }

        .dark .info-container {
          color: #fff;
        }

        .game-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }

        .game-info h3 {
          margin: 0;
        }

        .game-info button {
          padding: 5px 10px;
        }

        .snake-info,
        .ladder-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .snake-info h3,
        .ladder-info h3 {
          margin: 0;
        }
      `}</style>
        </div>
    );
};

export default SnakeAndLadderGame;
