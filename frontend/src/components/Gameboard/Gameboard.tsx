import React from "react";
import "./gameboard.css";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";

export function Gameboard() {
  return (
    <Container className="gameboard">
      <Stack direction="horizontal" gap={3}>
        <div>Eth price</div>
        <div>Pool prize</div>
        <div>Time Remaining:</div>
        <div>Your Remaining:</div>
      </Stack>
    </Container>
  );
}
