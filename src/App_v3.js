import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Group,
  Image as KonvaImage,
} from "react-konva";

const KonvaShapeSwapperV2 = () => {
  //   const [selectedShapeId, setSelectedShapeId] = useState(null);
  //   const [eraserLayers, setEraserLayers] = useState([]);
  //   const [lines, setLines] = useState([]);
  //   const [image, setImage] = useState(null);
  //   const shapeLayerRef = useRef(null);
  //   const isDrawing = useRef(false);

  //   useEffect(() => {
  //     const img = new window.Image();
  //     img.src = "./dataset.png"; // 確認你的圖片路徑是正確的
  //     img.onload = () => {
  //       setImage(img);
  //     };
  //   }, []);

  //   useEffect(() => {
  //     console.log("EraserLayer", eraserLayers);
  //   }, [eraserLayers]);
  // //   useEffect(() => {
  // //     console.log("shapeLayer", shapeLayerRef.current);
  // //   }, [shapeLayerRef]);

  //   const handleShapeClick = (e) => {
  //     console.log("id", e.target.id());
  //     setSelectedShapeId(e.target.id());
  //   };

  //   const handleAddNewEraserLayer = () => {
  //     if (selectedShapeId) {
  //       const shape = shapeLayerRef.current.findOne(`#${selectedShapeId}`);
  //       console.log("shape", shape)
  //       if (shape) {
  //         const absPos = shape.getAbsolutePosition();
  //         const newLayerRef = React.createRef();

  //         // Create a new eraser layer and add it to the state
  //         setEraserLayers((prevLayers) => [
  //           ...prevLayers,
  //           { id: `eraserLayer${prevLayers.length + 1}`, ref: newLayerRef },
  //         ]);

  //         // Move shape to the newly created eraser layer
  //         // const newLayer = newLayerRef.current;
  //         // shape.moveTo(newLayer);
  //         // shape.position({
  //         //   x: absPos.x - newLayer.x(),
  //         //   y: absPos.y - newLayer.y(),
  //         // });

  //         // newLayer.batchDraw();
  //         // shapeLayerRef.current.batchDraw();
  //         // Ensure the new layer is ready before moving the shape
  //         setTimeout(() => {
  //           const newLayer = newLayerRef.current;
  //           console.log("newLayer", newLayer);
  //           if (newLayer) {
  //             console.log("enter");
  //             // Move shape to the newly created eraser layer
  //             shape.moveTo(newLayer);
  //             shape.position({
  //               x: absPos.x - newLayer.x(),
  //               y: absPos.y - newLayer.y(),
  //             });

  //             newLayer.batchDraw();
  //             shapeLayerRef.current.batchDraw();
  //           } else {
  //             console.error("New layer reference is null.");
  //           }
  //         }, 0);
  //       }
  //     }
  //     setSelectedShapeId(null);
  //   };

  //   const handleMouseDown = (e) => {
  //     isDrawing.current = true;
  //     const pos = e.target.getStage().getPointerPosition();
  //     setLines([{ points: [pos.x, pos.y] }]);
  //   };

  //   const handleMouseMove = (e) => {
  //     if (!isDrawing.current) return;

  //     const stage = e.target.getStage();
  //     const point = stage.getPointerPosition();
  //     const lastLine = lines[lines.length - 1];
  //     lastLine.points = lastLine.points.concat([point.x, point.y]);

  //     // Update the last line
  //     setLines([...lines.slice(0, -1), lastLine]);
  //   };

  //   const handleMouseUp = () => {
  //     isDrawing.current = false;
  //   };

  //   return (
  //     <div>
  //       <button onClick={handleAddNewEraserLayer}>
  //         Add New Eraser Layer with Selected Shape
  //       </button>
  //       <Stage
  //         width={window.innerWidth}
  //         height={window.innerHeight}
  //         onMouseDown={handleMouseDown}
  //         onMouseMove={handleMouseMove}
  //         onMouseUp={handleMouseUp}
  //       >
  //         <Layer>{image && <KonvaImage image={image} x={0} y={0} />}</Layer>
  //         <Layer ref={shapeLayerRef}>
  //           <Group>
  //             <Circle
  //               id="circle1"
  //               x={100}
  //               y={100}
  //               radius={50}
  //               fill="yellow"
  //               onClick={handleShapeClick}
  //             />
  //             {/* <Rect
  //               id="rect1"
  //               x={200}
  //               y={100}
  //               width={100}
  //               height={50}
  //               fill="red"
  //               onClick={handleShapeClick}
  //             /> */}
  //           </Group>
  //         </Layer>
  //         {eraserLayers.map((layer) => (
  //           <Layer key={layer.id} ref={layer.ref}>
  //             {lines.map((line, i) => (
  //               <Line
  //                 key={i}
  //                 points={line.points}
  //                 stroke="white"
  //                 strokeWidth={10}
  //                 lineCap="round"
  //                 // globalCompositeOperation="destination-out"
  //               />
  //             ))}
  //           </Layer>
  //         ))}
  //       </Stage>
  //     </div>
  //   );
  // };
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [lines, setLines] = useState([]);
  const eraserLayerRef = useRef(null);
  const shapeLayerRef = useRef(null);
  const isDrawing = useRef(false);

  const handleShapeClick = (e) => {
    console.log(e.target.id())
    setSelectedShapeId(e.target.id());
  };

  const handleAddNewEraserLayer = () => {
    if (selectedShapeId) {
      const shape = shapeLayerRef.current.findOne(`#${selectedShapeId}`);
      if (shape) {
        const absPos = shape.getAbsolutePosition();
        shape.moveTo(eraserLayerRef.current);
        shape.position({
          x: absPos.x - eraserLayerRef.current.x(),
          y: absPos.y - eraserLayerRef.current.y(),
        });
        shapeLayerRef.current.batchDraw();
        eraserLayerRef.current.batchDraw();
      }
    }
    setSelectedShapeId(null);
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // Update the last line
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div>
      <button onClick={handleAddNewEraserLayer}>
        Add New Eraser Layer with Selected Shape
      </button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer ref={shapeLayerRef}>
          <Group>
            <Circle
              id="circle1"
              x={100}
              y={100}
              radius={50}
              fill="yellow"
              onClick={handleShapeClick}
            />
            <Rect
              id="rect1"
              x={200}
              y={100}
              width={100}
              height={50}
              fill="red"
              onClick={handleShapeClick}
            />
          </Group>
        </Layer>
        <Layer ref={eraserLayerRef}>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="white"
              strokeWidth={10}
              lineCap="round"
              globalCompositeOperation="destination-out"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};
export default KonvaShapeSwapperV2;
