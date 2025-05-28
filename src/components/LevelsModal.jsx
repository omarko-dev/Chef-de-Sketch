import React from "react";

function LevelsModal({ onClose, themes, onSelectTheme }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "600px",
          backgroundColor: "#fcfcfc",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          overflow: "hidden",
          animation: "fadein 0.5s",
        }}
      >
        {/* Mac-like top bar with three dots */}
        <div
          style={{
            backgroundColor: "#fcfcfc",
            height: "30px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px",
            gap: "8px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#d97536",
              cursor: "pointer",
            }}
            onClick={onClose}
          ></div>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#e9812c",
            }}
          ></div>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#000",
            }}
          ></div>
        </div>

        {/* Pop-up content in a grid layout */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2 style={{ margin: "10px 0" }}>Select Your Level</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              margin: "20px auto",
            }}
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme)}
                style={{
                  padding: "40px 0",
                  fontSize: "1.1rem",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#e9812c",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelsModal;