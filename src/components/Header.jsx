import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { PagasaLogo } from "./Logo";

// Styled Components
const StyledHeaderNavbar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
  pointer-events: ${({ isLoading }) => (isLoading ? "none" : "auto")}; /* Disable pointer events when loading */

  @media (max-width: 768px) {
    background: transparent;
  }
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
    top: 60px;
    left: 55%;
    transform: translateX(-50%);  // Centers the menu horizontally
    width: 150px;  // Reduced the width
    flex-direction: column;
    background:rgb(240, 240, 240);
    padding: 0.5rem 0.8rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    z-index: 99;
    border-radius: 6px;
    transform: translateY(-10px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;

    ${({ open }) =>
      open &&
      `
      transform: translateY(0);
      opacity: 1;
    `}

    & a {
      font-size: 0.95rem;  // Reduced font size for more compact look
      color:rgb(54, 56, 56);
      text-decoration: none;
      padding: 8px 12px;
      margin: 4px 0;
      border-radius: 4px;
      font-weight: 400;
      letter-spacing: 0.5px;
      transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
    }

    & a:hover {
      background-color: #34495e;
      color: #3498db;
      transform: scale(1.02);
    }

    & a:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.6);
    }

    & a:active {
      background-color: #1abc9c;
      color: #ffffff;
    }
  }
`;

const StyledNavLink = styled(NavLink)`
  color: black;
  text-decoration: none;
  padding: 10px 0;
  
  &.active,
  &:hover {
    color: #01b0ef;
  }

  pointer-events: ${({ isActive }) => (isActive ? "none" : "auto")}; /* Disable active links */
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

const HeaderNavbar = ({ isLoading }) => {
  const location = useLocation(); // To determine the current active route
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle the mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Helper function to check if the link is active
  const isLinkActive = (path) => location.pathname === path;

  return (
    <StyledHeaderNavbar isLoading={isLoading}>
      <CenterWrapper>
        <NavLink to="/" exact style={{ textDecoration: 'none' }}>
          <Logo>
            <PagasaLogoInstance />
            <Div>PAGASA</Div>
          </Logo>
        </NavLink>

        <Navbar>
          <StyledNavLink to="/" exact isActive={isLinkActive('/')} isLoading={isLoading}>
            Home
          </StyledNavLink>
          <StyledNavLink to="/weather" isActive={isLinkActive('/weather')} isLoading={isLoading}>
            Weather
          </StyledNavLink>
          <StyledNavLink to="/edit" isActive={isLinkActive('/edit')} isLoading={isLoading}>
            Marine
          </StyledNavLink>
          <StyledNavLink to="/about" isActive={isLinkActive('/about')} isLoading={isLoading}>
            About
          </StyledNavLink>
          <StyledNavLink to="/contact" isActive={isLinkActive('/contact')} isLoading={isLoading}>
            Contact Us
          </StyledNavLink>
        </Navbar>

        <Hamburger onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </Hamburger>
      </CenterWrapper>

      <MobileMenu open={menuOpen}>
        <StyledNavLink to="/" onClick={toggleMenu} isActive={isLinkActive('/')}>
          Home
        </StyledNavLink>
        <StyledNavLink to="/weather" onClick={toggleMenu} isActive={isLinkActive('/weather')}>
          Weather
        </StyledNavLink>
        <StyledNavLink to="/edit" onClick={toggleMenu} isActive={isLinkActive('/edit')}>
          Marine
        </StyledNavLink>
        <StyledNavLink to="/about" onClick={toggleMenu} isActive={isLinkActive('/about')}>
          About
        </StyledNavLink>
        <StyledNavLink to="/contact" onClick={toggleMenu} isActive={isLinkActive('/contact')}>
          Contact Us
        </StyledNavLink>
      </MobileMenu>
    </StyledHeaderNavbar>
  );
};

export default HeaderNavbar;
