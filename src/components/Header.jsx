import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { PagasaLogo } from "./Logo";

// Styled Components
const StyledHeaderNavbar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${({ theme }) => theme.colors.bgHeader}; /* Transparent background */
  backdrop-filter: ${({ theme }) => theme.colors.backdropFilter}; /* Apply blur for glass effect */
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.backdropFilter}; /* Safari support */
  position: sticky;
  top: 0;
  z-index: 100;
  pointer-events: ${({ isLoading }) => (isLoading ? "none" : "auto")};

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
  color: ${({ theme }) => theme.colors.highlight};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 24px;
  font-weight: 700;
`;

const Navbar = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ open }) => (open ? "flex" : "none")};
    position: absolute;
    top: 50px;
    left: 54%;
    transform: translateX(-50%);
    width: 150px;
    flex-direction: column;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    padding: 0.5rem 0.8rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    z-index: 99;
    border-radius: 6px;
    transform: translateY(-10px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;

    ${({ open }) =>
    open &&
    `transform: translateY(0); opacity: 1;`}

    & a {
      font-size: 0.95rem;
      color: ${({ theme }) => theme.colors.white};
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
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.mode === "dark" ? theme.colors.textPrimary : theme.colors.header};
  text-decoration: none;
  padding: 10px 0;
  transition: color 0.3s ease;

  &.active,
  &:hover {
    color: ${({ theme }) => theme.mode === "dark" ? theme.colors.highlight : theme.colors.highlight}; /* Highlight color */
  }

  pointer-events: ${({ isActive }) => (isActive ? "none" : "auto")};
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  flex-direction: column;
  gap: 4px;
  transition: all 0.3s ease;

  span {
    height: 3px;
    width: 25px;
    background: ${({ theme }) => theme.colors.highlight};
    border-radius: 2px;
    transition: transform 0.3s ease, background 0.3s ease;
  }

  &.open span:nth-child(1) {
    transform: rotate(45deg) translateY(7px);
  }

  &.open span:nth-child(2) {
    opacity: 0;
  }

  &.open span:nth-child(3) {
    transform: rotate(-45deg) translateY(-7px);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const HeaderNavbar = ({ isLoading }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isLinkActive = (path) => location.pathname === path;

  return (
    <StyledHeaderNavbar isLoading={isLoading}>
      <CenterWrapper>
        <a
          href="https://www.pagasa.dost.gov.ph/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Logo>
            <PagasaLogoInstance />
            <Div>PAGASA</Div>
          </Logo>
        </a>

        <Navbar>
          <StyledNavLink to="/" exact="true" isActive={isLinkActive('/')}>
            Home
          </StyledNavLink>
          <StyledNavLink to="/weather" isActive={isLinkActive('/weather')}>
            Weather
          </StyledNavLink>
          <StyledNavLink to="/edit" isActive={isLinkActive('/edit')}>
            Marine
          </StyledNavLink>
          <StyledNavLink to="/about" isActive={isLinkActive('/about')}>
            About
          </StyledNavLink>
          <StyledNavLink to="/contact" isActive={isLinkActive('/contact')}>
            Contact Us
          </StyledNavLink>
        </Navbar>

        <Hamburger className={menuOpen ? "open" : ""} onClick={toggleMenu}>
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
