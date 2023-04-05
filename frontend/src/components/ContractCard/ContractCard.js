import React, { useState } from "react";
import { ethers } from "ethers";
import prizeABI from "../../assets/blockchain/Prize.json";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [contractAddressTitle, setContractAddressTitle] = useState(null);

  const CONTRACT_ADDRESS = "0x4BB7050fa47A142e6a90E642D2a775fF5701e647";

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((result) => {
        accountChangedHandler(result[0]);
        buttonTextHandler(result[0]);
        const contractAddress = CONTRACT_ADDRESS;
        //const abi = prizeABI.abi()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const prizeContract = new ethers.Contract(contractAddress, prizeABI.abi, provider);
        setContractAddressTitle(prizeContract.address);
      });
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
  };

  const buttonTextHandler = (account) => {
    let stringVal = account;
    let shortenString1st = stringVal.substring(0, 6).concat("...");
    let shortenString2nd = stringVal.slice(-3);
    setConnButtonText(shortenString1st + shortenString2nd);
  };

  const getUserBalance = (address) => {
    window.ethereum.request({ method: "eth_getBalance", params: [address, "latest"] }).then((balance) => {
      setUserBalance(ethers.utils.formatEther(balance));
    });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div className="walletCard">
      <h4>{"Connection to Blockchain"}</h4>
      <button onClick={connectWalletHandler}>{connButtonText}</button>
      <div className="accountDisplay">
        <h3>User Address: {defaultAccount}</h3>
      </div>
      <div className="balanceDisplay">
        <h3>Balance: {userBalance}</h3>
      </div>
      <div className="contractAddress">
        <h3>Contract: {contractAddressTitle}</h3>
      </div>
    </div>
  );
};

export default WalletCard;
