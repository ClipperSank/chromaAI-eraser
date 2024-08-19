import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Group, Image as KonvaImage } from "react-konva";
import Konva from "konva";

const KonvaShapeSwapper = () => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [eraserLayers, setEraserLayers] = useState([]);
  const isDrawing = useRef(false);
  const [image, setImage] = useState(null);

  const isMouseDownRef = useRef(false)
  const isShapeDraggingRef = useRef(false)

  useEffect(() => {
    const img = new window.Image();
    img.src = "./dataset.png"; // 確認你的圖片路徑是正確的
    img.onload = () => {
      setImage(img);
    };
  }, []);

  const shapeLayersRef = useRef({
    shape1: null,
    shape2: null,
    shape3: null,
  });

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || isShapeDraggingRef.current) return

    const position = stage?.getRelativePointerPosition()

    if (!position) return
    
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

  const handleShapeClick = (e) => {
    setSelectedShapeId(e.target.id());
  };

  useEffect(() => {
    if (eraserLayers.length > 0) {
      const latestLayer = eraserLayers[eraserLayers.length - 1];
      const newLayerRef = latestLayer.ref.current;
      if (newLayerRef) {
        console.log("New Layer BUILT", newLayerRef);

        // Move selected shape to new eraser layer
        if (selectedShapeId) {
          console.log("Something selected");
          const layerRefs = Object.values(shapeLayersRef.current);
          console.log("layerRefs", layerRefs);
          let shape = null;
          for (const layerRef of layerRefs) {
            shape = layerRef?.findOne(`#${selectedShapeId}`);
            if (shape) break;
          }
          console.log("shape", shape);

          if (shape) {
            const newLayer = newLayerRef;
            console.log("newLayer in shape", newLayer);
            if (!newLayer) {
              console.error("New eraser layer reference is null.");
              return;
            }
            console.log("newLayer", newLayer);
            const absPos = shape.getAbsolutePosition();

            // Find or create a group in the new eraser layer
            let group = newLayer.findOne("Group");
            if (!group) {
              group = new Konva.Group({ draggable: true });
              newLayer.add(group);
            }

            // Move existing lines to the new group
            lines.forEach((line) => {
              const lineShape = new Konva.Line({
                points: line.points,
                tension: 0.5,
                lineCap: "round",
                ...getLineAttributes(line.tool),
              });
              lineShape.moveTo(group);
            });

            // Move the shape to the new layer and group
            shape.moveTo(newLayer);
            shape.position({
              x: absPos.x - newLayer.getClientRect().x,
              y: absPos.y - newLayer.getClientRect().y,
            });
            shape.moveTo(group);

            // Redraw layers
            newLayer.draw();
            shape.getLayer().draw();
          }
        }
        setSelectedShapeId(null); // Clear selected shape id after moving
      }
    }
  }, [eraserLayers, selectedShapeId]);

  const handleAddNewEraserLayer = () => {
    const newLayerId = `eraserLayer${eraserLayers.length + 1}`;
    const newLayerRef = React.createRef();

    // Create new eraser layer and add to state
    setEraserLayers((prevEraserLayers) => [
      ...prevEraserLayers,
      {
        id: newLayerId,
        ref: newLayerRef,
      },
    ]);
  };

  const getLineAttributes = (tool) => {
    if (tool === "pen") {
      return {
        stroke: "#df4b26",
        strokeWidth: 20,
        globalCompositeOperation: "source-over",
      };
    } else if (tool === "eraser") {
      return {
        stroke: "white",
        strokeWidth: 10,
        globalCompositeOperation: "destination-out",
      };
    }
    return {};
  };

  return (
    <div>
      <div id="buttons">
        <button onClick={handleAddNewEraserLayer}>
          Add New Eraser Layer with Selected Shape
        </button>
      </div>
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
        {/* Render eraser layers */}
        {eraserLayers.map((layer) => (
          <Layer key={layer.id} ref={layer.ref}>
            <Group id={`group_${layer.id}`} draggable>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  tension={0.5}
                  lineCap="round"
                  {...getLineAttributes("eraser")}
                />
              ))}
            </Group>
          </Layer>
        ))}
        <Layer
          ref={(node) => {
            shapeLayersRef.current.shape1 = node;
          }}
        >
          <Group id="yellowGroup" draggable>
            <Circle
              id="yellowCircle"
              x={100}
              y={100}
              radius={50}
              fill="yellow"
              onClick={handleShapeClick}
            />
          </Group>
        </Layer>
        <Layer
          ref={(node) => {
            shapeLayersRef.current.shape2 = node;
          }}
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
        <Layer
          ref={(node) => {
            shapeLayersRef.current.shape3 = node;
          }}
        >
          <Group id="blueGroup" draggable>
            <Circle
              id="blueCircle"
              x={300}
              y={100}
              radius={50}
              fill="blue"
              onClick={handleShapeClick}
            />
          </Group>
        </Layer>
        <Layer>
          <Group id="shape1Group" draggable>
            <Rect
              id="shape1"
              x={150}
              y={150}
              width={100}
              height={50}
              fill="red"
              onClick={handleShapeClick}
            />
          </Group>
        </Layer>
        <Layer>
          <Group id="shape2Group" draggable>
            <Line
              id="shape2"
              points={[150, 150, 250, 150, 250, 200, 150, 200]}
              stroke="green"
              strokeWidth={10}
              closed
              onClick={handleShapeClick}
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
