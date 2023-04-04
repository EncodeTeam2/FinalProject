import React, { useState } from "react";
import { ethers } from "ethers";

const ConnectButton = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((result) => {
        accountChangedHandler(result[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        buttonTextHandler(result[0]);
      });
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
  };

  const buttonTextHandler = (account) => {
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
    <div className="connectButton">
      <button onClick={connectWalletHandler}>{connButtonText}</button>
    </div>
  );
};

export default ConnectButton;
