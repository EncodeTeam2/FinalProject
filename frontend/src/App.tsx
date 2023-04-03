import React from "react";
import "./App.css";
import { Gameboard } from "./components/Gameboard/Gameboard";
import { Nav } from "./components/Navbar/Navbar";
import { Game } from "./components/Game/game";
import ContractCard from "./components/ContractCard/ContractCard";

function App() {
  return (
    <div className="App">
      <Nav />
      <Gameboard />
      <Game />
      <ContractCard />
    </div>
  );
}

export default App;
