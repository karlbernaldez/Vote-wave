// src/components/Menu.js
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledMenu = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 40px;
  position: relative;

  & .nav-item {
    color: #000;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    white-space: nowrap;
    cursor: pointer;
  }

  &.catalog,
  &.menu-7 {
    background-color: #292929;
    border-radius: 5px;
    height: 35px;
    padding: 0 10px;
    gap: 14px;
    color: white;
  }

  & .icon {
    width: 20px;
    height: 20px;
  }

  & .text-wrapper {
    font-weight: 700;
    font-size: 16px;
    text-align: center;
  }
`;

export const Menu = ({ menu }) => {
  const renderDefaultMenu = () => (
    <>
      <div className="nav-item">About</div>
      <div className="nav-item">Features</div>
      <div className="nav-item">Pricing</div>
      <div className="nav-item">Gallery</div>
      <div className="nav-item">Team</div>
    </>
  );

  const renderCatalogMenu = () => (
    <>
      <div className="text-wrapper">MENU</div>
    </>
  );

  return (
    <>
      {["default", "upper", "upper-small"].includes(menu) && (
        <StyledMenu className={menu}>
          {renderDefaultMenu()}
        </StyledMenu>
      )}
      {["catalog", "menu-7"].includes(menu) && (
        <StyledMenu className={menu}>
          {renderCatalogMenu()}
        </StyledMenu>
      )}
    </>
  );
};

Menu.propTypes = {
  menu: PropTypes.oneOf([
    "upper-small",
    "default",
    "menu-7",
    "catalog",
    "upper",
  ]),
};
