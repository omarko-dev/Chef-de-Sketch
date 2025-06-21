import React, { useRef, useState, useEffect, useCallback } from "react";
import { SketchPicker } from "react-color";
import "./DrawingCanvas.css";

function MiniCanvas({ onSave }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setLastPos({ x, y });
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataURL = canvasRef.current.toDataURL("image/png");
    onSave(dataURL);
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "10px" }}>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        style={{ border: "1px solid #aaa", background: "#fff" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div style={{ marginTop: "5px" }}>
        <button onClick={handleSave} style={{ marginRight: "5px" }}>
          Save
        </button>
        <button
          onClick={() => {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, 200, 200);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function DrawingCanvas() {
  // Automatically open the mini-canvas for the logo:
  const [showLogoCanvas, setShowLogoCanvas] = useState(true);

  // Shift left more if the side menu is still slightly visible:
  // For example, in your LandingPage side menu style, change to:
  // left: showSideMenu ? "0px" : "-340px";

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ffcc00");
  const [isErasing, setIsErasing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleClickOutside = useCallback((e) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(e.target)
    ) {
      setShowColorPicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);

    if (isErasing) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPos.current = { x, y };
  };

  const handleSaveDrawing = () => {
    const dataURL = canvasRef.current.toDataURL("image/png");
    // If you want to do something else with dataURL, do it here
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const toggleColorPicker = () => {
    setShowColorPicker((prev) => !prev);
  };

  return (
    <div className="drawing-canvas">
      {/* Simple “logo” mini-canvas always visible by default */}
      {showLogoCanvas && (
        <MiniCanvas
          onSave={(savedData) => {
            console.log("Logo saved:", savedData);
            setShowLogoCanvas(false);
          }}
        />
      )}

      {/* “Call / Directions / Order” buttons placed right under mini-canvas */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button>Call</button>
        <button>Directions</button>
        <button>Order Online</button>
      </div>

      {/* The main drawing canvas (if still needed) */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <div className="toolbar">
        <button
          className={`tool-btn ${!isErasing ? "active-tool" : ""}`}
          onClick={() => setIsErasing(false)}
        >
          🖌
        </button>
        <button
          className={`tool-btn ${isErasing ? "active-tool" : ""}`}
          onClick={toggleEraser}
        >
          🧽
        </button>
        <button
          className={`tool-btn ${showColorPicker ? "active-tool" : ""}`}
          onClick={toggleColorPicker}
        >
          🎨
        </button>
        <select
          className="brush-size-dropdown"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        >
          <option value={2}>Thin (2px)</option>
          <option value={5}>Regular (5px)</option>
          <option value={8}>Thick (8px)</option>
          <option value={12}>Extra Thick (12px)</option>
        </select>
        <button onClick={handleSaveDrawing} className="tool-btn">
          💾
        </button>
      </div>
      {showColorPicker && (
        <div className="color-picker-popup" ref={colorPickerRef}>
          <SketchPicker
            color={color}
            onChangeComplete={(newColor) => setColor(newColor.hex)}
          />
        </div>
      )}
    </div>
  );
}

export default DrawingCanvas;