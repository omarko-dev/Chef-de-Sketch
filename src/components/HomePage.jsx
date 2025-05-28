import React, { useState } from "react";
import LevelsModal from "./LevelsModal";
import { questThemes } from "./QuestThemes";

function HomePage({ onStartGame }) {
  const [showLevels, setShowLevels] = useState(false);

  const handlePlayClick = () => setShowLevels(true);
  const handleSelectTheme = (theme) => {
    onStartGame(theme);
    setShowLevels(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        fontFamily: "'Fredoka', sans-serif",
        padding: "0 20px",
      }}
    >
      <img
        src="/images/my_logo.png"
        alt="Chef de Sketch Logo"
        style={{
          width: "450px",
          maxWidth: "90%",
          height: "auto",
          marginBottom: "30px",
        }}
      />

      <button
        onClick={handlePlayClick}
        style={{
          padding: "16px 32px",
          fontSize: "1.4rem",
          backgroundColor: "#FF7F50",
          border: "none",
          color: "#fff",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
        }}
      >
        Play
      </button>

      {showLevels && (
        <LevelsModal
          onClose={() => setShowLevels(false)}
          themes={questThemes}
          onSelectTheme={handleSelectTheme}
        />
      )}
    </div>
  );
}

export default HomePage;