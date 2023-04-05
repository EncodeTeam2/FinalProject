import React, { useState } from "react";
import "./App.css";
import { Gameboard } from "./components/Gameboard/Gameboard";
import { Nav } from "./components/Navbar/Navbar";
import { Game } from "./components/Game/game";
import ContractCard from "./components/ContractCard/ContractCard";
import { ethers } from "ethers";

declare let window: any;

function App() {
  // Contract Address
  const CONTRACT_ADDRESS: string = "0x4BB7050fa47A142e6a90E642D2a775fF5701e647";
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((result: any) => {
        accountChangedHandler(result[0]);

        buttonTextHandler(result[0]);
      });
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountChangedHandler = (newAccount: any) => {
    setDefaultAccount(newAccount);
  };

  const buttonTextHandler = (account: string) => {
    let stringVal = account;
    let shortenString1st = stringVal.substring(0, 6).concat("...");
    let shortenString2nd = stringVal.slice(-3);
    setConnButtonText(shortenString1st + shortenString2nd);
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div className="App">
      <Nav contractAddress={CONTRACT_ADDRESS} walletHandler={() => connectWalletHandler()} />
      <Gameboard />
      <Game />
    </div>
  );
}

export default App;
