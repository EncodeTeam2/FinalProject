import React from "react";
import "./App.css";
import { Gameboard } from "./components/Gameboard/Gameboard";
import { Nav } from "./components/Navbar/Navbar";
import { Game } from "./components/Game/game";
import ContractCard from "./components/ContractCard/ContractCard";

declare let window: any;

function App() {

  // Contract Address
  const CONTRACT_ADDRESS: string = "0xD48493103049326ddF73fC704939eb05Ae899e0b";

  
  return (
    <div className="App">
      <Nav contractAddress={CONTRACT_ADDRESS}/>
      <Gameboard />
      <Game />
      <ContractCard />
    </div>
  );
}

export default App;
