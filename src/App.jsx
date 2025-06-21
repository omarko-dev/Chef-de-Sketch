import React, { useState } from "react";
import HomePage from "./components/HomePage.jsx";
import LandingPage from "./components/LandingPage.jsx";

function App() {
  const [activeTheme, setActiveTheme] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (theme) => {
    setActiveTheme(theme);
    setGameStarted(true);
  };

  return (
    <>
      {!gameStarted ? (
        <HomePage onStartGame={handleStartGame} />
      ) : (
        <LandingPage activeTheme={activeTheme} />
      )}
    </>
  );
}

export default App;