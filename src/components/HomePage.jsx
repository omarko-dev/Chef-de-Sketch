import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import LevelsModal from "./LevelsModal";
import { questThemes } from "./QuestThemes";

function HomePage({ onStartGame }) {
  const [showLevels, setShowLevels] = useState(false);
  const [showCanvasOverlay, setShowCanvasOverlay] = useState(false);
  const [characterURL, setCharacterURL] = useState(null);

  // Fullscreen canvas sizing
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    function handleResize() {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [tool, setTool] = useState("brush"); // or "eraser"
  const [brushColor, setBrushColor] = useState("#222");
  const [brushSize, setBrushSize] = useState(4);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updatePos = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updatePos);
    return () => window.removeEventListener("mousemove", updatePos);
  }, []);

  // Canvas drawing
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      return this;
    };
  }

  useEffect(() => {
    if (!showCanvasOverlay) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    //Head
    ctx.beginPath();
    ctx.arc(centerX, centerY - 100, 120, 0, 2 * Math.PI);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.roundRect(centerX - 60, centerY + 20, 120, 140, 30);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.roundRect(centerX - 90, centerY + 40, 30, 80, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(centerX + 60, centerY + 40, 30, 80, 10);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.roundRect(centerX - 40, centerY + 160, 20, 60, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(centerX + 20, centerY + 160, 20, 60, 10);
    ctx.stroke();
  }, [showCanvasOverlay]);

  // Mouse events
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
    }
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.closePath();
      ctx.globalCompositeOperation = "source-over";
    }
  };

  // Save finalll
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCharacterURL(canvas.toDataURL("image/png"));
    setShowCanvasOverlay(false);
  };
  const handlePlayClick = () => setShowLevels(true);
  const handleSelectTheme = (theme) => {
    onStartGame(theme);
    setShowLevels(false);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        fontFamily: "'Fredoka', sans-serif",
        background: "url('/images/background.jpg') center/cover no-repeat",
        position: "relative",
      }}
    >
      {/* Logo */}
      <img
        src="/images/my_logo.png"
        alt="Chef de Sketch Logo"
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: "300px",
          height: "auto",
        }}
      />

      {/* Main Buttons */}
      <div
        style={{
          position: "absolute",
          top: "200px",
          left: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <button
          onClick={handlePlayClick}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#fff",
            cursor: "pointer",
            textShadow: "1px 1px 2px #333",
          }}
        >
          Play
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            outline: "none",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#fff",
            cursor: "pointer",
            textShadow: "1px 1px 2px #333",
          }}
        >
          Settings
        </button>
      </div>

      {/* Create Character Button */}
      {!characterURL && (
        <button
          onClick={() => setShowCanvasOverlay(true)}
          style={{
            position: "absolute",
            top: "400px",
            right: "80px",
            background: "none",
            border: "3px solid #fff",
            borderRadius: "10px",
            fontSize: "1.5rem",
            color: "#fff",
            cursor: "pointer",
            padding: "10px 20px",
            textShadow: "1px 1px 2px #333",
          }}
        >
          Create Your Character
        </button>
      )}

      {/* Saved Character */}
      {characterURL && (
        <img
          src={characterURL}
          alt="User Character"
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-600px",
            height: "1000px",
            objectFit: "contain",
          }}
        />
      )}

      {/* Levels Modal */}
      {showLevels && (
        <LevelsModal
          onClose={() => setShowLevels(false)}
          themes={questThemes}
          onSelectTheme={handleSelectTheme}
        />
      )}

      {/* Canvas Overlay */}
      {showCanvasOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fafafa",
            zIndex: 9999,
            margin: 0,
            padding: 0,
            overflow: "hidden", // ensures that you can't scroll
          }}
        >
          {/* Place the canvas behind the toolbar andd text}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                cursor: "none",
                display: "block",
              }}
            />
          </div>

          {/* Title above canvas */}
          <h2
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              color: "#333",
              margin: 0,
              padding: "10px 0",
              zIndex: 2,
            }}
          >
            Draw Your Character
          </h2>

          {/* Toolbar on the left side, also above the canvas */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "10px",
              backgroundColor: "#e0e0e0",
              borderRadius: "0 8px 8px 0",
              zIndex: 2,
            }}
          >
            <button
              onClick={() => setTool("brush")}
              style={{
                backgroundColor: tool === "brush" ? "#87cefa" : "#ccc",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Brush
            </button>
            <button
              onClick={() => setTool("eraser")}
              style={{
                backgroundColor: tool === "eraser" ? "#ff6347" : "#ccc",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Eraser
            </button>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #999",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Color
            </button>
            {showColorPicker && (
              <div
                style={{
                  position: "absolute",
                  left: "120px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  padding: "10px",
                  zIndex: 999999,
                }}
              >
                <SketchPicker
                  color={brushColor}
                  onChangeComplete={(col) => setBrushColor(col.hex)}
                />
              </div>
            )}
            <label>
              Brush Size
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
              />
            </label>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#32cd32",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setShowCanvasOverlay(false)}
              style={{
                backgroundColor: "#ccc",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Cancel
            </button>
          </div>

          {/* Custom circular cursor above everything, but pointerEvents: none */}
          <div
            style={{
              position: "fixed",
              pointerEvents: "none",
              left: cursorPos.x,
              top: cursorPos.y,
              width: tool === "eraser" ? brushSize * 4 : brushSize * 2,
              height: tool === "eraser" ? brushSize * 4 : brushSize * 2,
              borderRadius: "50%",
              border: "2px solid #000",
              backgroundColor:
                tool === "eraser"
                  ? "rgba(255,255,255,0.5)"
                  : brushColor + "40",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default HomePage;