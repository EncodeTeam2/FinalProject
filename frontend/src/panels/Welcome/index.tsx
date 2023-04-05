import React from "react";
import StyledWelcome from "./style";

interface WelcomeProps {
  play: () => void;
  claim: () => void;
}

const Welcome = ({ play, claim }: WelcomeProps) => {
  return (
    <StyledWelcome>
      <h1>Jackpot Crawler</h1>
      <p></p>
      <div>
        <p className="menu-item" onClick={() => play()}>
          Play
        </p>
        <p className="menu-item" onClick={() => claim()}>
          Claim
        </p>
      </div>
    </StyledWelcome>
  );
};

Welcome.defaultProps = {
  play: () => { },
  claim: () => { },
};
export default Welcome;
