import React, { useRef, useState, useEffect } from "react";
import * as fabric from "fabric";
import "./App.css"; // Ensure this file exists

const KitchenSink = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [properties, setProperties] = useState({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    fill: "black",
    stroke: "black",
    strokeWidth: 1,
    path: "",
  });

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current);
    setCanvas(fabricCanvas);

    fabricCanvas.setWidth(800);
    fabricCanvas.setHeight(400);

    const handleSelection = (e) => {
      updatePropertiesPanel(e);
    };

    fabricCanvas.on("object:selected", handleSelection);
    fabricCanvas.on("selection:created", handleSelection);
    fabricCanvas.on("selection:updated", handleSelection);
    fabricCanvas.on("selection:cleared", () => setSelectedObject(null));

    return () => {
      fabricCanvas.off("object:selected", handleSelection);
      fabricCanvas.off("selection:created", handleSelection);
      fabricCanvas.off("selection:updated", handleSelection);
      fabricCanvas.dispose();
    };
  }, []);

  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        width: 200,
        height: 80,
        fill: "blue",
      });
      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        left: 200,
        top: 100,
        radius: 40,
        fill: "green",
      });
      canvas.add(circle);
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new fabric.IText("Edit me!", {
        left: 50,
        top: 200,
        fontSize: 30,
        fill: "black",
      });
      canvas.add(text);
    }
  };

  const addImage = () => {
    if (canvas) {
      const imageInstance = new Image();
      imageInstance.src = "/assets/me.jpg";
      imageInstance.onload = () => {
        const img = new fabric.Image(imageInstance, {
          left: 10,
          top: 10,
          width: 50,
          height: 50,
        });
        canvas.add(img);
      };
    }
  };

  const addPath = () => {
    if (canvas) {
      const path = new fabric.Path("M10 10 L50 50 L90 10", {
        left: 350,
        top: 50,
        stroke: "red",
        strokeWidth: 2,
      });
      canvas.add(path);
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
    }
  };

  const updatePropertiesPanel = (e) => {
    const obj = e.target || e.selected[0];
    if (obj) {
      setSelectedObject(obj);

      const newProperties = {
        left: obj.left || 0,
        top: obj.top || 0,
        width: obj.width || 100,
        height: obj.height || 100,
        fill: obj.fill || "black",
        stroke: obj.stroke || "black",
        strokeWidth: obj.strokeWidth || 1,
        path: obj.path || "",
      };

      if (obj.type === "circle") {
        newProperties.radius = obj.radius || 0;
      }

      setProperties(newProperties);
    } else {
      setSelectedObject(null);
      setProperties({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        fill: "black",
        stroke: "black",
        strokeWidth: 1,
        path: "",
      });
    }
  };

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    if (selectedObject) {
      let newValue = value;
      if (["width", "height", "left", "top", "strokeWidth"].includes(name)) {
        newValue = parseFloat(value) || 0;
      }
      selectedObject.set(name, newValue);

      if (name === "radius") {
        selectedObject.set({ radius: newValue });
      }

      if (name === "fill" || name === "stroke") {
        selectedObject.set(name, newValue);
      }

      canvas.renderAll();
      setProperties((prevProps) => ({
        ...prevProps,
        [name]: newValue,
      }));
    }
  };

  return (
    <div className="relative p-2 ml-4">
      <div className="relative flex">
        <canvas
          ref={canvasRef}
          className="border"
          style={{ border: "1px solid black" }}
        />
        <div className="absolute top-0 right-20 p-7 bg-white border shadow-md"
             style={{ width: '250px', zIndex: 10 }}>
          <h3>Object Properties</h3>
          {selectedObject && (
            <div>
              <label>
                Left:
                <input
                  type="number"
                  name="left"
                  value={properties.left}
                  onChange={handlePropertyChange}
                />
              </label>
              <br />
              <label>
                Top:
                <input
                  type="number"
                  name="top"
                  value={properties.top}
                  onChange={handlePropertyChange}
                />
              </label>
              <br />
              <label>
                Width:
                <input
                  type="number"
                  name="width"
                  value={properties.width}
                  onChange={handlePropertyChange}
                />
              </label>
              <br />
              <label>
                Height:
                <input
                  type="number"
                  name="height"
                  value={properties.height}
                  onChange={handlePropertyChange}
                />
              </label>
              <br />
              <label>
                Fill Color:
                <input
                  type="color"
                  name="fill"
                  value={properties.fill}
                  onChange={handlePropertyChange}
                />
              </label>
              <br />
              <label>
                Stroke Color:
                <input
                  type="color"
                  name="stroke"
                  value={properties.stroke}
                  onChange={handlePropertyChange}
                />
              </label>
              <br />
              <label>
                Stroke Width:
                <input
                  type="number"
                  name="strokeWidth"
                  value={properties.strokeWidth}
                  onChange={handlePropertyChange}
                />
              </label>
              <br />
              {selectedObject.type === "path" && (
                <>
                  <label>
                    Path:
                    <textarea
                      name="path"
                      value={properties.path}
                      onChange={handlePropertyChange}
                    />
                  </label>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className=" mt-4  space-x-8 ml-7">
        <button
          onClick={addRectangle}
          className="bg-gray-200 hover:bg-gray-500 text-black-600 font-semibold hover:text-white py-2 px-2 border border-gray-700 hover:border-transparent rounded text-xs transition duration-300 ease-in-out"
        >
          Add Rectangle
        </button>
        <button
          onClick={addCircle}
          className="bg-gray-200 hover:bg-gray-500 text-black-600 font-semibold hover:text-white py-2 px-2 border border-gray-700 hover:border-transparent rounded text-xs transition duration-300 ease-in-out"
        >
          Add Circle
        </button>
        <button
          onClick={addText}
          className="bg-gray-200 hover:bg-gray-500 text-black-600 font-semibold hover:text-white py-2 px-2 border border-gray-700 hover:border-transparent rounded text-xs transition duration-300 ease-in-out"
        >
          Add Text
        </button>
        <button
          onClick={addImage}
          className="bg-gray-200 hover:bg-gray-500 text-black-600 font-semibold hover:text-white py-2 px-2 border border-gray-700 hover:border-transparent rounded text-xs transition duration-300 ease-in-out"
        >
          Add Image
        </button>
        <button
          onClick={addPath}
          className="bg-gray-200 hover:bg-gray-500 text-black-600 font-semibold hover:text-white py-2 px-2 border border-gray-700 hover:border-transparent rounded text-xs transition duration-300 ease-in-out"
        >
          Add Path
        </button>
        <button
          onClick={clearCanvas}
          className="bg-gray-200 hover:bg-gray-500 text-black-600 font-semibold hover:text-white py-2 px-2 border border-gray-700 hover:border-transparent rounded text-xs transition duration-300 ease-in-out"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default KitchenSink;
