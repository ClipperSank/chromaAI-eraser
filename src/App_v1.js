import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Group } from "react-konva";
import Konva from "konva";

const KonvaShapeSwapper = () => {
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

  const yellowLayerRef = useRef(null);
  const blueLayerRef = useRef(null);
  const eraserLayerRef = useRef(null);
  const shapeLayersRef = {
    shape1: useRef(null),
    shape2: useRef(null),
    shape3: useRef(null),
  };

  const initializeLayer = (layerRef) => {
    const layer = layerRef.current;
    if (!layer) return;

    // Create a new group if it doesn't exist
    if (!layer.findOne("Group")) {
      const group = new Konva.Group({ draggable: true });
      layer.add(group);
      layer.draw();
    }
  };

  const swapShapeToLayer = (shapeId, newLayerRef) => {
    // console.log("blueLayerRef", blueLayerRef)
    const layerRefs = Object.values(shapeLayersRef);
    // console.log("layerRefs", layerRefs)
    let shape = null;

    // Find the shape in the current layers
    for (const layerRef of layerRefs) {
      // console.log("layerRef",  layerRef)
      // console.log("layerRef.current",  layerRef.current)
      // console.log("shapeId", shapeId)
      shape = layerRef.current.findOne(`#${shapeId}`);
      // console.log("Shape", shape)
      if (shape) break;
    }

    if (shape) {
      const absPos = shape.getAbsolutePosition();
      const newLayer = newLayerRef.current;
      // console.log("newLayer_first", newLayer)

      // Find or create a group in the new layer
      let group = newLayer.findOne("Group");
      // console.log("Group", group)
      if (!group) {
        group = new Konva.Group({ draggable: true });
        newLayer.add(group);
      }

      // Move the shape to the new layer and adjust position
      shape.moveTo(newLayer);
      // console.log("newLayer", newLayer)
      shape.position({
        x: absPos.x - newLayer.getClientRect().x,
        y: absPos.y - newLayer.getClientRect().y,
      });
      shape.moveTo(group);

      // Redraw layers
      newLayer.draw();
      console.log("NEWLayer", newLayer)
      shape.getLayer().draw();
    }
  };
  

  const getLineAttributes = (tool) => {
    if (tool === "pen") {
      return {
        stroke: "#df4b26",
        strokeWidth: 20,
        globalCompositeOperation: "source-over", // 確保正常繪製模式
      };
    } else if (tool === "eraser") {
      return {
        stroke: "white",
        strokeWidth: 10,
        globalCompositeOperation: "destination-out", // 擦除模式
      };
    }
    return {};
  };

  return (
    <div>
      <div id="buttons">
        <button onClick={() => swapShapeToLayer("shape1", blueLayerRef)}>
          Move Shape1 to Blue Layer
        </button>
        <button onClick={() => swapShapeToLayer("shape1", yellowLayerRef)}>
          Move Shape1 to Yellow Layer
        </button>
        <button onClick={() => swapShapeToLayer("shape2", yellowLayerRef)}>
          Move shape2 to Yellow Layer
        </button>
        <button onClick={() => swapShapeToLayer("shape2", eraserLayerRef)}>
          Move shape2 to Eraser Layer
        </button>
        <button onClick={() => swapShapeToLayer("shape1", eraserLayerRef)}>
          Move shape1 to Eraser Layer
        </button>
        <button onClick={() => swapShapeToLayer("shape3", eraserLayerRef)}>
          Move shape3 to Eraser Layer
        </button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer
          ref={yellowLayerRef}
          onLoad={() => initializeLayer(yellowLayerRef)}
        >
          <Group id="yellowGroup" draggable>
            <Circle id="yellowCircle" x={100} y={100} radius={50} fill="yellow" />
          </Group>
        </Layer>
        <Layer
          ref={eraserLayerRef}
          onLoad={() => initializeLayer(eraserLayerRef)}
        >
          <Group draggable>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                tension={0.5}
                lineCap="round"
                {...getLineAttributes(line.tool)}
              />
            ))}
          </Group>
        </Layer>
        <Layer ref={blueLayerRef} onLoad={() => initializeLayer(blueLayerRef)}>
          <Group id="blueGroup" draggable>
            <Circle x={300} y={100} radius={50} fill="blue" />
          </Group>
        </Layer>
        <Layer
          ref={shapeLayersRef.shape1}
          onLoad={() => initializeLayer(shapeLayersRef.shape1)}
        >
          <Group id="shape1Group" draggable>
            <Rect
              id="shape1"
              x={150}
              y={150}
              width={100}
              height={50}
              fill="red"
              // globalCompositeOperation={"destination-out"}
            />
          </Group>
        </Layer>
        <Layer
          ref={shapeLayersRef.shape3}
          onLoad={() => initializeLayer(shapeLayersRef.shape3)}
        >
          <Group id="shape3Group" draggable>
            <Rect
              id="shape3"
              x={30}
              y={10}
              width={100}
              height={50}
              fill="blue"
              // globalCompositeOperation={"destination-out"}
            />
          </Group>
        </Layer>
        <Layer
          ref={shapeLayersRef.shape2}
          onLoad={() => initializeLayer(shapeLayersRef.shape2)}
        >
          <Group id="shape2Group" draggable>
            <Line
              id="shape2"
              points={[150, 150, 250, 150, 250, 200, 150, 200]}
              stroke="green"
              strokeWidth={10}
              closed
            />
          </Group>
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
};

export default KonvaShapeSwapper;
