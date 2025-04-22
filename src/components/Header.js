import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Menu } from "./Menu";
import { PagasaLogo } from "./Logo";

// Styled components...
const StyledHeaderNavbar = styled.div`
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  position: relative;
  width: 100%; /* Full width of the screen */
`;

const CenterWrapper = styled.div`
  align-items: center;
  background-color: #ffffff;
  display: flex;
  gap: 214px;
  height: 70px;
  justify-content: space-around;
  position: relative;
  width: 100%;
`;

const Center = styled.div`
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 50px;
  justify-content: center;
  position: relative;
`;

const Logo = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  position: relative;
  width: 172px;
`;

const PagasaLogoInstance = styled(PagasaLogo)`
  background-image: url('/pagasa-logo.png') !important;
  height: 28px !important;
  position: relative !important;
  width: 28px !important;
`;

const Div = styled.div`
  color: #01b0ef;
  font-family: "Inter-Bold", Helvetica;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
  margin-top: -1.00px;
  position: relative;
  width: 134px;
`;

const StyledNavLink = styled(NavLink)`
  color: black; /* Default color */
  text-decoration: none; /* Remove underline */
  
  &.active {
    color: #01b0ef; /* Active color */
  }

  &:hover {
    color: #01b0ef; /* Color on hover */
  }
`;

const MenuInstance = styled(Menu)`
  flex: 0 0 auto !important;
`;

const DesignComponentInstanceNode = styled.div`
  color: #01b0ef !important;
`;

const Navbar = styled.div`
  display: flex; /* Ensure the NavLink items are aligned horizontally */
  gap: 30px; /* Add gap between menu items */
  align-items: center; /* Optional: Align vertically centered */
`;

const HeaderNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <StyledHeaderNavbar>
      <CenterWrapper>
        <Center>
          {/* Logo Section */}
          <NavLink to="/" exact style={{ textDecoration: 'none' }}>
            <Logo>
              <PagasaLogoInstance className="pagasa-logo-instance" />
              <Div>PAGASA</Div>
            </Logo>
          </NavLink>

          {/* Menu Section with Gap */}
          <Navbar>
            <StyledNavLink to="/" exact activeClassName="active">
              Home
            </StyledNavLink>
            <StyledNavLink to="/weather" activeClassName="active">
              Weather
            </StyledNavLink>
            <StyledNavLink to="/edit" activeClassName="active">
              Marine
            </StyledNavLink>
            <StyledNavLink to="/about" activeClassName="active">
              About
            </StyledNavLink>
            <StyledNavLink to="/contact" activeClassName="active">
              Contact Us
            </StyledNavLink>
          </Navbar>
        </Center>
      </CenterWrapper>
    </StyledHeaderNavbar>
  );
};

export default HeaderNavbar;