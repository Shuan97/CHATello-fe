import React from "react";
import styled from "styled-components";

const Navbar = () => {
  return <StyledNavbar>Hello Navbar!</StyledNavbar>;
};

const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  height: 64px;
  width: 100%;
  padding: 0 32px;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: white;
`;

export default Navbar;
