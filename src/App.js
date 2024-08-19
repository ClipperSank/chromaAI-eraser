// import React, { useEffect } from "react";
// import { Stage, Layer, Line, Text,  } from "react-konva"
// import { useState, useRef } from "react";

// function App() {
//   const [tool, setTool] = useState("pen");
//   const [lines, setLines] = useState([]);
//   const isDrawing = useRef(false);

//   const handleMouseDown = (e) => {
//     isDrawing.current = true;
//     const pos = e.target.getStage().getPointerPosition();
//     setLines([...lines, { tool, points: [pos.x, pos.y] }]);
//   };

//   const handleMouseMove = (e) => {
//     // no drawing - skipping
//     if (!isDrawing.current) {
//       return;
//     }
//     const stage = e.target.getStage();
//     const point = stage.getPointerPosition();
//     let lastLine = lines[lines.length - 1];
//     // add point
//     lastLine.points = lastLine.points.concat([point.x, point.y]);

//     // replace last
//     lines.splice(lines.length - 1, 1, lastLine);
//     setLines(lines.concat());
//   };

//   const handleMouseUp = () => {
//     isDrawing.current = false;
//   };


//   const handleLineClick = (indexToRemove) => {
//     // Filter out the line based on indexToRemove
//     const updatedLines = lines.filter((line, index) => index !== indexToRemove);
//     setLines(updatedLines);
//   };

//   useEffect(() => {
//     console.log(lines)
//   }, [lines])

//   return (
//     <div>
//       <Stage
//         width={window.innerWidth}
//         height={window.innerHeight}
//         onMouseDown={handleMouseDown}
//         onMousemove={handleMouseMove}
//         onMouseup={handleMouseUp}
//       >
//         <Layer>
//           <Text text="Just start drawing" x={5} y={30} />
//           {lines.map((line, i) => (
//             <Line
//               key={i}
//               points={line.points}
//               stroke="#df4b26"
//               strokeWidth={5}
//               tension={0.5}
//               lineCap="round"
//               onClick={() => handleLineClick(i)}
//               // globalCompositeOperation={
//               //   line.tool === "eraser" ? "destination-out" : "source-over"
            
//             />
//           ))}
//         </Layer>
//       </Stage>
//       <select
//         value={tool}
//         onChange={(e) => {
//           setTool(e.target.value);
//         }}
//       >
//         <option value="pen">Pen</option>
//         <option value="eraser">Eraser</option>
//       </select>
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useState, useRef } from "react";
// import { Stage, Layer, Line, Text, Image as KonvaImage, Group } from "react-konva";

// function App() {
//   const [tool, setTool] = useState("pen");
//   const [lines, setLines] = useState([]);
//   const isDrawing = useRef(false);
//   const [image, setImage] = useState(null);

//   useEffect(() => {
//     const img = new window.Image();
//     img.src = "./dataset.png"; // 確認你的圖片路徑是正確的
//     img.onload = () => {
//       setImage(img);
//     };
//   }, []);

//   const handleMouseDown = (e) => {
//     isDrawing.current = true;
//     const pos = e.target.getStage().getPointerPosition();
//     setLines([...lines, { tool, points: [pos.x, pos.y] }]);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing.current) {
//       return;
//     }
//     const stage = e.target.getStage();
//     const point = stage.getPointerPosition();
//     let lastLine = lines[lines.length - 1];
//     lastLine.points = lastLine.points.concat([point.x, point.y]);

//     lines.splice(lines.length - 1, 1, lastLine);
//     setLines(lines.concat());
//   };

//   const handleMouseUp = () => {
//     isDrawing.current = false;
//   };

//   useEffect(() => {
//     console.log(lines);
//   }, [lines]);

