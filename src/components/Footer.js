import React from "react";
import styled from "styled-components";
import Copyright from "../assets/Copyright.svg";
import Facebook from "../assets/Facebook.svg";
import Instagram from "../assets/Instagram.png";
import Linkedin from "../assets/Linkedin.png";
import Twitter from "../assets/Twitter.svg";
import { PagasaLogo } from "./Logo"
import line1 from "../assets/line1.png";

const FooterContainer = styled.footer`
  background-color:rgb(207, 207, 207);
  height: 325px;
  position: relative;
  width: 100%;
`;


const SocialContainer = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex-direction: column;
  gap: 18px;
  left: 109px;
  position: absolute;
  top: 48px;
`;

const TextContainer = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

const LogoContainer = styled.div`
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 11px;
  position: relative;
`;

const Frame = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 10px;
  position: relative;
`;

const PagasaWrapper = styled.div`
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 10px;
  justify-content: center;
  position: relative;
`;

const PagasaText = styled.div`
  color: #01b0ef;
  font-family: "Roboto-Medium", Helvetica;
  font-size: 33px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: normal;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
`;

const TextWrapper = styled.p`
  color: #000000;
  font-family: "Roboto-Regular", Helvetica;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  position: relative;
  width: 345px;
`;

const IconContainer = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 18px;
  position: relative;
`;

const LineImage = styled.img`
  height: 1px;
  left: 100px;
  object-fit: cover;
  position: absolute;
  top: 257px;
  width: 90%;
`;

const RightsReservedContainer = styled.div`
  align-items: center;
  display: inline-flex;
  gap: 3px;
  justify-content: center;
  left: 660px;
  position: absolute;
  top: 275px;
`;

const RightsText = styled.p`
  color: #000000;
  font-family: "Baloo 2-Medium", Helvetica;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: normal;
  position: relative;
  width: 648px;
`;

const LinksContainer = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 100px;
  right: 10px;
  position: absolute;
  top: 49px;
  width: 733px;
`;

const FrameTwo = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  position: relative;
`;

const LinksTitle = styled.div`
  color: #000000;
  font-family: "Roboto-Medium", Helvetica;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 26px;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
`;

const FrameThree = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 4px;
  position: relative;
`;

const LinkText = styled.div`
  color: #000000;
  font-family: "Roboto-Light", Helvetica;
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 0;
  line-height: normal;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
`;

const FrameFour = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const PagesTitle = styled.div`
  color: #000000;
  font-family: "Baloo 2-Bold", Helvetica;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 26px;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
`;

const PageLinkText = styled.div`
  color: #000000;
  font-family: "Baloo 2-Medium", Helvetica;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: normal;
  position: relative;
  width: fit-content;
`;

const Footer = () => {
    return (
        <FooterContainer>
            <SocialContainer>
                <TextContainer>
                    <LogoContainer>
                        <Frame>
                            <PagasaLogo />
                        </Frame>
                        <PagasaWrapper>
                            <PagasaText>PAGASA</PagasaText>
                        </PagasaWrapper>
                    </LogoContainer>
                    <TextWrapper>
                        Welcome to PAGASA, we are the nation&apos;s trusted source for
                        accurate weather forecasts, climate information, and astronomical
                        services dedicated to safeguarding lives, livelihoods, and the
                        future of our communities.
                    </TextWrapper>
                </TextContainer>
                <IconContainer>
                    <img src={Facebook} alt="Facebook" className="icon-instance-node" />
                    <img src={Twitter} alt="Twitter" className="icon-instance-node" />
                    <img src={Instagram} alt="Instagram" className="icon-instance-node" />
                    <img src={Linkedin} alt="Linkedin" className="icon-instance-node" />
                </IconContainer>
            </SocialContainer>
            <LineImage alt="Line" src={line1} />
            <RightsReservedContainer>
                <img src={Copyright} alt="Copyright" className="copyright-instance" />
                <RightsText>
                    2025 Philippine Atmospheric, Geophysical and Astronomical Services
                    Administration (PAGASA). All rights reserved.
                </RightsText>
            </RightsReservedContainer>
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
                        <LinkText>Official Gazzette</LinkText>
                    </FrameThree>
                </FrameTwo>
                <FrameFour>
                    <PagesTitle>Pages</PagesTitle>
                    <PageLinkText>About Us</PageLinkText>
                    <PageLinkText>Shop</PageLinkText>
                    <PageLinkText>Contact Us</PageLinkText>
                    <PageLinkText>
                        Services
                        <br />
                        Blog
                    </PageLinkText>
                </FrameFour>
            </LinksContainer>
        </FooterContainer>
    );
};

export default Footer;