import React from "react";
import styled from "styled-components";

const Navbar = () => {
  return <StyledNavbar>Hello Navbar!</StyledNavbar>;
};

const StyledNavbar = styled.nav`
  z-index: 9999;
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
