import React from "react";
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

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
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
  justify-content: center;
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
  justify-content: center;
`;

const LineImage = styled.img`
  width: 100%;
  height: 1px;
  margin: 2rem 0;
  object-fit: cover;
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

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
`;

const FrameTwo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
    min-width: 200px;
  }
`;

const FrameThree = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const FrameFour = styled(FrameTwo)``;

const LinksTitle = styled.div`
  font-family: "Roboto-Medium", Helvetica;
  font-size: 1.125rem;
  color: #000;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const LinkText = styled.div`
  font-family: "Roboto-Light", Helvetica;
  font-size: 1rem;
  color: #000;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const PagesTitle = styled.div`
  font-family: "Baloo 2-Bold", Helvetica;
  font-size: 1rem;
  color: #000;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const PageLinkText = styled.div`
  font-family: "Baloo 2-Medium", Helvetica;
  font-size: 1rem;
  color: #000;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FlexRow>
        <SocialContainer>
          <TextContainer>
            <LogoContainer>
              <PagasaLogo />
              <PagasaWrapper>
                <PagasaText>PAGASA</PagasaText>
              </PagasaWrapper>
            </LogoContainer>
            <TextWrapper>
              Welcome to PAGASA, we are the nation's trusted source for accurate weather forecasts,
              climate information, and astronomical services dedicated to safeguarding lives,
              livelihoods, and the future of our communities.
            </TextWrapper>
            <IconContainer>
              <img src={Facebook} alt="Facebook" />
              <img src={Twitter} alt="Twitter" />
              <img src={Instagram} alt="Instagram" />
              <img src={Linkedin} alt="Linkedin" />
            </IconContainer>
          </TextContainer>
        </SocialContainer>

        <LinksContainer>
          <FrameTwo>
            <LinksTitle>Government Links</LinksTitle>
            <FrameThree>
              <LinkText>Office of the President</LinkText>
              <LinkText>Office of the Vice President</LinkText>
              <LinkText>Senate of the Philippines</LinkText>
              <LinkText>House of Representatives</LinkText>
              <LinkText>Supreme Court</LinkText>
              <LinkText>Court of Appeals</LinkText>
              <LinkText>Sandiganbayan</LinkText>
            </FrameThree>
          </FrameTwo>
          <FrameTwo>
            <LinksTitle>GOV.PH</LinksTitle>
            <FrameThree>
              <LinkText>Open Data Portal</LinkText>
              <LinkText>Official Gazette</LinkText>
            </FrameThree>
          </FrameTwo>
          <FrameFour>
            <PagesTitle>Pages</PagesTitle>
            <PageLinkText>About Us</PageLinkText>
            <PageLinkText>Shop</PageLinkText>
            <PageLinkText>Contact Us</PageLinkText>
            <PageLinkText>Services</PageLinkText>
            <PageLinkText>Blog</PageLinkText>
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
