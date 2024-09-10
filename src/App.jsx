import React, { useRef, useState, useEffect } from 'react';
import './App.css';

function App() {
  const [canvas, setCanvas] = useState(Array(8).fill(Array(8).fill(false)));
  const [cellSize, setCellSize] = useState(0);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const cellSize = calculateCellSize();
  //     const grid = document.querySelector('.grid');
  //     if (grid) {
  //       grid.style.gridTemplateColumns = `repeat(${canvas[0].length}, ${cellSize}px)`;
  //       grid.style.gridTemplateRows = `repeat(${canvas.length}, ${cellSize}px)`;
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);
  //   handleResize(); // Initial call to set up the grid

  //   return () => window.removeEventListener('resize', handleResize);
  // }, [canvas]);
  

  useEffect(() => {
    const updateCellSize = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      
      let gridWidth = windowWidth;
      let gridHeight = windowWidth / canvas[0].length * canvas.length;

      if (gridHeight > windowHeight * 0.8) {
        gridHeight = windowHeight * 0.8;
        gridWidth = gridHeight / canvas.length * canvas[0].length;
      }

      setCellSize(gridWidth / canvas[0].length);
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [canvas.length, canvas[0].length]);


  const saveAsCppArray = () => {
    let cppArray = 'static const unsigned char PROGMEM logo_bmp[] = {\n';

    for (let y = 0; y < canvas.length ; y += 1) {
      let byte = 0;
      for (let x = 0; x < canvas[0].length; x += 1) {
        const isBlack = canvas[y][x];
        byte = (byte << 1) | (isBlack ? 1 : 0);
        if ((x + 1)  % 8 === 0) {
          cppArray += ` 0b${byte.toString(2).padStart(8, '0')},`;
          byte = 0;
        }
      }
      cppArray += '\n';
    }
    cppArray += '};';
    console.log(cppArray);
    navigator.clipboard.writeText(cppArray);
    // const element = document.createElement('a');
    // const file = new Blob([cppArray], { type: 'text/plain' });
    // element.href = URL.createObjectURL(file);
    // element.download = 'image.cpp';
    // document.body.appendChild(element);
    // element.click();
  };

  const resizeCanvas = (width, height) => {
    const newCanvas = Array(height).fill().map(() => Array(width).fill(false));
    for (let y = 0; y < Math.min(height, canvas.length); y++) {
      for (let x = 0; x < Math.min(width, canvas[0].length); x++) {
        newCanvas[y][x] = canvas[y][x];
      }
    }
    setCanvas(newCanvas);
  };

  const handleCellClick = (x, y) => {
    const newCanvas = canvas.map((row, rowIndex) =>
      row.map((cell, cellIndex) =>
        rowIndex === y && cellIndex === x ? !cell : cell
      )
    );
    setCanvas(newCanvas);
  };

  const clearArray = () => {
    setCanvas(Array(canvas.length).fill(Array(canvas[0].length).fill(false)));
  }


  return (
    <div className="App">
      <div className="controls">
        <button onClick={() => clearArray()}>
          Clear
        </button>
        <label>
          Width:
          <input
            type="number"
            value={canvas[0].length}
            onChange={(e) => resizeCanvas(Number(e.target.value), canvas.length)}
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            value={canvas.length}
            onChange={(e) => resizeCanvas(canvas[0].length, Number(e.target.value))}
          />
        </label>
      </div>
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${canvas[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${canvas.length}, 1fr)`,
          width: `${cellSize * canvas[0].length}px`,
          height: `${cellSize * canvas.length}px`,
          margin: '0 auto',
        }}
      >
        {canvas.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              onMouseDown={() => handleCellClick(cellIndex, rowIndex)}
              style={{
                backgroundColor: cell ? 'black' : 'white',
                border: '1px solid #ccc',
              }}
            ></div>
          ))
        )}
      </div>
      <button onClick={saveAsCppArray}>Copy as C++ Array</button>
    </div>
  );
}

export default App;
