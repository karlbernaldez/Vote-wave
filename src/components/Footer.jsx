import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Copyright from "../assets/Copyright.svg";
import Facebook from "../assets/Facebook.svg";
import Instagram from "../assets/Instagram.png";
import Linkedin from "../assets/Linkedin.png";
import Twitter from "../assets/Twitter.svg";
import { PagasaLogo } from "./Logo";
import line1 from "../assets/line1.png";

const FooterContainer = styled.footer`
  background-color: rgb(207, 207, 207);
  width: 100%;
  padding: 2rem 1rem;
  box-sizing: border-box;

`;

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;

  @media (max-width: 820px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SocialContainer = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 820px) {
    text-align: center;
    align-items: center;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  justify-content: center;  /* Default: center alignment */
  
  @media (min-width: 821px) {
    justify-content: flex-start;  /* Align to left on desktop */
  }
`;

const PagasaWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PagasaText = styled.div`
  color: #01b0ef;
  font-family: "Roboto-Medium", Helvetica;
  font-size: 1.8rem;
  font-weight: 500;
`;

const TextWrapper = styled.p`
  color: #000;
  font-family: "Roboto-Regular", Helvetica;
  font-size: 0.875rem;
  max-width: 400px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;  /* Default: center alignment */
  
  @media (min-width: 821px) {
    justify-content: flex-start;  /* Align to left on desktop */
  }
  
  @media (max-width: 821px) {
    margin-top: -.5rem;
  }
`;

const LineImage = styled.img`
  width: 100%;
  height: 1px;
  margin: 2rem 0;
  object-fit: cover;

  @media (max-width: 821px) {
    margin-bottom: 1rem;
  }

`;

const RightsReservedContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
`;

const RightsText = styled.p`
  color: #000;
  font-family: "Baloo 2-Medium", Helvetica;
  font-size: 0.75rem;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;
  flex: 2;
  min-width: 250px;

  @media (min-width: 877px) and (max-width: 900px) {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-between;
    flex: 2;
    min-width: 250px;
  }

  @media (min-width: 853px) and (max-width: 876px) {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    flex: 2;
    min-width: 250px;
  }

  @media (min-width: 848px) and (max-width: 852px) {
    display: flex;
    flex-wrap: wrap;
    gap: .9rem;
    justify-content: space-between;
    flex: 2;
    min-width: 250px;
  }

  @media (min-width: 821px) and (max-width: 847px) {
    display: flex;
    flex-wrap: wrap;
    gap: .3rem;
    justify-content: space-between;
    flex: 2;
    min-width: 250px;
    margin-left: 30px;
  }

  @media (max-width: 820px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    margin-top: -3rem;
  }
`;

const FrameTwo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
  text-align: left;

  @media (min-width: 821px) and (max-width: 847px) {
    margin-right: -2rem;
  }

  @media (max-width: 820px) {
    text-align: center;
    min-width: 200px;
  }
    
`;

const FrameThree = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const StyledLink = styled.a`
  font-family: "Roboto-Light", Helvetica;
  font-size: 1rem;
  color: #000;
  text-align: left;
  text-decoration: none;

  &:hover {
    color: #01b0ef;
    text-decoration: underline;
  }

  @media (min-width: 821px) and (max-width: 847px) {
    font-size: 0.8rem;
  }

  @media (max-width: 820px) {
    text-align: center;
  }
`;

const FrameFour = styled(FrameTwo)`
  @media (min-width: 821px) and (max-width: 847px) {
    margin-left: -2.5rem;
  }
`;

const LinksTitle = styled.div`
  font-family: "Roboto-Medium", Helvetica;
  font-size: 1.125rem;
  color: #000;
  text-align: left;

  @media (min-width: 821px) and (max-width: 847px) {
    font-size: 1rem;
  }

  @media (max-width: 820px) {
    text-align: center;
  }
`;

const PagesTitle = styled.div`
  font-family: "Baloo 2-Bold", Helvetica;
  font-size: 1rem;
  color: #000;
  text-align: left;

  @media (min-width: 821px) and (max-width: 847px) {
    font-size: 1rem;
  }

  @media (max-width: 820px) {
    text-align: center;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FlexRow>
        <SocialContainer>
          <TextContainer>
            <a
              href="https://www.pagasa.dost.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <LogoContainer>
                <PagasaLogo />
                <PagasaWrapper>
                  <PagasaText>PAGASA</PagasaText>
                </PagasaWrapper>
              </LogoContainer>
            </a>
            <TextWrapper>
              Welcome to PAGASA, we are the nation's trusted source for accurate weather forecasts,
              climate information, and astronomical services dedicated to safeguarding lives,
              livelihoods, and the future of our communities.
            </TextWrapper>
            <IconContainer>
              <a href="https://www.facebook.com/PAGASA.DOST.GOV.PH" target="_blank" rel="noopener noreferrer">
                <img src={Facebook} alt="Facebook" />
              </a>
              <a href="https://x.com/dost_pagasa" target="_blank" rel="noopener noreferrer">
                <img src={Twitter} alt="Twitter" />
              </a>
              <a href="https://www.instagram.com/pagasa_dost/" target="_blank" rel="noopener noreferrer">
                <img src={Instagram} alt="Instagram" />
              </a>
              <a href="https://www.linkedin.com/company/dost-pagasa" target="_blank" rel="noopener noreferrer">
                <img src={Linkedin} alt="Linkedin" />
              </a>
            </IconContainer>
          </TextContainer>
        </SocialContainer>

        <LinksContainer>
          <FrameTwo>
            <LinksTitle>Government Links</LinksTitle>
            <FrameThree>
              <StyledLink href="https://president.gov.ph/" target="_blank" rel="noopener noreferrer">Office of the President</StyledLink>
              <StyledLink href="https://ovp.gov.ph" target="_blank" rel="noopener noreferrer">Office of the Vice President</StyledLink>
              <StyledLink href="https://senate.gov.ph" target="_blank" rel="noopener noreferrer">Senate of the Philippines</StyledLink>
              <StyledLink href="https://congress.gov.ph" target="_blank" rel="noopener noreferrer">House of Representatives</StyledLink>
              <StyledLink href="https://sc.judiciary.gov.ph" target="_blank" rel="noopener noreferrer">Supreme Court</StyledLink>
              <StyledLink href="https://ca.judiciary.gov.ph" target="_blank" rel="noopener noreferrer">Court of Appeals</StyledLink>
              <StyledLink href="https://sb.judiciary.gov.ph" target="_blank" rel="noopener noreferrer">Sandiganbayan</StyledLink>
            </FrameThree>
          </FrameTwo>
          <FrameTwo>
            <LinksTitle>GOV.PH</LinksTitle>
            <FrameThree>
              <StyledLink href="https://data.gov.ph" target="_blank" rel="noopener noreferrer">
                Open Data Portal
              </StyledLink>
              <StyledLink href="https://www.officialgazette.gov.ph" target="_blank" rel="noopener noreferrer">
                Official Gazette
              </StyledLink>
            </FrameThree>
          </FrameTwo>
          <FrameFour>
            <PagesTitle>Pages</PagesTitle>
            <a
              href="https://www.panahon.gov.ph/"
              style={{ textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StyledLink>Hydro-Met</StyledLink>
            </a>
            <a
              href="https://hazardhunter.georisk.gov.ph/map"
              style={{ textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StyledLink>Hazard Map</StyledLink>
            </a>
            <a href="/" style={{ textDecoration: 'none' }}>
              <StyledLink>Wave</StyledLink>
            </a>
            <a
              href="/services"
              style={{ textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StyledLink>Services</StyledLink>
            </a>
            <a
              href="/blog"
              style={{ textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StyledLink>Blog</StyledLink>
            </a>
          </FrameFour>
        </LinksContainer>
      </FlexRow>

      <LineImage src={line1} alt="Separator line" />

      <RightsReservedContainer>
        <img src={Copyright} alt="Copyright symbol" />
        <RightsText>
          2025 Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA).
          All rights reserved.
        </RightsText>
      </RightsReservedContainer>
    </FooterContainer>
  );
};

export default Footer;
