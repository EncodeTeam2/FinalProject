import React from "react";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import ConnectButton from "../ConnectButton/ConnectButton";

export function Nav() {
  return (
    <Container fluid>
      <Stack direction="horizontal" gap={3}>
        <div className="bg-light">Team 2</div>
        <div className="bg-light ms-auto">App Logo</div>
        <div className="bg-light">Third item</div>
        <ConnectButton />
      </Stack>
    </Container>
  );
}
