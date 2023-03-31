import styled, { keyframes } from "styled-components";
import foodSvg from "../../assets/game/ethereum-eth-logo.png";
import { BoardCell } from "../../types";

const spin = keyframes`
    from {
        transform: rotate(0)
    }

    to {
        transform: rotate(360deg)
    }
`;

const appear = keyframes`
    from {
        transform: scale(.1)
    }

    to {
        transform: scale(1)
    }
`;

const StyledStaticFood = styled.div.attrs<{ $opacity: string }>(({ $opacity }) => ({
  style: {
    opacity: $opacity,
  },
}))<{ $opacity: string }>`
  background-image: url(${foodSvg});
  background-size: 100% 100%;
`;

const StyledSpinFood = styled(StyledStaticFood).attrs<{ $opacity: string }>(({ $opacity }) => ({
  style: {
    opacity: $opacity,
  },
}))<{ $opacity: string }>`
  animation: ${spin} 2s linear infinite;
`;

const StyledAppearFood = styled(StyledStaticFood).attrs<{
  $opacity: string;
  $state: "paused" | "running";
}>(({ $opacity, $state }) => ({
  style: {
    opacity: $opacity,
    animationPlayState: $state,
  },
}))<{ $opacity: string; $state: "paused" | "running" }>`
  animation: ${appear} 200ms cubic-bezier(0.5, 1, 0, 1.6), ${spin} 3.5s cubic-bezier(0.2, 0.6, 0.4, 1) 200ms;
`;

const StyledSnake = styled.div.attrs<{ $opacity: string }>(({ $opacity, theme }) => ({
  style: {
    opacity: $opacity,
    backgroundColor: '#000000',
  },
}))<{ $opacity: string }>`
  border-radius: 8px;
`;

const StyledBoard = styled.div<{ $debug: boolean }>`
  display: grid;
  grid-template-columns: repeat(${BoardCell.column}, 28px);
  grid-template-rows: repeat(${BoardCell.row}, 28px);

  > * {
    box-shadow: ${({ $debug }) => ($debug ? "0 0 0 1px blanchedalmond" : "")};
  }
`;

export default StyledBoard;
export { StyledSnake, StyledStaticFood, StyledSpinFood, StyledAppearFood };
