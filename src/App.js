import React, {useState, useRef, useCallback} from 'react';
import produce from 'immer';
import './App.css';

const rows = 30;
const columns = 70;

const buildGrid = (x, y) => {
  const grid = [];
  for (let i = 0; i < x; i++) {
    const row = Array(y).fill(false);
    grid.push(row);
  }

  return grid;
};

const shiftByOne = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 1],
  [-1, -1],
  [-1, 0],
];

function App() {
  const [grid, setGrid] = useState(() => buildGrid(rows, columns));
  const [isActive, setIsActive] = useState(false);

  const isRunning = useRef(isActive);
  isRunning.current = isActive;

  const runGameOfLife = useCallback(() => {
    if (!isRunning.current) return;
    setGrid((grid) => {
      return produce(grid, (copy) => {
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[0].length; j++) {
            let neighbors = 0;
            shiftByOne.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < rows && newJ >= 0 && newJ < columns) {
                if (grid[newI][newJ]) neighbors += 1;
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              copy[i][j] = false;
            } else if (!grid[i][j] && neighbors === 3) copy[i][j] = true;
          }
        }
      });
    });
    setTimeout(() => runGameOfLife(), 500);
  }, []);
  const generateRandomGrid = useCallback(() => {
    const randomGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = Array.from(Array(columns), () =>
        Math.random() > 0.7 ? true : false
      );
      randomGrid.push(row);
    }
    setGrid(randomGrid);
  }, []);
  return (
    <>
      <button
        onClick={() => {
          setIsActive(!isActive);
          if (!isActive) {
            isRunning.current = true;
            runGameOfLife();
          }
        }}
      >
        {isActive ? 'Stop' : 'Start'}
      </button>
      <button onClick={generateRandomGrid}>Generate</button>
      <button
        onClick={() => {
          setIsActive(false);
          setGrid(buildGrid(rows, columns));
        }}
      >
        Reset
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 21px)`,
          gridAutoRows: '21px',
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              onClick={() => {
                setGrid(
                  produce(grid, (copy) => {
                    copy[i][j] = !copy[i][j];
                  })
                );
              }}
              key={`${i}-${j}`}
              style={{
                height: '20px',
                width: '20px',
                border: `1px solid black`,
                backgroundColor: grid[i][j] ? 'orange' : 'black',
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
