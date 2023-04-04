import React from "react";
import { GameTitle } from "../../types";
import StyledTitle from "./style";

interface TitleProps {
  children: React.ReactNode;
}
const Title = ({ children }: TitleProps) => {
  return <StyledTitle>{children}</StyledTitle>;
};

Title.defaultProps = {
  children: GameTitle.BestScore,
} as TitleProps;
export default Title;
