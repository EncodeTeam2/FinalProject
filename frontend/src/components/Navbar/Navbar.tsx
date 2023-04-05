import React from "react";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import ConnectButton from "../ConnectButton/ConnectButton";
import "./navbar.css";

export function Nav(props: any) {
  // Contract Hook and Address
  // const CONTRACT_ADDRESS = "0x4BB7050fa47A142e6a90E642D2a775fF5701e647";

  return (
    <Container fluid>
      <Stack direction="horizontal" gap={3}>
        <div className="bg-light">Team 2</div>
        <div className="bg-light ms-auto">
          {" "}
          Contract Address:
          <a
            href="https://mumbai.polygonscan.com/address/0x4BB7050fa47A142e6a90E642D2a775fF5701e647"
            target="_blank"
            rel="noreferrer"
          >
            {props.contractAddress}
          </a>
        </div>
      </Stack>
    </Container>
  );
}
