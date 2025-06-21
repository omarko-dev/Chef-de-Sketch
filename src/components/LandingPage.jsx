import React, { useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { questThemes } from "./QuestThemes";
import { useNavigate } from "react-router-dom";

function LandingPage({ activeTheme, onLevelComplete }) {
  const navigate = useNavigate();
  const [showEndScreen, setShowEndScreen] = useState(false);
  // States
  const [pageBgColor, setPageBgColor] = useState("#ffffff");
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [directionsLink, setDirectionsLink] = useState("");
  const [orderLink, setOrderLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const [showLogoBoard, setShowLogoBoard] = useState(false);
  const logoCanvasRef = useRef(null);
  const [logoIsDrawing, setLogoIsDrawing] = useState(false);
  const [logoColor, setLogoColor] = useState("#000");
  const [showLogoColorPicker, setShowLogoColorPicker] = useState(false);
  const [logoLineWidth, setLogoLineWidth] = useState(5);
  const [logoData, setLogoData] = useState(null);

  const [showDishBoard, setShowDishBoard] = useState(false);
  const dishCanvasRef = useRef(null);
  const [dishIsDrawing, setDishIsDrawing] = useState(false);
  const [dishColor, setDishColor] = useState("#000");
  const [showDishColorPicker, setShowDishColorPicker] = useState(false);
  const [dishLineWidth, setDishLineWidth] = useState(5);
  const [dishData, setDishData] = useState(null);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [showDishDetails, setShowDishDetails] = useState(false);

  // Which category we’re adding the dish to
  const [activeCatIndex, setActiveCatIndex] = useState(null);

  // Default tasks (adapt to your logic)
  const [tasks, setTasks] = useState([
    { id: 101, text: 'Create a category named "Pizzas"', isComplete: false },
    { id: 102, text: "Add a dish priced at $12 or more", isComplete: false },
    { id: 103, text: "Draw a pizza-themed logo", isComplete: false },
    { id: 104, text: "Use the color picker to change the background", isComplete: false },
    { id: 105, text: "Set the restaurant status to Open", isComplete: true },
  ]);

  // Active quest theme
  const defaultTheme = questThemes[0];
  const usedTheme = activeTheme || defaultTheme;
  const [themeTasks, setThemeTasks] = useState(usedTheme.tasks || []);

  // New state for the current tool
  const [tool, setTool] = useState("brush");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // For showing a preview circle as cursor
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // 1) Add state for brush color:
  const [brushColor, setBrushColor] = useState("#222");

  // -----------------------------------
  // Mark a local task complete by ID:
  // (You can also update themeTasks similarly if needed)
  // -----------------------------------
  const completeTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isComplete: true } : t))
    );
  };

  useEffect(() => {
    console.log("LandingPage mounted");
  }, []);

  useEffect(() => {
    if (!logoData) {
      setShowLogoBoard(true);
    }
  }, [logoData]);

  // Canvas Resize
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Logo Canvas Handlers
  const handleLogoMouseDown = (e) => {
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLogoIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleLogoMouseMove = (e) => {
    if (!logoIsDrawing || (tool !== "brush" && tool !== "eraser")) return;
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = logoLineWidth;
    ctx.lineCap = "round";
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleLogoMouseUp = () => {
    setLogoIsDrawing(false);
    const canvas = logoCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
  };

  const saveLogo = () => {
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL("image/png");
    setLogoData(data);
    setShowLogoBoard(false);

    completeTask(103);
  };

  // Dish Canvas Handlers
  const handleDishMouseDown = () => {
    setDishIsDrawing(true);
    const canvas = dishCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
  };

  const handleDishMouseMove = (e) => {
    if (!dishIsDrawing) return;
    const canvas = dishCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = dishLineWidth;
    ctx.lineCap = "round";
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDishMouseUp = () => {
    setDishIsDrawing(false);
    const canvas = dishCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
  };

  const saveDish = () => {
    const canvas = dishCanvasRef.current;
    if (!canvas) return;

    const data = canvas.toDataURL("image/png");
    setDishData(data);
    setShowDishBoard(false);
    setShowDishDetails(true);
  };

  const handleDishDetailsDone = () => {
    if (activeCatIndex !== null) {
      const newCategories = [...categories];
      const cat = { ...newCategories[activeCatIndex] };
      const catDishes = cat.dishes ? [...cat.dishes] : [];

      const newDish = {
        image: dishData,
        name: dishName,
        price: dishPrice,
      };
      catDishes.push(newDish);
      cat.dishes = catDishes;
      newCategories[activeCatIndex] = cat;
      setCategories(newCategories);

      const priceNum = Number(dishPrice);
      if (priceNum >= 12) {
        completeTask(102);
      }
    }
    setShowDishDetails(false);
    setDishData(null);
    setDishName("");
    setDishPrice("");
  };

  // Category Handling
  const handleSaveCategory = () => {
    if (categoryName.trim() !== "") {
      setCategories([...categories, { name: categoryName, dishes: [] }]);
      setCategoryName("");
      setShowCategoryInput(false);

      if (categoryName.toLowerCase().includes("pizza")) {
        completeTask(101); // “Create a category named ‘Pizzas’”
      }
    }
  };

  const removeDish = (catIndex, dishIndex) => {
    const updated = [...categories];
    updated[catIndex].dishes.splice(dishIndex, 1);
    setCategories(updated);
  };

  // Actions
  const handleCall = () => {
    if (phoneNumber.trim()) {
      window.open(`tel:${phoneNumber}`);
    }
  };

  const handleDirections = () => {
    if (directionsLink.trim()) {
      window.open(directionsLink, "_blank");
    }
  };

  const handleOrderOnline = () => {
    if (orderLink.trim()) {
      window.open(orderLink, "_blank");
    }
  };

  // Track hovered dish for remove button
  const [hoveredDish, setHoveredDish] = useState({
    catIndex: null,
    dishIndex: null,
  });

  // Handle “Add Dish” per category
  const handleAddDishClick = (catIndex) => {
    setActiveCatIndex(catIndex);
    setShowDishBoard(true);
  };

  useEffect(() => {
    if (pageBgColor !== "#ffffff") {
      completeTask(104);
    }
  }, [pageBgColor]);

  useEffect(() => {
    if (isOpen) {
      completeTask(105);
    }
  }, [isOpen]);

  // Quests
  const [showQuestMenu, setShowQuestMenu] = useState(false);
  const tasksRemaining = tasks.filter((t) => !t.isComplete).length;

  useEffect(() => {
    if (tasksRemaining === 0) {
      setShowEndScreen(true);
      if (onLevelComplete) onLevelComplete(activeTheme);
    }
  }, [tasksRemaining, activeTheme, onLevelComplete]);

  // Global Mouse Move Handler
  function handleMouseMoveGlobal(e) {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMoveGlobal);
    return () => window.removeEventListener("mousemove", handleMouseMoveGlobal);
  }, []);

  // Render
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        textAlign: "center",
        backgroundColor: pageBgColor,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Restaurant Info Side Menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: showSideMenu ? "0px" : "-400px",
          width: "280px",
          height: "100vh",
          backgroundColor: "#f8f8f8",
          transition: "left 0.3s",
          zIndex: 9998,
          padding: "20px",
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => setShowSideMenu(false)}
          style={{
            backgroundColor: "#F57C00",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1.4rem",
            fontWeight: "bold",
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          X
        </button>

        <h3 style={{ marginTop: "50px", padding: 0 }}>Restaurant Panel</h3>
        <hr />

        <div style={{ marginBottom: "10px" }}>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              width: "90%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Directions Link:</label>
          <input
            type="text"
            value={directionsLink}
            onChange={(e) => setDirectionsLink(e.target.value)}
            style={{
              width: "90%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Order Link:</label>
          <input
            type="text"
            value={orderLink}
            onChange={(e) => setOrderLink(e.target.value)}
            style={{
              width: "90%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            style={{
              backgroundColor: "#9acd32",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Toggle {isOpen ? "Open" : "Closed"}
          </button>
          <span
            style={{
              marginLeft: "8px",
              color: isOpen ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <button
            style={{
              backgroundColor: "#32cd32",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            onClick={() => setShowCategoryInput(true)}
          >
            + Add Category
          </button>
        </div>
      </div>

      {!showSideMenu && (
        <button
          onClick={() => setShowSideMenu(true)}
          style={{
            backgroundColor: "#F57C00",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 9999,
          }}
        >
          Restaurant Info
        </button>
      )}

      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        <span
          style={{
            color: isOpen ? "green" : "red",
            fontSize: "1.2rem",
          }}
        >
          ●
        </span>
        <span
          style={{
            color: isOpen ? "green" : "red",
            fontSize: "1.2rem",
            marginLeft: "4px",
          }}
        >
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

      {/* BG Color Picker Button */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setShowBgColorPicker((prev) => !prev)}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            backgroundColor: "#F57C00",
            color: "#fff",
            cursor: "pointer",
            border: "none",
            marginBottom: "10px",
          }}
        >
          Pick BG Color
        </button>
        {showBgColorPicker && (
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: "20px",
              zIndex: 99999,
              background: "#fff",
              border: "1px solid #ccc",
            }}
          >
            <SketchPicker
              color={pageBgColor}
              onChangeComplete={(c) => setPageBgColor(c.hex)}
            />
          </div>
        )}
      </div>

      {/* Logo Display */}
      {logoData && (
        <div style={{ padding: 0 }}>
          <img
            src={logoData}
            alt="Saved Logo"
            style={{
              display: "block",
              margin: "20px auto",
              maxWidth: "600px",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button onClick={handleCall}>
              {phoneNumber.trim() ? `Call: ${phoneNumber}` : "Call"}
            </button>
            <button onClick={handleDirections}>Directions</button>
            <button onClick={handleOrderOnline}>Order Online</button>
          </div>
        </div>
      )}

      {/* Category Buttons */}
      {categories.length > 0 && (
        <div
          style={{
            width: "90%",
            margin: "20px auto 0",
            height: "40px",
            borderRadius: "20px",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() =>
                document.getElementById(`category-${index}`)?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "20px",
                backgroundColor: "transparent",
                fontSize: "1.2rem",
                cursor: "pointer",
                color:
                  pageBgColor.toLowerCase() === "#ffffff"
                    ? "#000"
                    : pageBgColor,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Category Sections */}
      {categories.map((cat, i) => (
        <div key={i} id={`category-${i}`} style={{ marginTop: "30px" }}>
          <h3 style={{ fontSize: "2rem", margin: 0, padding: 0 }}>{cat.name}</h3>
          {cat.dishes && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {cat.dishes.map((dish, di) => (
                <div
                  key={di}
                  style={{
                    width: "250px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                  onMouseEnter={() =>
                    setHoveredDish({ catIndex: i, dishIndex: di })
                  }
                  onMouseLeave={() =>
                    setHoveredDish({ catIndex: null, dishIndex: null })
                  }
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <p
                    style={{
                      margin: "8px 0",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                    }}
                  >
                    {dish.name}
                  </p>
                  <p style={{ fontSize: "1.2rem", margin: 0 }}>${dish.price}</p>
                  {hoveredDish.catIndex === i &&
                    hoveredDish.dishIndex === di && (
                      <button
                        onClick={() => removeDish(i, di)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          backgroundColor: "#add8e6",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          color: "#fff",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        x
                      </button>
                    )}
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              marginTop: "20px",
              width: "250px",
              height: "180px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              margin: "20px auto",
            }}
            onClick={() => handleAddDishClick(i)}
          >
            + Add Dish
          </div>
        </div>
      ))}

      {/* Add Category Animation */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <div style={{ position: "relative", width: "400px", margin: "0 auto" }}>
          <button
            onClick={() => setShowCategoryInput((prev) => !prev)}
            style={{
              position: "absolute",
              left: showCategoryInput
                ? "calc(50% + 215px)"
                : "calc(50% - 0px)",
              transform: "translateX(-50%)",
              transition: "left 0.5s",
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#F57C00",
              color: "#fff",
              fontSize: "1.2rem",
              cursor: "pointer",
              border: "none",
              whiteSpace: "nowrap",
            }}
          >
            Add Category
          </button>

          {showCategoryInput && (
            <div
              style={{
                position: "absolute",
                left: "0px",
                transition: "opacity 0.5s",
                opacity: showCategoryInput ? 1 : 0,
                display: "flex",
                gap: "6px",
                alignItems: "center",
                top: "0px",
              }}
            >
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Category Name..."
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1.2rem",
                }}
              />
              <button
                onClick={handleSaveCategory}
                style={{
                  backgroundColor: "#FF9800",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  border: "none",
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logo Drawing Overlay */}
      {showLogoBoard && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: 0,
            backgroundColor: "#f0f8ff",
            zIndex: 9999,
          }}
        >
          <h1
            style={{
              position: "absolute",
              top: "0px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#333",
              margin: 0,
              padding: 0,
              zIndex: 2,
            }}
          >
            Draw Your Logo
          </h1>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              backgroundColor: "#e1eaf2",
              padding: "10px",
              borderRadius: "0 8px 8px 0",
              zIndex: 99999,
            }}
          >
            <select
              style={{
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
              value={logoLineWidth}
              onChange={(e) => setLogoLineWidth(Number(e.target.value))}
            >
              <option value={2}>2px (Thin)</option>
              <option value={5}>5px (Medium)</option>
              <option value={8}>8px (Thick)</option>
              <option value={12}>12px (Extra)</option>
            </select>

            {/* Removed the old toggle button; use the tool state instead */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setTool("brush")}
                style={{
                  backgroundColor: tool === "brush" ? "#87cefa" : "#ccc",
                  border: "none",
                  padding: "6px 12px",
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
                }}
              >
                Eraser
              </button>
            </div>

            {/* 2) In the toolbar, add a color chooser: */}
            <label style={{ display: "block", margin: "10px 0" }}>
              Brush Color:
              <input
                type="color"
                value={brushColor}             // changed
                onChange={(e) => setBrushColor(e.target.value)}  // changed
                style={{ marginLeft: "10px" }}
              />
            </label>

            {showLogoColorPicker && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  left: "10px",
                  zIndex: 999999,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <SketchPicker
                  color={logoColor}
                  onChangeComplete={(c) => setLogoColor(c.hex)}
                />
              </div>
            )}

            <button
              onClick={saveLogo}
              style={{
                backgroundColor: "#32cd32",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>

            <button
              onClick={() => setShowLogoBoard(false)}
              style={{
                backgroundColor: "#ccc",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          <canvas
            ref={logoCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleLogoMouseDown}
            onMouseMove={handleLogoMouseMove}
            onMouseUp={handleLogoMouseUp}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              cursor: "none", // hides default cursor
              zIndex: 1,
              margin: 0,
              padding: 0,
            }}
          />
          {/* Cursor Preview for Logo */}
          <div
            style={{
              position: "fixed",
              pointerEvents: "none",
              left: cursorPos.x,
              top: cursorPos.y,
              width: logoLineWidth * 2,
              height: logoLineWidth * 2,
              borderRadius: "50%",
              border: "2px solid #000",
              backgroundColor:
                tool === "eraser"
                  ? "rgba(255,255,255,0.6)"
                  : logoColor + "44", // partial alpha
              transform: "translate(-50%, -50%)",
              zIndex: 999999,
            }}
          />
        </div>
      )}

      {/* Dish Drawing Overlay */}
      {showDishBoard && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: 0,
            backgroundColor: "#faf0e6",
            zIndex: 9999,
          }}
        >
          <h1
            style={{
              position: "absolute",
              top: "0px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#333",
              margin: 0,
              padding: 0,
              zIndex: 2,
            }}
          >
            Draw Your Dish
          </h1>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              backgroundColor: "#f3eada",
              padding: "10px",
              borderRadius: "0 8px 8px 0",
              zIndex: 99999,
            }}
          >
            <select
              value={dishLineWidth}
              onChange={(e) => setDishLineWidth(Number(e.target.value))}
            >
              <option value={2}>Thin</option>
              <option value={5}>Medium</option>
              <option value={8}>Thick</option>
              <option value={12}>Extra</option>
            </select>

            {/* Removed the toggle button; rely on tool state */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setTool("brush")}
                style={{
                  backgroundColor: tool === "brush" ? "#87cefa" : "#ccc",
                  border: "none",
                  padding: "6px 12px",
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
                }}
              >
                Eraser
              </button>
            </div>

            {/* 3) Use brushColor while drawing: */}
            <label style={{ display: "block", margin: "10px 0" }}>
              Brush Color:
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>

            {showDishColorPicker && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  left: "10px",
                  backgroundColor: "#fff",
                  border: "1px solid #333",
                  zIndex: 999999,
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <SketchPicker
                  color={dishColor}
                  onChangeComplete={(c) => setDishColor(c.hex)}
                />
              </div>
            )}

            <button
              onClick={saveDish}
              style={{
                backgroundColor: "#32cd32",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>

            <button
              onClick={() => setShowDishBoard(false)}
              style={{
                backgroundColor: "#ccc",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          <canvas
            ref={dishCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleDishMouseDown}
            onMouseMove={handleDishMouseMove}
            onMouseUp={handleDishMouseUp}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              cursor: "none",
              zIndex: 1,
              margin: 0,
              padding: 0,
            }}
          />
          {/* Cursor Preview for Dish */}
          <div
            style={{
              position: "fixed",
              pointerEvents: "none",
              left: cursorPos.x,
              top: cursorPos.y,
              width: tool === "eraser" ? dishLineWidth * 4 : dishLineWidth * 2,
              height: tool === "eraser" ? dishLineWidth * 4 : dishLineWidth * 2,
              borderRadius: "50%",
              border: "2px solid #000",
              backgroundColor:
                tool === "eraser"
                  ? "rgba(255,255,255,0.6)"
                  : dishColor + "55",
              transform: "translate(-50%, -50%)",
              zIndex: 100000,
            }}
          />
        </div>
      )}

      {/* Dish Details Overlay */}
      {showDishDetails && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h2 style={{ margin: 0, padding: "10px 0" }}>Dish Details</h2>
            <img
              src={dishData}
              alt="Dish"
              style={{ maxWidth: "250px", marginBottom: "10px" }}
            />
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="Dish Name"
                style={{ padding: "8px", marginRight: "5px" }}
              />
              <input
                type="number"
                value={dishPrice}
                onChange={(e) => setDishPrice(e.target.value)}
                placeholder="Price"
                style={{ padding: "8px" }}
              />
            </div>
            <button
              onClick={handleDishDetailsDone}
              style={{
                backgroundColor: "#32cd32",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Quests */}
      <button
        onClick={() => setShowQuestMenu(!showQuestMenu)}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          backgroundColor: "#ff8c00",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Quests
        {tasksRemaining > 0 && (
          <span
            style={{
              marginLeft: "8px",
              backgroundColor: "red",
              borderRadius: "50%",
              color: "#fff",
              padding: "2px 6px",
              fontSize: "0.9rem",
            }}
          >
            {tasksRemaining}
          </span>
        )}
      </button>

      {showQuestMenu && (
        <div
          style={{
            position: "fixed",
            top: "50px",
            right: "10px",
            width: "240px",
            backgroundColor: "#fff",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            zIndex: 9999,
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: 0 }}>{usedTheme.name}</h3>
          <hr />
          {tasks.map((task) => (
            <div key={task.id} style={{ marginBottom: "8px" }}>
              <span style={{ marginRight: "8px" }}>
                {task.isComplete ? "✔️" : "⬜️"}
              </span>
              {task.text}
            </div>
          ))}

          {tasksRemaining === 0 && (
            <button
              style={{
                marginTop: "10px",
                backgroundColor: "#d97536",
                border: "none",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              onClick={() => alert("Level Completed!")}
            >
              End Level
            </button>
          )}
        </div>
      )}

      {/* End Screen */}
      {showEndScreen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.6s linear",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              animation: "scaleUp 0.5s ease-out",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "2.2rem" }}>Congratulations!</h2>
            <p style={{ fontSize: "1.2rem", margin: "10px 0 20px" }}>
              You’ve completed all tasks!
            </p>
            {/* 3-Star Rating - optional simple animations */}
            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  style={{
                    fontSize: "3rem",
                    color: "#FFD700",
                    animation: `popStar 0.4s ease forwards ${star * 0.2}s`,
                  }}
                >
                  ★
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                // close the end screen and give a notification
                setShowEndScreen(false);
                alert("Returning to main menu...");
                navigate("/"); // Go back to HomePage
              }}
              style={{
                marginTop: "20px",
                backgroundColor: "#d97536",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;