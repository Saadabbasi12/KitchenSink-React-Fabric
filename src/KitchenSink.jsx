import React, { useRef, useState, useEffect } from "react";
import * as fabric from "fabric";
import Popup from "./PopUp";

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
    radius: 0,
    path: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current);
    setCanvas(fabricCanvas);

    fabricCanvas.setDimensions({ width: 800, height: 400 });

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

  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * (canvas.width - 100));
    const y = Math.floor(Math.random() * (canvas.height - 100));
    return { left: x, top: y };
  };

  const addRectangle = () => {
    if (canvas) {
      const { left, top } = getRandomPosition();
      const rect = new fabric.Rect({
        left,
        top,
        width: 200,
        height: 80,
        fill: "orange",
      });
      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const { left, top } = getRandomPosition();
      const circle = new fabric.Circle({
        left,
        top,
        radius: 40,
        fill: "black",
      });
      canvas.add(circle);
    }
  };

  const addText = () => {
    if (canvas) {
      const { left, top } = getRandomPosition();
      const text = new fabric.IText("Edit me!", {
        left,
        top,
        fontSize: 30,
        fill: "black",
      });
      canvas.add(text);
    }
  };

  const addImage = () => {
    if (canvas) {
      const { left, top } = getRandomPosition();
      const imageInstance = new Image();
      imageInstance.src = "/assets/earth1.png";
      imageInstance.onload = () => {
        const img = new fabric.Image(imageInstance, {
          left,
          top,
          width: 100,
          height: 100,
        });
        canvas.add(img);
      };
    }
  };

  const addPath = () => {
    if (canvas) {
      const { left, top } = getRandomPosition();
      const path = new fabric.Path(
        "M24 2C10.745 2 0 12.745 0 26s10.745 24 24 24c2.205 0 4.332-.274 6.386-.766L24 36.273 16.876 25.892 21 24l4-4-5.915-5.914L24 2zM36 22c0 3.31-1.273 6.313-3.384 8.711L24 16l-4 4-5.915 5.914L24 36.273l6.626-4.502C31.417 30.054 34 27.088 34 22c0-6.627-5.373-12-12-12-3.348 0-6.68 1.308-9.114 3.52C13.277 15.188 16.77 19.168 20 22l-4 4-5.915 5.914L24 36.273l6.626-4.502C31.417 30.054 34 27.088 34 22c0-6.627-5.373-12-12-12-3.348 0-6.68 1.308-9.114 3.52C13.277 15.188 16.77 19.168 20 22l-4 4-5.915 5.914L24 36.273l6.626-4.502C31.417 30.054 34 27.088 34 22z",
        {
          left,
          top,
          stroke: "red",
          strokeWidth: 2,
        }
      );
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
        radius: obj.radius || 0,
      };

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
        radius: 0,
      });
    }
  };

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    if (selectedObject) {
      if (
        selectedObject.type === "image" &&
        (name === "fill" || name === "stroke")
      ) {
        setShowPopup(true);
        return;
      }

      let newValue = value;
      if (
        ["width", "height", "left", "top", "strokeWidth", "radius"].includes(
          name
        )
      ) {
        newValue = parseFloat(value) || 0;
      }
      selectedObject.set(name, newValue);
      selectedObject.setCoords();

      if (name === "radius") {
        selectedObject.set({ radius: newValue });
        selectedObject.setCoords();
      }

      if (name === "fill" || name === "stroke") {
        selectedObject.set(name, newValue);
        selectedObject.setCoords();
      }

      canvas.renderAll();
      setProperties((prevProps) => ({
        ...prevProps,
        [name]: newValue,
      }));
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="relative p-2 ml-4">
      <div className="relative flex">
        <canvas
          ref={canvasRef}
          className="border"
          style={{ border: "1px solid black" }}
        />
        <div
          className="absolute top-0 right-20 p-3 bg-gradient-to-r from-gray-50 from-10%  to-gray-100 to-40% ... shadow-md bg-opacity-75"
          style={{ width: "300px", zIndex: 10 }}
        >
          <h3 className="text-lg font-semibold mb-2 border-b pb-1 text-red-600">
            Object Properties
          </h3>
          {selectedObject && (
            <div className="divide-y divide-gray-300">
              {[
                "left",
                "top",
                "width",
                "height",
                "fill",
                "stroke",
                "strokeWidth",
                "radius",
              ].map((property) => (
                <div key={property} className="flex items-center py-2">
                  <label className="flex-1 uppercase tracking-wide text-gray-700 text-xs font-bold mr-2">
                    {property.charAt(0).toUpperCase() +
                      property.slice(1).replace(/([A-Z])/g, " $1")}
                    :
                  </label>
                  <input
                    type={
                      property === "fill" || property === "stroke"
                        ? "color"
                        : "number"
                    }
                    name={property}
                    value={properties[property]}
                    onChange={handlePropertyChange}
                    className="input-field border border-gray-300 p-1 rounded w-1/3"
                    style={{ maxWidth: "80px" }}
                    disabled={
                      property === "radius" && selectedObject?.type !== "circle"
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
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
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs transition duration-300 ease-in-out"
        >
          Clear Canvas
        </button>
      </div>
      {showPopup && <Popup onClose={closePopup} message={"Images cannot have color fills"} />}
    </div>
  );
};

export default KitchenSink;
