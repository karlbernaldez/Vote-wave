import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { PagasaLogo } from "./Logo";

const StyledHeaderNavbar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const CenterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 70px;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PagasaLogoInstance = styled(PagasaLogo)`
  height: 28px !important;
  width: 28px !important;
`;

const Div = styled.div`
  color: #01b0ef;
  font-family: "Inter-Bold", Helvetica;
  font-size: 24px;
  font-weight: 700;
`;

const Navbar = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    display: none; /* Hide on mobile */
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ open }) => (open ? "flex" : "none")};
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: white;
    padding: 10px 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    z-index: 99;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: black;
  text-decoration: none;

  &.active,
  &:hover {
    color: #01b0ef;
  }

  padding: 10px 0;
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  flex-direction: column;
  gap: 4px;

  span {
    height: 3px;
    width: 25px;
    background: #01b0ef;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const HeaderNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <StyledHeaderNavbar>
      <CenterWrapper>
        <NavLink to="/" exact style={{ textDecoration: 'none' }}>
          <Logo>
            <PagasaLogoInstance />
            <Div>PAGASA</Div>
          </Logo>
        </NavLink>

        <Navbar>
          <StyledNavLink to="/" exact activeClassName="active">Home</StyledNavLink>
          <StyledNavLink to="/weather" activeClassName="active">Weather</StyledNavLink>
          <StyledNavLink to="/edit" activeClassName="active">Marine</StyledNavLink>
          <StyledNavLink to="/about" activeClassName="active">About</StyledNavLink>
          <StyledNavLink to="/contact" activeClassName="active">Contact Us</StyledNavLink>
        </Navbar>

        <Hamburger onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </Hamburger>
      </CenterWrapper>

      <MobileMenu open={menuOpen}>
        <StyledNavLink to="/" onClick={toggleMenu}>Home</StyledNavLink>
        <StyledNavLink to="/weather" onClick={toggleMenu}>Weather</StyledNavLink>
        <StyledNavLink to="/edit" onClick={toggleMenu}>Marine</StyledNavLink>
        <StyledNavLink to="/about" onClick={toggleMenu}>About</StyledNavLink>
        <StyledNavLink to="/contact" onClick={toggleMenu}>Contact Us</StyledNavLink>
      </MobileMenu>
    </StyledHeaderNavbar>
  );
};

export default HeaderNavbar;
