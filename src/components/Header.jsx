import React, { useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { PagasaLogo } from "./Logo";
import { FaSun, FaMoon } from 'react-icons/fa';

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
`;

const CenterWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 70px;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 6rem;
  text-decoration: none;
  
  @media (max-width: 939px) {
    margin-left: 1rem;
  }
`;

const PagasaLogoInstance = styled(PagasaLogo)`
  height: 28px !important;
  width: 28px !important;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.highlight};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const NavAndToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 15rem;
  margin-right: 2rem;

  @media (max-width: 939px) {
    display: none;
  }
`;

const Navbar = styled.div`
  display: flex;
  gap: 30px;
  margin-left: 8rem;
`;

const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  padding: 10px 0;
  transition: color 0.3s ease;

  &.active,
  &:hover {
    color: ${({ theme }) => theme.colors.highlight};
  }

  pointer-events: ${({ isactive }) => (isactive ? "none" : "auto")};
`;

const ThemeToggleButton = styled.button`
  background-color: ${({ theme }) => theme.colors.toggleBackground};
  color: ${({ theme }) => theme.colors.toggle};
  border: 1px solid ${({ theme }) => theme.colors.toggleBorder};
  padding: 4px 16px;
  border-radius: 50px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.boxShadowHover};
  }

  @media (min-width: 940px) and (max-width: 1080px) {
    margin-left: -10rem;
  }

  @media (max-width: 939px) {
    padding: 2px 8px;
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }

  @media (max-width: 300px) {
    display: none;
  }
`;

const IconContainer = styled.div`
  display: flex;
  transition: transform 0.3s ease;
  transform: ${({ isDarkMode }) => (isDarkMode ? 'translateX(10px)' : 'translateX(-10px)')};

  @media (max-width: 939px) {
    transform: ${({ isDarkMode }) => (isDarkMode ? 'translateX(6px)' : 'translateX(-6px)')};
  }
`;

const MobileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;

  @media (min-width: 940px) {
    display: none;
  }
`;

const Hamburger = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  span {
    height: 3px;
    width: 25px;
    background: ${({ theme }) => theme.colors.highlight};
    border-radius: ${({ theme }) => theme.borderRadius.xxsmall};
    transition: transform 0.3s ease, background 0.3s ease;
  }

  &.open span:nth-child(1) {
    transform: rotate(45deg) translateY(10px);
  }

  &.open span:nth-child(2) {
    opacity: 0;
  }

  &.open span:nth-child(3) {
    transform: rotate(-45deg) translateY(-10px);
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 939px) {
    display: ${({ open }) => (open ? "flex" : "none")};
    position: absolute;
    top: 50px;
    right: 2rem;
    width: 150px;
    flex-direction: column;
    background: ${({ theme }) => theme.gradients.background};
    padding: 0.5rem 0.8rem;
    box-shadow: ${({ theme }) => theme.colors.boxShadow};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    transform: translateY(-10px);
    opacity: 0;
    z-index: 99;
    transition: transform 0.3s ease, opacity 0.3s ease;

    ${({ open }) => open && `
      transform: translateY(0);
      opacity: 1;
    `}

    & a {
      font-size: ${({ theme }) => theme.fontSizes.small};
      color: ${({ theme }) => theme.colors.mobileTextPrimary};
      text-decoration: none;
      padding: 8px 12px;
      margin: 4px 0;
      border-radius: ${({ theme }) => theme.borderRadius.xsmall};
      font-weight: ${({ theme }) => theme.fontWeights.regular};
      letter-spacing: 0.5px;
      transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
    }
  }
`;

const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => (
  <ThemeToggleButton onClick={() => setIsDarkMode(!isDarkMode)}>
    <IconContainer isDarkMode={isDarkMode}>
      {isDarkMode ? <FaMoon /> : <FaSun />}
    </IconContainer>
  </ThemeToggleButton>
);

const HeaderNavbar = ({ isLoading, isDarkMode, setIsDarkMode }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const isLinkActive = (path) => location.pathname === path;

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
            <StyledNavLink to="/" exact="true" activeclassname="active">Home</StyledNavLink>
            <StyledNavLink to="/weather" isactive={isLinkActive('/weather')}>Weather</StyledNavLink>
            <StyledNavLink to="/edit" isactive={isLinkActive('/edit')}>Marine</StyledNavLink>
            <StyledNavLink to="/about" isactive={isLinkActive('/about')}>About</StyledNavLink>
            <StyledNavLink to="/contact" isactive={isLinkActive('/contact')}>Contact Us</StyledNavLink>
          </Navbar>
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </NavAndToggleWrapper>

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
        <StyledNavLink to="/" onClick={toggleMenu} isactive={isLinkActive('/')}>Home</StyledNavLink>
        <StyledNavLink to="/weather" onClick={toggleMenu} isactive={isLinkActive('/weather')}>Weather</StyledNavLink>
        <StyledNavLink to="/edit" onClick={toggleMenu} isactive={isLinkActive('/edit')}>Marine</StyledNavLink>
        <StyledNavLink to="/about" onClick={toggleMenu} isactive={isLinkActive('/about')}>About</StyledNavLink>
        <StyledNavLink to="/contact" onClick={toggleMenu} isactive={isLinkActive('/contact')}>Contact Us</StyledNavLink>
      </MobileMenu>
    </StyledHeaderNavbar>
  );
};

export default HeaderNavbar;
