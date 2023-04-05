import React, { useState, useEffect } from "react";
import "./gameboard.css";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import { ethers } from "ethers";
import prizeABI from "../../assets/blockchain/Prize.json";

declare let window: any;

export function Gameboard() {
  const CONTRACT_ADDRESS = "0x4BB7050fa47A142e6a90E642D2a775fF5701e647";

  // Prize Contract
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com"
  );
  const prizeContract = new ethers.Contract(CONTRACT_ADDRESS, prizeABI.abi, provider);

  // Get Eth Price
  const [maticPrice, setMaticPrice] = useState(0);
  const getMaticPrice = async () => {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd");
    const data = await response.json();
    console.log(data["matic-network"])
    setMaticPrice(data["matic-network"].usd);
  };
  useEffect(() => {
    getMaticPrice();
  }, []);

  // Get Pool Prize
  const [prizePool, setPoolPrize] = useState<string | number>(0);
  const getPoolPrize = async () => {
    const response = await prizeContract.prizePool();
    console.log(response);
    setPoolPrize(ethers.utils.formatEther(response));
  };
  useEffect(() => {
    getPoolPrize();
  }, []);

  // Get Time Remaining and convert to users local time
  const [timeRemaining, setTimeRemaining] = useState<string | number>(0);
  const getTimeRemaining = async () => {
    const response = await prizeContract.startTime();
    console.log("Time", response.toNumber());
    if (response.toNumber() === 0) {
      setTimeRemaining("Game waiting to be played");
      return;
    }
    let endTime = response.toNumber() + 300;
    let date = new Date(endTime * 1000);
    console.log(date);
    setTimeRemaining(date.toString());
  };
  useEffect(() => {
    getTimeRemaining();
  }, []);

  return (
    <Container className="gameboard">
      <Stack direction="horizontal" gap={3}>
        <div>MATIC price: {maticPrice}</div>
        <div>Prize pool: {prizePool}</div>
        <div>Game open until: {timeRemaining}</div>
      </Stack>
    </Container>
  );
}
