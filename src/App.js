import React, { useEffect, useState } from "react";
import "./App.css";
import GameStarMatch from "./Components/GameStarMatch";

function App() {
  //star match
  const [gameId, setGameId] = useState(1);

  return (
    <>
      <GameStarMatch key={gameId} startNewGame={() => setGameId(gameId + 1)} />
    </>
  );
}

export default App;
