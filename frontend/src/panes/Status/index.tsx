import React from "react";
import { GameConfig, defaultGameConfig } from "../../types";
import StyledStatus, { StyledShareButton } from "./style";

interface StatusProps extends GameConfig {
  stopped: boolean;
}

const Status = (props:any) => {
  // console.log('props in status', props)

  return (
    <StyledStatus>
      <p>{props.score}</p>
      <button onClick={() => {
        props.submitScore(props.bestScore);
        }}>
        Submit High Score
      </button>
      <p>{`${props.bestScore}`} pts</p>
    </StyledStatus>
  );
};

Status.defaultProps = {
  stopped: false,
  ...defaultGameConfig,
} as StatusProps;
export default Status;
