import React from "react";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import ConnectButton from "../ConnectButton/ConnectButton";
import './navbar.css'


export function Nav(props: any) {

  // Contract Hook and Address
  // const CONTRACT_ADDRESS = "0xD48493103049326ddF73fC704939eb05Ae899e0b";


  return (
    <Container fluid>
      <Stack direction="horizontal" gap={3}>
        <div className="bg-light">Team 2</div>
        <div className="bg-light ms-auto"> Contract Address: 
          <a
            href="https://mumbai.polygonscan.com/address/0xD48493103049326ddF73fC704939eb05Ae899e0b"
            target="_blank"
            rel="noreferrer"
          >
            {props.contractAddress}
          </a>
        </div>
        <div className="bg-light">Third item</div>
        <ConnectButton />
      </Stack>
    </Container>
  );
}
