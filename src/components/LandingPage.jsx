import React, { useEffect, useState, useRef } from "react";
import { SketchPicker } from "react-color";
import { questThemes } from "./QuestThemes";

function LandingPage({ activeTheme }) {
  // Example: set up for open/closed state, page background color, etc.
  const [isOpen, setIsOpen] = useState(true);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [pageBgColor, setPageBgColor] = useState("#ffffff");
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  // Logo-drawing board
  const [showLogoBoard, setShowLogoBoard] = useState(false);
  const logoCanvasRef = useRef(null);
  const [logoIsDrawing, setLogoIsDrawing] = useState(false);
  const [logoIsErasing, setLogoIsErasing] = useState(false);
  const [logoLineWidth, setLogoLineWidth] = useState(5);
  const [logoColor, setLogoColor] = useState("#000");
  const [showLogoColorPicker, setShowLogoColorPicker] = useState(false);
  const [logoData, setLogoData] = useState(null);
  const [lastLogoPos, setLastLogoPos] = useState({ x: 0, y: 0 });

  // Dynamic sizing for canvases
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Draw the logo on mousedown/mousemove/mouseup
  const handleLogoMouseDown = (e) => {
    setLogoIsDrawing(true);
    const rect = logoCanvasRef.current.getBoundingClientRect();
    setLastLogoPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleLogoMouseMove = (e) => {
    if (!logoIsDrawing) return;
    const ctx = logoCanvasRef.current.getContext("2d");
    const rect = logoCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastLogoPos.x, lastLogoPos.y);
    ctx.lineTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = logoIsErasing ? 20 : logoLineWidth;
    ctx.strokeStyle = logoIsErasing ? "#fff" : logoColor;
    ctx.globalCompositeOperation = logoIsErasing ? "destination-out" : "source-over";
    ctx.stroke();
    setLastLogoPos({ x, y });
  };
  const handleLogoMouseUp = () => {
    setLogoIsDrawing(false);
  };
  const saveLogo = () => {
    if (logoCanvasRef.current) {
      setLogoData(logoCanvasRef.current.toDataURL("image/png"));
    }
    setShowLogoBoard(false);
  };

  // Basic restaurant info
  const [phoneNumber, setPhoneNumber] = useState("");
  const [directionsLink, setDirectionsLink] = useState("");
  const [orderLink, setOrderLink] = useState("");
  const [openingHours, setOpeningHours] = useState("");

  const handleCall = () => {
    if (phoneNumber.trim()) {
      window.location.href = `tel:${phoneNumber.trim()}`;
    }
  };
  const handleDirections = () => {
    if (directionsLink.trim()) {
      window.open(directionsLink.trim(), "_blank");
    }
  };
  const handleOrderOnline = () => {
    if (orderLink.trim()) {
      window.open(orderLink.trim(), "_blank");
    }
  };

  // Categories (and their dishes)
  const [categories, setCategories] = useState([]);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;
    setCategories([...categories, { name: categoryName, dishes: [] }]);
    setCategoryName("");
    setShowCategoryInput(false);
  };

  // Dish-drawing board
  const [showDishBoard, setShowDishBoard] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const dishCanvasRef = useRef(null);
  const [dishIsDrawing, setDishIsDrawing] = useState(false);
  const [dishIsErasing, setDishIsErasing] = useState(false);
  const [dishLineWidth, setDishLineWidth] = useState(5);
  const [dishColor, setDishColor] = useState("#000");
  const [showDishColorPicker, setShowDishColorPicker] = useState(false);
  const [dishData, setDishData] = useState(null);

  const handleDishMouseDown = (e) => {
    setDishIsDrawing(true);
    const rect = dishCanvasRef.current.getBoundingClientRect();
    setLastDishPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const [lastDishPos, setLastDishPos] = useState({ x: 0, y: 0 });
  const handleDishMouseMove = (e) => {
    if (!dishIsDrawing) return;
    const ctx = dishCanvasRef.current.getContext("2d");
    const rect = dishCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastDishPos.x, lastDishPos.y);
    ctx.lineTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = dishIsErasing ? 20 : dishLineWidth;
    ctx.strokeStyle = dishIsErasing ? "#fff" : dishColor;
    ctx.globalCompositeOperation = dishIsErasing ? "destination-out" : "source-over";
    ctx.stroke();
    setLastDishPos({ x, y });
  };
  const handleDishMouseUp = () => {
    setDishIsDrawing(false);
  };
  const saveDish = () => {
    if (dishCanvasRef.current) {
      setDishData(dishCanvasRef.current.toDataURL("image/png"));
    }
    setShowDishBoard(false);
    setShowDishDetails(true);
  };

  // Dish details form (name + price)
  const [showDishDetails, setShowDishDetails] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");

  const handleDishDetailsDone = () => {
    if (selectedCategoryIndex === null || !dishName.trim() || !dishPrice.trim()) {
      return;
    }
    const updated = [...categories];
    updated[selectedCategoryIndex].dishes.push({
      name: dishName,
      price: dishPrice,
      image: dishData,
    });
    setCategories(updated);
    setShowDishDetails(false);
    setDishName("");
    setDishPrice("");
    setSelectedCategoryIndex(null);
    setDishData(null);
  };

  // For removing dishes on hover
  const [hoveredDish, setHoveredDish] = useState({ catIndex: null, dishIndex: null });
  function removeDish(categoryIndex, dishIndex) {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].dishes.splice(dishIndex, 1);
    setCategories(updatedCategories);
  }

  // Quest tasks from the chosen theme
  const [themeTasks, setThemeTasks] = useState(
    activeTheme ? activeTheme.tasks : questThemes[0].tasks
  );
  // Mark tasks complete if conditions are met
  useEffect(() => {
    if (!activeTheme) return;
    console.log("[DEBUG] themeTasks before checking:", themeTasks);
    setThemeTasks((prevTasks) =>
      prevTasks.map((task) => {
        // For theme 1's Pizza Party, example checks:
        if (task.id === 101 && categories.some(cat => cat.name === "Pizzas")) {
          return { ...task, isComplete: true };
        }
        if (task.id === 102 && categories.some(cat =>
            cat.dishes?.some(dish => parseFloat(dish.price) >= 12)
          )) {
          return { ...task, isComplete: true };
        }
        // ...additional checks...
        return task;
      })
    );
    console.log("[DEBUG] themeTasks after checking:", themeTasks);
  }, [categories, logoData, activeTheme]);

  // Toggling the quest menu
  const [showQuestMenu, setShowQuestMenu] = useState(false);
  const tasksRemaining = themeTasks.filter((t) => !t.isComplete).length;

  // On component mount, show draw logo board initially (optional)
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    setShowLogoBoard(true);
  }, []);

  // Debugging: Log tasks on every render
  useEffect(() => {
    console.log("[DEBUG] Tasks (before):", JSON.stringify(themeTasks, null, 2));
    setThemeTasks((prev) =>
      prev.map((task) => {
        // Pizza Party (IDs 101–105)
        if (task.id === 101 && categories.some((cat) => cat.name.toLowerCase().includes("pizza"))) {
          return { ...task, isComplete: true };
        }
        if (
          task.id === 102 &&
          categories.some((cat) => cat.dishes?.some((dish) => parseFloat(dish.price) >= 12))
        ) {
          return { ...task, isComplete: true };
        }
        if (task.id === 103 && logoData) {
          return { ...task, isComplete: true };
        }
        if (task.id === 104 && pageBgColor.toLowerCase() !== "#ffffff") {
          return { ...task, isComplete: true };
        }
        if (task.id === 105 && isOpen) {
          return { ...task, isComplete: true };
        }

        // Taco Fiesta (IDs 201–205)
        if (task.id === 201 && categories.some((cat) => cat.name.toLowerCase().includes("tacos"))) {
          return { ...task, isComplete: true };
        }
        if (task.id === 202 && logoData) {
          return { ...task, isComplete: true };
        }
        if (task.id === 203 && phoneNumber.trim()) {
          return { ...task, isComplete: true };
        }
        if (task.id === 204 && categories.some((cat) => cat.dishes?.some((dish) => dish.image))) {
          return { ...task, isComplete: true };
        }
        if (
          task.id === 205 &&
          categories.some((cat) =>
            cat.dishes?.some((dish) => dish.name.toLowerCase().includes("spicy fiesta"))
          )
        ) {
          return { ...task, isComplete: true };
        }

        return task;
      })
    );
    console.log("[DEBUG] Tasks (after):", JSON.stringify(themeTasks, null, 2));
  }, [categories, logoData, pageBgColor, isOpen, phoneNumber, themeTasks]);

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
      {/* "Open" / "Closed" indicator */}
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <span style={{ color: isOpen ? "green" : "red", fontSize: "1.2rem" }}>●</span>
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

      {/* Sliding side menu */}
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
        {/* Close Button */}
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

        {/* Phone, directions, order link inputs */}
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

        {/* Toggle Open/Closed button */}
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
          <span style={{ marginLeft: "8px", color: isOpen ? "green" : "red", fontWeight: "bold" }}>
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Category management */}
        <div style={{ marginBottom: "10px" }}>
          <button
            style={{
              backgroundColor: "#32cd32",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "transform 0.2s", // Animation return
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            onClick={() => {
              setCategories([...categories, { name: "New Category" }]);
            }}
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* Toggle button for side menu */}
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

      {/* Pick BG color button */}
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

      {/* Display saved logo (if any) + phone/directions/order */}
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
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={handleCall}>
              {phoneNumber.trim() ? `Call: ${phoneNumber}` : "Call"}
            </button>
            <button onClick={handleDirections}>Directions</button>
            <button onClick={handleOrderOnline}>Order Online</button>
          </div>
        </div>
      )}

      {/* Category navigation */}
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
                document.getElementById(`category-${index}`)?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "20px",
                backgroundColor: "transparent",
                fontSize: "1.2rem",
                cursor: "pointer",
                color:
                  pageBgColor.toLowerCase() === "#ffffff" ? "#000" : pageBgColor,
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
                  onMouseEnter={() => setHoveredDish({ catIndex: i, dishIndex: di })}
                  onMouseLeave={() => setHoveredDish({ catIndex: null, dishIndex: null })}
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
                  <p style={{ margin: "8px 0", fontWeight: "bold", fontSize: "1.3rem" }}>
                    {dish.name}
                  </p>
                  <p style={{ fontSize: "1.2rem", margin: 0 }}>${dish.price}</p>
                  {hoveredDish.catIndex === i && hoveredDish.dishIndex === di && (
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
            onClick={() => {
              setSelectedCategoryIndex(i);
              setShowDishBoard(true);
            }}
          >
            + Add Dish
          </div>
        </div>
      ))}

      {/* Add Category Button */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        {/* Animated "Add Category" Button & Field */}
        <div style={{ position: "relative", width: "400px", margin: "0 auto" }}>
          <button
            onClick={() => setShowCategoryInput((prev) => !prev)}
            style={{
              position: "absolute",
              left: showCategoryInput ? "calc(50% + 215px)" : "calc(50% - 0px)",
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

      {/* Logo drawing board overlay */}
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
              top: 0,
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
              top: "40px",
              left: "20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8px",
              zIndex: 3,
            }}
          >
            <select
              value={logoLineWidth}
              onChange={(e) => setLogoLineWidth(Number(e.target.value))}
              style={{ padding: "6px" }}
            >
              <option value={2}>2 px</option>
              <option value={5}>5 px</option>
              <option value={8}>8 px</option>
              <option value={12}>12 px</option>
            </select>
            <button
              onClick={() => setLogoIsErasing(!logoIsErasing)}
              style={{
                backgroundColor: logoIsErasing ? "#ff6347" : "#87cefa",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              {logoIsErasing ? "Eraser" : "Brush"}
            </button>
            <button
              onClick={() => setShowLogoColorPicker(!showLogoColorPicker)}
              style={{
                backgroundColor: showLogoColorPicker ? "#ff6347" : "#87cefa",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Color
            </button>
            {showLogoColorPicker && (
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #333",
                  zIndex: 99999,
                }}
              >
                <SketchPicker
                  color={logoColor}
                  onChangeComplete={(c) => setLogoColor(c.hex)}
                />
              </div>
            )}
          </div>
          <canvas
            ref={logoCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleLogoMouseDown}
            onMouseMove={handleLogoMouseMove}
            onMouseUp={handleLogoMouseUp}
            style={{
              margin: 0,
              padding: 0,
              border: "none",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              cursor: "crosshair",
              zIndex: 1,
            }}
          />
          <button
            onClick={saveLogo}
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: "#32cd32",
              color: "#fff",
              zIndex: 2,
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Logo
          </button>
        </div>
      )}

      {/* Dish drawing board overlay */}
      {showDishBoard && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#faf0e6",
            zIndex: 9999,
            margin: 0,
            padding: 0,
          }}
        >
          <h1
            style={{
              position: "absolute",
              top: "10px",
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
              cursor: "crosshair",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8px",
              zIndex: 3,
            }}
          >
            <select
              value={dishLineWidth}
              onChange={(e) => setDishLineWidth(Number(e.target.value))}
              style={{ padding: "6px" }}
            >
              <option value={2}>2 px</option>
              <option value={5}>5 px</option>
              <option value={8}>8 px</option>
              <option value={12}>12 px</option>
            </select>
            <button
              onClick={() => setDishIsErasing(false)}
              style={{
                backgroundColor: !dishIsErasing ? dishColor : "#ff6347",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Brush
            </button>
            <button
              onClick={() => setDishIsErasing(true)}
              style={{
                backgroundColor: dishIsErasing ? "#ff6347" : dishColor,
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Eraser
            </button>
            <button
              onClick={() => setShowDishColorPicker(!showDishColorPicker)}
              style={{
                backgroundColor: showDishColorPicker ? "#ff6347" : "#87cefa",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Color
            </button>
            {showDishColorPicker && (
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #333",
                  zIndex: 99999,
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
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Dish details overlay */}
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

      {/* Quests Button */}
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

      {/* Slide-out quest menu */}
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
          }}
        >
          <h3 style={{ margin: 0 }}>
            {activeTheme ? activeTheme.name : questThemes[0].name}
          </h3>
          <hr />
          {themeTasks.map((task) => (
            <div key={task.id} style={{ marginBottom: "8px" }}>
              <span style={{ marginRight: "8px" }}>
                {task.isComplete ? "✔️" : "⬜️"}
              </span>
              {task.text}
            </div>
          ))}

          {/* Show End Level if all tasks done */}
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

      {/* End Level button (always visible if tasksRemaining is 0) */}
      {tasksRemaining === 0 && (
        <button
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px", // was left: "20px"
            backgroundColor: "#d97536",
            border: "none",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            zIndex: 9999,
          }}
          onClick={() => alert("Level Completed!")}
        >
          End Level
        </button>
      )}
    </div>
  );
}

export default LandingPage;