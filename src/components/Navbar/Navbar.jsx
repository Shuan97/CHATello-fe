import WidgetsIcon from "@material-ui/icons/Widgets";
import { Spacer } from "components/common/Heading";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { historyLink } from "utils/history";

const Navbar = () => {
  return (
    <StyledNavbar>
      <Link to={historyLink("/")}>
        <img
          height='48'
          width='48'
          className='mx-12'
          src='data:image/webp;base64,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'
        />
      </Link>
      <h2>Welcome to CHATello!</h2>
      <Spacer />
      <Link to={historyLink("/")}>
        <WidgetsIcon />
      </Link>
    </StyledNavbar>
  );
};

const StyledNavbar = styled.nav`
  z-index: 10;
  display: flex;
  align-items: center;
  height: 64px;
  width: 100%;
  padding: 0 32px;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: white;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 16%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
`;

export default Navbar;
