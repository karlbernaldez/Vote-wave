import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const StyledMenu = styled.div`
  align-items: center;
  display: inline-flex;
  position: relative;

  & .about,
  & .features,
  & .pricing,
  & .gallery,
  & .team {
    color: #000000;
    font-family: "Roboto-Regular", Helvetica;
    font-weight: 400;
    letter-spacing: 0;
    line-height: normal;
    margin-top: -1.00px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
  }

  & .icon {
    height: 20px;
    position: relative;
    width: 20px;
  }

  & .text-wrapper {
    color: #ffffff;
    font-family: "Roboto-Bold", Helvetica;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0;
    line-height: normal;
    position: relative;
    text-align: center;
    white-space: nowrap;
    width: fit-content;
  }

  & .menu-hambuger-btn-instance {
    height: 24px !important;
    left: 0 !important;
    position: absolute !important;
    top: 0 !important;
    width: 24px !important;
  }

  & .menu-hambuger-btn-1-instance {
    height: 35px !important;
    left: 0 !important;
    position: absolute !important;
    top: 0 !important;
    width: 35px !important;
  }

  &.hambuger-btn,
  &.upper-small,
  &.upper,
  &.default,
  &.hambuger-btn-1 {
    gap: 30px;
  }

  &.catalog {
    background-color: #292929;
    border-radius: 5px;
    gap: 14px;
    height: 35px;
    padding: 0px 10px;
  }

  &.menu-7 {
    background: linear-gradient(90deg, rgba(255, 226, 89, 1) 0%, rgba(255, 167, 81, 1) 100%);
    border-radius: 5px;
    gap: 14px;
    height: 35px;
    padding: 0px 10px;
  }

  & .about,
  & .features,
  & .pricing,
  & .gallery,
  & .team {
    font-size: 16px;
  }

  & .upper-small .about,
  & .upper-small .features,
  & .upper-small .pricing,
  & .upper-small .gallery,
  & .upper-small .team {
    font-size: 14px;
  }
`;

export const Menu = ({
  menu,
  aboutClassName,
  text = "About",
  text1 = "Features",
  text2 = "Pricing",
  text3 = "Gallery",
  text4 = "Team",
}) => {
  // Common conditions to reduce code repetition
  const isDefaultOrUpper = ["default", "upper-small", "upper"].includes(menu);
  const isCatalogOrMenu7 = ["catalog", "menu-7"].includes(menu);

  return (
    <>
      {isDefaultOrUpper || isCatalogOrMenu7 ? (
        <StyledMenu className={`menu ${menu}`}>
          {/* Menu for "default", "upper-small", "upper" */}
          {isDefaultOrUpper && (
            <>
              <div className={`about ${aboutClassName}`}>{menu === "default" ? text : "ABOUT"}</div>
              <div className="features">{menu === "default" ? text1 : "FEATURES"}</div>
              <div className="pricing">{menu === "default" ? text2 : "PRICING"}</div>
              <div className="gallery">{menu === "default" ? text3 : "GALLERY"}</div>
              <div className="team">{menu === "default" ? text4 : "TEAM"}</div>
            </>
          )}

          {/* Menu for "catalog", "menu-7" */}
          {isCatalogOrMenu7 && <div className="text-wrapper">MENU</div>}
        </StyledMenu>
      ) : null}
    </>
  );
};

Menu.propTypes = {
  menu: PropTypes.oneOf(["upper-small", "default", "menu-7", "catalog", "upper"]),
  text: PropTypes.string,
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
  aboutClassName: PropTypes.string,
};
