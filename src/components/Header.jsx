//  ╔═══════════════════════════════════════════════════════════════════════╗
//  ║                        🌪 Component B Project 1                       ║
//  ╠═══════════════════════════════════════════════════════════════════════╣
//  ║  📁 Project       : DOST-MECO-TECO-VOTE III Component-B               ║
//  ║  📝 Description   :  Weather forecasting platform                     ║
//  ║  👨‍💻 Author        : Karl Santiago Bernaldez                           ║
//  ║  📅 Created       : 2025-03-24                                        ║
//  ║  🕓 Last Updated  : 2025-06-17                                        ║
//  ║  🧭 Version       : v1.0.1                                            ║
//  ╚═══════════════════════════════════════════════════════════════════════╝

import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { PagasaLogo } from "./Logo";
import { FaSun, FaMoon } from "react-icons/fa";

// Breakpoint constants for consistency
const BREAKPOINTS = {
  mobile: '939px',
  tablet: '1080px',
  desktop: '1280px'
};

const StyledHeaderNavbar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${({ theme }) => theme.colors.bgHeader};
  backdrop-filter: ${({ theme }) => theme.colors.backdropFilter};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.backdropFilter};
  position: sticky;
  top: 0;
  z-index: 100;
  pointer-events: ${({ isLoading }) => (isLoading ? "none" : "auto")};
  transition: all 0.3s ease;
`;

const CenterWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 clamp(1rem, 4vw, 2rem);
  height: 70px;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  position: relative;
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vw, 12px);
  margin-left: clamp(1rem, 8vw, 6rem);
  text-decoration: none;
  flex-shrink: 0;
  transition: all 0.3s ease;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    margin-left: 0;
  }
`;

const PagasaLogoInstance = styled(PagasaLogo)`
  height: clamp(24px, 4vw, 28px) !important;
  width: clamp(24px, 4vw, 28px) !important;
  transition: all 0.3s ease;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.highlight};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: clamp(${({ theme }) => theme.fontSizes.large}, 3vw, ${({ theme }) => theme.fontSizes.xxlarge});
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: font-size 0.3s ease;
  
  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
`;

const NavAndToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: clamp(1rem, 3vw, 3rem);
  margin-right: clamp(1rem, 3vw, 2rem);
  transition: all 0.3s ease;
  opacity: 1;
  transform: translateX(0);

  @media (max-width: ${BREAKPOINTS.mobile}) {
    opacity: 0;
    transform: translateX(20px);
    pointer-events: none;
    position: absolute;
    right: 0;
  }

  @media (min-width: 940px) {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
    position: static;
  }
`;

const Navbar = styled.div`
  display: flex;
  gap: clamp(15px, 3vw, 30px);
  margin-left: clamp(2rem, 8vw, 8rem);
  transition: all 0.3s ease;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    margin-left: clamp(1rem, 4vw, 4rem);
    gap: clamp(12px, 2.5vw, 25px);
  }

  @media (max-width: 1120px) {
    margin-left: clamp(0.5rem, 2vw, 2rem);
    gap: clamp(10px, 2vw, 20px);
  }
`;

const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  padding: 10px 0;
  font-size: clamp(${({ theme }) => theme.fontSizes.small}, 1.8vw, ${({ theme }) => theme.fontSizes.medium});
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.highlight};
    transition: width 0.3s ease;
  }

  &.active,
  &:hover {
    color: ${({ theme }) => theme.colors.highlight};
    
    &::after {
      width: 100%;
    }
  }

  pointer-events: ${({ isactive }) => (isactive ? "none" : "auto")};

  @media (max-width: 1120px) {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const ThemeToggleButton = styled.button`
  background-color: ${({ theme }) => theme.colors.toggleBackground};
  color: ${({ theme }) => theme.colors.toggle};
  border: 1px solid ${({ theme }) => theme.colors.toggleBorder};
  padding: clamp(2px, 1vw, 4px) clamp(8px, 2vw, 16px);
  border-radius: 50px;
  cursor: pointer;
  font-size: clamp(${({ theme }) => theme.fontSizes.medium}, 2vw, ${({ theme }) => theme.fontSizes.xlarge});
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  transition: all 0.3s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: clamp(32px, 5vw, 48px);
  height: clamp(28px, 4vw, 36px);

  &:hover {
    background-color: ${({ theme }) => theme.colors.boxShadowHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 300px) {
    min-width: 28px;
    height: 24px;
    padding: 2px 6px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  transition: transform 0.3s ease;
  transform: ${({ isDarkMode }) =>
    isDarkMode ? "translateX(10px)" : "translateX(-10px)"};

  @media (max-width: 939px) {
    transform: ${({ isDarkMode }) =>
    isDarkMode ? "translateX(6px)" : "translateX(-6px)"};
  }
`;

const MobileWrapper = styled.div`
  display: none;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-left: auto;
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s ease;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: flex;
    opacity: 1;
    transform: translateX(0);
  }
`;

const Hamburger = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.toggleBackground};
  }

  span {
    height: 3px;
    width: 25px;
    background: ${({ theme }) => theme.colors.highlight};
    border-radius: ${({ theme }) => theme.borderRadius.xxsmall};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }

  &.open span:nth-child(1) {
    transform: rotate(45deg) translate(7px, 7px);
  }

  &.open span:nth-child(2) {
    opacity: 0;
    transform: scale(0);
  }

  &.open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: ${({ open }) => (open ? "flex" : "none")};
    position: absolute;
    top: 60px;
    right: clamp(1rem, 4vw, 2rem);
    width: clamp(140px, 30vw, 160px);
    flex-direction: column;
    background: ${({ theme }) => theme.gradients.background};
    padding: 0.5rem 0.8rem;
    box-shadow: ${({ theme }) => theme.colors.boxShadow};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    transform: ${({ open }) => (open ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.95)")};
    opacity: ${({ open }) => (open ? 1 : 0)};
    z-index: 99;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top right;

    & a {
      font-size: ${({ theme }) => theme.fontSizes.small};
      color: ${({ theme }) => theme.colors.mobileTextPrimary};
      text-decoration: none;
      padding: 8px 12px;
      margin: 2px 0;
      border-radius: ${({ theme }) => theme.borderRadius.xsmall};
      font-weight: ${({ theme }) => theme.fontWeights.regular};
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: ${({ theme }) => theme.colors.toggleBackground};
        transform: translateX(4px);
      }
    }
  }
`;

const UserControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 400;
  margin-left: auto;
  margin-right: clamp(1rem, 3vw, 2rem);
  word-spacing: 0.15rem;
  font-size: clamp(${({ theme }) => theme.fontSizes.small}, 1.5vw, ${({ theme }) => theme.fontSizes.medium});
  transition: all 0.3s ease;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: none;
  }

  @media (max-width: 1120px) {
    font-size: ${({ theme }) => theme.fontSizes.small};
    margin-right: 1rem;
  }
