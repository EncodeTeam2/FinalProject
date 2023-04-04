import React from "react";
import StyledWelcome from "./style";

interface WelcomeProps {
  onClick: () => void;
}

const Welcome = ({ onClick }: WelcomeProps) => {
  return (
    <StyledWelcome>
      <h1>Jackpot Crawler</h1>
      <p>Choose level:</p>
      <p className="play" onClick={() => onClick()}>Play</p>
    </StyledWelcome>
  );
};

Welcome.defaultProps = {
  onClick: () => {},
};
export default Welcome;
