import React from 'react';
import './App.css';
import { Gameboard } from './components/Gameboard/Gameboard';
import { Nav } from './components/Navbar/Navbar';
import { Game } from './components/Game/game';

function App() {
  return (
    <div className="App">
      <Nav />
      <Gameboard />
      <Game />
    </div>
  );
}

export default App;