//   return (
//     <div>
//       <Stage
//         width={window.innerWidth}
//         height={window.innerHeight}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//       >
//         <Layer>
//           {image && <KonvaImage image={image} x={0} y={0} />}
//         </Layer>
//         <Layer>
//           <Text text="Just start drawing" x={5} y={30} />
//           {lines.map((line, i) => (
//             <Group key={i}>
//               {line.tool === "pen" && (
//                 <Line
//                   points={line.points}
//                   stroke="#df4b26"
//                   strokeWidth={20}
//                   tension={0.5}
//                   lineCap="round"
//                 />
//               )}
//               {line.tool === "eraser" && (
//                 <Line
//                   points={line.points}
//                   stroke="white"
//                   strokeWidth={10}
//                   tension={0.5}
//                   lineCap="round"
//                   globalCompositeOperation="destination-out"
//                 />
//               )}
//             </Group>
//           ))}
//         </Layer>
//       </Stage>
//       <select
//         value={tool}
//         onChange={(e) => {
//           setTool(e.target.value);
//         }}
//       >
//         <option value="pen">Pen</option>
//         <option value="eraser">Eraser</option>
//       </select>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Line, Text, Image as KonvaImage, Group } from "react-konva";

function App() {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = "./dataset.png"; // 確認你的圖片路徑是正確的
    img.onload = () => {
      setImage(img);
    };
  }, []);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    console.log(lines);
  }, [lines]);

  // 將 lines 分成兩部分，一部分是第 3 到第 8 個 line，另一部分是其餘的 line
  const groupedLines = lines.slice(2, 8);
  // 9 11
  const secondGroupedLines = lines.slice(8, 11);
  const otherLines = lines.filter((_, index) => index < 2 || index >= 11);

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {image && <KonvaImage image={image} x={0} y={0} />}
        </Layer>
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {otherLines.map((line, i) => (
            <Group key={i}>
              {line.tool === "pen" && (
                <Line
                  points={line.points}
                  stroke="#df4b26"
                  strokeWidth={20}
                  tension={0.5}
                  lineCap="round"
                />
              )}
              {line.tool === "eraser" && (
                <Line
                  points={line.points}
                  stroke="white"
                  strokeWidth={10}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="destination-out"
                />
              )}
            </Group>
          ))}
        </Layer>
        <Layer>
          {/* <Group>
          {otherLines.map((line, i) => (
            <Group key={i}>
              {line.tool === "pen" && (
                <Line
                  points={line.points}
                  stroke="#df4b26"
                  strokeWidth={20}
                  tension={0.5}
                  lineCap="round"
                />
              )}
              {line.tool === "eraser" && (
                <Line
                  points={line.points}
                  stroke="white"
                  strokeWidth={10}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="destination-out"
                />
              )}
            </Group>
          ))}
          </Group> */}
          <Group draggable>
            {secondGroupedLines.map((line, i) => (
              <Group key={i}>
                {line.tool === "pen" && (
                  <Line
                    points={line.points}
                    stroke="#df4b26"
                    strokeWidth={20}
                    tension={0.5}
                    lineCap="round"
                  />
                )}
                {line.tool === "eraser" && (
                  <Line
                    points={line.points}
                    stroke="white"
                    strokeWidth={10}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation="destination-out"
                  />
                )}
              </Group>
            ))}
          </Group>
          </Layer>
          <Layer>
          <Group draggable>
            {groupedLines.map((line, i) => (
              <Group key={i}>
                {line.tool === "pen" && (
                  <Line
                    points={line.points}
                    stroke="#df4b26"
                    strokeWidth={20}
                    tension={0.5}
                    lineCap="round"
                  />
                )}
                {line.tool === "eraser" && (
                  <Line
                    points={line.points}
                    stroke="white"
                    strokeWidth={10}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation="destination-out"
                  />
                )}
              </Group>
            ))}
          </Group>
          {/* <Group draggable>
            {secondGroupedLines.map((line, i) => (
              <Group key={i}>
                {line.tool === "pen" && (
                  <Line
                    points={line.points}
                    stroke="#df4b26"
                    strokeWidth={20}
                    tension={0.5}
                    lineCap="round"
                  />
                )}
                {line.tool === "eraser" && (
                  <Line
                    points={line.points}
                    stroke="white"
                    strokeWidth={10}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation="destination-out"
                  />
                )}
              </Group>
            ))}
          </Group> */}
        </Layer>
      </Stage>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
    </div>
  );
}

export default App;
