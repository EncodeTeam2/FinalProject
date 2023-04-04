import React, { useState } from "react";
import { ethers } from "ethers";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import ConnectButton from "../ConnectButton/ConnectButton";
import prizeABI from "../../assets/blockchain/Prize.json";


declare let window: any;

export function Nav() {

  // Contract Hook and Address
  const CONTRACT_ADDRESS = "0xD48493103049326ddF73fC704939eb05Ae899e0b";

  // Set ethereum contract
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const prizeContract = new ethers.Contract(CONTRACT_ADDRESS, prizeABI.abi, provider);

  return (
    <Container fluid>
      <Stack direction="horizontal" gap={3}>
        <div className="bg-light">Team 2</div>
        <div className="bg-light ms-auto">
          <a href="https://mumbai.polygonscan.com/address/0xD48493103049326ddF73fC704939eb05Ae899e0b" target="_blank" rel="noreferrer">
            {CONTRACT_ADDRESS}
          </a>
        </div>
        <div className="bg-light">Third item</div>
        <ConnectButton />
      </Stack>
    </Container>
  );
}
