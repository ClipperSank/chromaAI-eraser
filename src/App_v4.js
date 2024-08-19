import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Group } from "react-konva";

const KonvaShapeSwapperV3 = () => {
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [eraserLayers, setEraserLayers] = useState([]);
  const shapeLayerRef = useRef(null);
  const isDrawing = useRef(false);

  const handleShapeClick = (e) => {
    setSelectedShapeId(e.target.id());
  };

  const handleAddNewEraserLayer = () => {
    if (selectedShapeId) {
      const shape = shapeLayerRef.current.findOne(`#${selectedShapeId}`);
      if (shape) {
        const newLayerRef = React.createRef();
        // Create a new eraser layer entry
        setEraserLayers((prevLayers) => [
          ...prevLayers,
          { id: `eraserLayer${prevLayers.length + 1}`, ref: newLayerRef, shape },
        ]);
        // Move the shape to the new layer
        shape.moveTo(newLayerRef.current);
        shapeLayerRef.current.batchDraw();
      }
    }
    setSelectedShapeId(null);
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setEraserLayers((prevLayers) => {
      const updatedLayers = prevLayers.map((layer) => {
        if (layer.id === selectedShapeId) {
          return {
            ...layer,
            lines: [...(layer.lines || []), { points: [pos.x, pos.y] }],
          };
        }
        return layer;
      });
      return updatedLayers;
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setEraserLayers((prevLayers) => {
      const updatedLayers = prevLayers.map((layer) => {
        if (layer.id === selectedShapeId) {
          const lines = layer.lines;
          const lastLine = lines[lines.length - 1];
          lastLine.points = lastLine.points.concat([point.x, point.y]);
          return { ...layer, lines };
        }
        return layer;
      });
      return updatedLayers;
    });
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
        {eraserLayers.map((layer, index) => (
          <Layer key={index} ref={layer.ref}>
            <Group>
              {layer.shape.clone()}
              {layer.lines?.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="white"
                  strokeWidth={10}
                  lineCap="round"
                  globalCompositeOperation="destination-out"
                />
              ))}
            </Group>
          </Layer>
        ))}
      </Stage>
    </div>
  );
};

export default KonvaShapeSwapperV3;
