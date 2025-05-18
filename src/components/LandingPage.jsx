import React, { useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";

const LandingPage = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    setShowLogoBoard(true);
  }, []);

  const [pageBgColor, setPageBgColor] = useState("#ffffff");
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const [showLogoBoard, setShowLogoBoard] = useState(false);
  const logoCanvasRef = useRef(null);
  const [logoIsDrawing, setLogoIsDrawing] = useState(false);
  const [logoIsErasing, setLogoIsErasing] = useState(false);
  const [logoColor, setLogoColor] = useState("#000");
  const [logoLineWidth, setLogoLineWidth] = useState(5);
  const [showLogoColorPicker, setShowLogoColorPicker] = useState(false);
  const [logoData, setLogoData] = useState(null);
  const [lastLogoPos, setLastLogoPos] = useState({ x: 0, y: 0 });

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

  const [categories, setCategories] = useState([]);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;
    setCategories([...categories, { name: categoryName, dishes: [] }]);
    setCategoryName("");
    setShowCategoryInput(false);
  };

  const [showDishBoard, setShowDishBoard] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const dishCanvasRef = useRef(null);
  const [dishIsDrawing, setDishIsDrawing] = useState(false);
  const [dishIsErasing, setDishIsErasing] = useState(false);
  const [dishLineWidth, setDishLineWidth] = useState(5);
  const [dishColor, setDishColor] = useState("#000");
  const [showDishColorPicker, setShowDishColorPicker] = useState(false);
  const [dishData, setDishData] = useState(null);

  const [showDishDetails, setShowDishDetails] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [lastDishPos, setLastDishPos] = useState({ x: 0, y: 0 });

  const handleDishMouseDown = (e) => {
    setDishIsDrawing(true);
    const rect = dishCanvasRef.current.getBoundingClientRect();
    setLastDishPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
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
  const handleDishDetailsDone = () => {
    if (selectedCategoryIndex == null || !dishName.trim() || !dishPrice.trim()) {
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

  const [phoneNumber, setPhoneNumber] = useState("");
  const [directionsLink, setDirectionsLink] = useState("");
  const [orderLink, setOrderLink] = useState("");
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

  const [openingHours, setOpeningHours] = useState("");

  const [hoveredDish, setHoveredDish] = useState({ catIndex: null, dishIndex: null });
  function removeDish(categoryIndex, dishIndex) {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].dishes.splice(dishIndex, 1);
    setCategories(updatedCategories);
  }

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
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <span style={{ color: isOpen ? "green" : "red", fontSize: "1.2rem" }}>
          ●
        </span>
        <span style={{ color: isOpen ? "green" : "red", fontSize: "1.2rem", marginLeft: "4px" }}>
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

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
        {/* Side Menu Close Button */}
        <button
          onClick={() => setShowSideMenu(false)}
          style={{
            backgroundColor: "#add8e6",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1.5rem",
            fontWeight: "bold",
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            textAlign: "center",
          }}
        >
          X
        </button>

        <h3 style={{ marginTop: "50px", padding: 0 }}>Restaurant Panel</h3>
        <hr />

        <input
          type="text"
          placeholder="Enter Restaurant Name"
          style={{
            width: "80%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            margin: "10px 0",
          }}
        />

        <div onClick={() => setIsOpen(!isOpen)} style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
          <span style={{ color: isOpen ? "green" : "red", fontSize: "1.2rem" }}>●</span>
          <span style={{ color: isOpen ? "green" : "red", fontSize: "1.2rem" }}>
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        <label style={{ display: "block", margin: "6px 0 4px" }}>Opening Hours:</label>
        <input
          type="text"
          placeholder="e.g. 8:00 AM - 10:00 PM"
          value={openingHours}
          onChange={(e) => setOpeningHours(e.target.value)}
          style={{
            width: "80%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />

        <label style={{ display: "block", margin: "6px 0 4px" }}>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{
            width: "80%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
          placeholder="e.g. +123456789"
        />

        <label style={{ display: "block", margin: "6px 0 4px" }}>Directions Link:</label>
        <input
          type="text"
          value={directionsLink}
          onChange={(e) => setDirectionsLink(e.target.value)}
          style={{
            width: "80%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
          placeholder="Google Maps URL"
        />

        <label style={{ display: "block", margin: "6px 0 4px" }}>Order Link:</label>
        <input
          type="text"
          value={orderLink}
          onChange={(e) => setOrderLink(e.target.value)}
          style={{
            width: "80%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
          placeholder="Online ordering URL"
        />

        <button
          onClick={() => setShowLogoBoard(true)}
          style={{
            backgroundColor: "#87cefa",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Draw Logo
        </button>
      </div>

      {/* Add Restaurant Info Button */}
      {!showSideMenu && (
        <button
          onClick={() => setShowSideMenu(true)}
          style={{
            backgroundColor: "#add8e6",
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
          Add Restaurant Info
        </button>
      )}

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setShowBgColorPicker(!showBgColorPicker)}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            backgroundColor: "#87cefa",
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
            <SketchPicker color={pageBgColor} onChangeComplete={(c) => setPageBgColor(c.hex)} />
          </div>
        )}
      </div>

      {logoData && (
        <div style={{ marginTop: "0", padding: 0 }}>
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
                color: pageBgColor.toLowerCase() === "#ffffff" ? "#000" : pageBgColor,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

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
a
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

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <div style={{ position: "relative", width: "400px", margin: "0 auto" }}>
          <button
            onClick={() => setShowCategoryInput(!showCategoryInput)}
            style={{
              position: "absolute",
              left: showCategoryInput ? "calc(50% + 215px)" : "calc(50% - 0px)",
              transform: "translateX(-50%)",
              transition: "left 0.5s",
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#87cefa",
              color: "#fff",
              fontSize: "1.2rem",
              cursor: "pointer",
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
                  backgroundColor: "#32cd32",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

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
                <SketchPicker color={logoColor} onChangeComplete={(c) => setLogoColor(c.hex)} />
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
                <SketchPicker color={dishColor} onChangeComplete={(c) => setDishColor(c.hex)} />
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
    </div>
  );
};

export default LandingPage;