`;

const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleToggle = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeoutId = setTimeout(() => {
      setIsDarkMode(!isDarkMode);
    }, 150); // Reduced debounce time for better responsiveness

    setDebounceTimeout(timeoutId);
  };

  return (
    <ThemeToggleButton onClick={handleToggle}>
      <IconContainer isDarkMode={isDarkMode}>
        {isDarkMode ? <FaMoon /> : <FaSun />}
      </IconContainer>
    </ThemeToggleButton>
  );
};

const HeaderNavbar = ({ isLoading, isDarkMode, setIsDarkMode }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const isLinkActive = (path) => location.pathname === path;
  const isAuthenticated = localStorage.getItem("authToken");
  const showWelcomeMessage = location.pathname === "/edit";

  let username = JSON.parse(localStorage.getItem("user"))?.username;

  username = username
    ? username.toLowerCase().replace(/^./, username[0].toUpperCase())
    : '';

  return (
    <StyledHeaderNavbar isLoading={isLoading}>
      <CenterWrapper>
        <Logo
          href="https://www.pagasa.dost.gov.ph/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PagasaLogoInstance />
          <Title>PAGASA</Title>
        </Logo>

        <NavAndToggleWrapper>
          <Navbar>
            <StyledNavLink to="/" exact="true" activeclassname="active">
              Home
            </StyledNavLink>
            <StyledNavLink to="/charts" $isactive={isLinkActive("/charts")}>
              Charts
            </StyledNavLink>
            <StyledNavLink to="/edit" $isactive={isLinkActive("/edit")}>
              Editor
            </StyledNavLink>
            <StyledNavLink to="/about" $isactive={isLinkActive("/about")}>
              About
            </StyledNavLink>
            <StyledNavLink to="/contact" $isactive={isLinkActive("/contact")}>
              Contact Us
            </StyledNavLink>
          </Navbar>
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </NavAndToggleWrapper>

        {isAuthenticated && showWelcomeMessage && (
          <UserControls>
            <span>
              Welcome back {username || "User"}
            </span>
          </UserControls>
        )}

        <MobileWrapper>
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Hamburger className={menuOpen ? "open" : ""} onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </Hamburger>
        </MobileWrapper>

      </CenterWrapper>

      <MobileMenu open={menuOpen}>
        <StyledNavLink to="/" onClick={toggleMenu} $isactive={isLinkActive("/")}>
          Home
        </StyledNavLink>
        <StyledNavLink to="/charts" onClick={toggleMenu} $isactive={isLinkActive("/charts")}>
          Charts
        </StyledNavLink>
        <StyledNavLink to="/edit" onClick={toggleMenu} $isactive={isLinkActive("/edit")}>
          Editor
        </StyledNavLink>
        <StyledNavLink to="/about" onClick={toggleMenu} $isactive={isLinkActive("/about")}>
          About
        </StyledNavLink>
        <StyledNavLink to="/contact" onClick={toggleMenu} $isactive={isLinkActive("/contact")}>
          Contact Us
        </StyledNavLink>
      </MobileMenu>
    </StyledHeaderNavbar>
  );
};

export default HeaderNavbar;