import styled from "styled-components";

const StyledWelcome = styled.nav`
  display: grid;
  grid-template-rows: 200px 100px 200px;
  text-align: center;
  user-select: none;

  > h1 {
    margin: 144px 0 0 16px;
    font-size: 40px;
    font-weight: 400;
    text-transform: uppercase;
  }

  > p {
    font-size: 34px;
    margin-top: 48px;
  }

  p.menu-item {
    display: inline-block;
    font-size: 34px;
    margin-top: 24px;
    margin-right: 24px;
    padding-left: 24px;
  }

  /* Level Pane */
  > :last-child {
    margin-top: -24px;
  }
`;

export default StyledWelcome;
