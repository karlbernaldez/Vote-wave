import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { PagasaLogo } from "./Logo";
import { FaSun, FaMoon } from 'react-icons/fa'; // Import FontAwesome icons

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
  margin-left: 40rem;

  @media (max-width: 1024px) {
    margin-left: -2rem;
    margin-right: -20rem;
  }

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
    color: ${({ theme }) => theme.mode === "dark" ? theme.colors.highlight : theme.colors.highlight};
  }

  pointer-events: ${({ isactive }) => (isactive ? "none" : "auto")};
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

const ThemeToggleButton = styled.button`
  background-color: ${({ theme }) => theme.colors.toggleBackground}; /* Background color for the toggle button */
  color: ${({ theme }) => theme.colors.toggle};
  border: 1px solid ${({ theme }) => theme.colors.toggleBorder}; /* Add a border */
  padding: 4px 16px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 20px;

  gap: 8px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  margin-right: -20rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.boxShadowHover};
  }

  @media (max-width: 1024px) {
    margin-right: 1rem; // Adjust margin for smaller screens
  }

  @media (max-width: 768px) {
    display: none;  // Hide on mobile
  }
`;

const IconContainer = styled.div`
  display: flex;
  transition: transform 0.3s ease; // Smooth transition for glide effect
  transform: ${({ isDarkMode }) => (isDarkMode ? 'translateX(10px)' : 'translateX(-10px)')};
`;

const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <ThemeToggleButton onClick={() => setIsDarkMode(!isDarkMode)}>
      <IconContainer isDarkMode={isDarkMode}>
        {isDarkMode ? <FaMoon /> : <FaSun />} {/* Conditional rendering based on theme */}
      </IconContainer>
    </ThemeToggleButton>
  );
};

const HeaderNavbar = ({ isLoading, isDarkMode, setIsDarkMode }) => {
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
          <StyledNavLink to="/" exact="true" activeclassname="active">
            Home
          </StyledNavLink>
          <StyledNavLink to="/weather" isactive={isLinkActive('/weather')}>
            Weather
          </StyledNavLink>
          <StyledNavLink to="/edit" isactive={isLinkActive('/edit')}>
            Marine
          </StyledNavLink>
          <StyledNavLink to="/about" isactive={isLinkActive('/about')}>
            About
          </StyledNavLink>
          <StyledNavLink to="/contact" isactive={isLinkActive('/contact')}>
            Contact Us
          </StyledNavLink>
        </Navbar>

        {/* Theme toggle button */}
        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <Hamburger className={menuOpen ? "open" : ""} onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </Hamburger>
      </CenterWrapper>

      <MobileMenu open={menuOpen}>
        <StyledNavLink to="/" onClick={toggleMenu} isactive={isLinkActive('/')}>
          Home
        </StyledNavLink>
        <StyledNavLink to="/weather" onClick={toggleMenu} isactive={isLinkActive('/weather')}>
          Weather
        </StyledNavLink>
        <StyledNavLink to="/edit" onClick={toggleMenu} isactive={isLinkActive('/edit')}>
          Marine
        </StyledNavLink>
        <StyledNavLink to="/about" onClick={toggleMenu} isactive={isLinkActive('/about')}>
          About
        </StyledNavLink>
        <StyledNavLink to="/contact" onClick={toggleMenu} isactive={isLinkActive('/contact')}>
          Contact Us
        </StyledNavLink>
      </MobileMenu>
    </StyledHeaderNavbar>
  );
};

export default HeaderNavbar;
