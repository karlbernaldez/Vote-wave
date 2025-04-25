// src/components/HeroSection.jsx

import React from 'react';
import styled from 'styled-components';
import bg from '../../assets/bg.png';

const HeroSectionContainer = styled.div`
  width: 100%;
  height: 900px;
  position: relative;

  @media (max-width: 1366px) {
    height: 700px;
  }


  @media (max-width: 768px) {
    height: 700px;
  }

  @media (max-width: 480px) {
    width: 90%;
    height: 12rem !important;
    margin: 1rem auto;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 1.5rem;
  }
`;


const BackgroundWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const BackgroundImage = styled.div`
  background-image: url(${bg});
  background-size: cover;
  background-position: center;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  
  @media (max-width: 768px) {
    background-size: cover;
    background-position: center;
  }

  @media (max-width: 480px) {
    background-size: cover;
  }
`;

const Gradient = styled.div`
  background: linear-gradient(
    270deg,
    rgba(10, 10, 10, 0) 0%,
    rgba(10, 10, 10, 0.2) 20%,
    rgba(10, 10, 10, 0.4) 40%,
    rgba(10, 10, 10, 0.6) 60%,
    rgba(10, 10, 10, 0.8) 80%,
    rgba(10, 10, 10, 1) 100%
  );
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;

  @media (max-width: 768px) {
    background: linear-gradient(
      180deg,
      rgba(10, 10, 10, 0) 0%,
      rgba(10, 10, 10, 0.2) 20%,
      rgba(10, 10, 10, 0.4) 40%,
      rgba(10, 10, 10, 0.6) 60%,
      rgba(10, 10, 10, 0.8) 80%,
      rgba(10, 10, 10, 1) 100%
    );
  }
`;

const ContentContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: absolute;
  top: 300px;
  left: 20px;
  right: 20px;
  width: auto;
  text-align: center;

  @media (max-width: 768px) {
    top: 200px;
  }

  @media (max-width: 480px) {
    top: 150px;
    left: 10px;
    right: 10px;
  }
`;

const Heading = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 650px;
  margin-left: 140px;

  @media (max-width: 1366px) {
    margin-left: 120px;
    margin-top: -8rem
  }

  @media (max-width: 1024px){
    margin-left: 60px;
  }

  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    align-items: center;
    text-align: center;
  }

  @media (max-width: 480px) {
    margin-top: -8rem;
    margin-left: 1rem;
    margin-right: auto;
    width: 75%;
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.p`
  color: #ffffff;
  font-family: 'Roboto-Bold', Helvetica;
  font-size: 60px;
  font-weight: 700;
  margin-top: -1px;
  line-height: normal;
  position: relative;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 42px;
    text-align: center;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    text-align: left;
    line-height: 1.5;
  }
`;

const Subtitle = styled.p`
  color: #b5b5b5;
  font-family: 'Roboto-Regular', Helvetica;
  font-size: 20px;
  font-weight: 400;
  line-height: normal;
  width: auto;
  margin: 0;
  margin-top: -50px;
  margin-bottom: 25px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 22px;
    margin-top: -30px;
    text-align: center;
    width: 95%;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    text-align: left;
    width: 85%;
    margin-left: -2.5rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  height: 43px;
  position: relative;
  width: auto;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    margin-top: -2rem;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: -11.2rem;
  }
`;

const Button = styled.button`
  background-color: ${({ primary }) => (primary ? '#008080' : 'transparent')};
  color: ${({ primary }) => (primary ? 'white' : '#008080')};
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 5px;
  border: ${({ primary }) => (primary ? 'none' : '2px solid #008080')};
  cursor: pointer;
  transition: background-color 0.3s ease, border 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:hover {
    background-color: ${({ primary }) => (primary ? '#0088cc' : '#e0f7f7')};
    border-color: #0088cc;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    padding: 24px 40px;
    width: 100%;
    height: 40px;
    margin: 5px 0;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 4px 14px;
    width: fit-content; /* ✅ Shrinks button width */
    height: 30px;
    margin: 5px 0;
    justify-content: flex-start; /* ✅ Align icon/text inside */
    align-items: center;
    text-align: left;
  }
`;

const LiveMapButton = styled(Button)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroSection = () => {
  return (
    <HeroSectionContainer>
      <BackgroundWrapper>
        <BackgroundImage alt="Background" src={bg} />
        <Gradient />
      </BackgroundWrapper>
      <ContentContainer>
        <Heading>
          <Title>Visualize Weather. Forecast with Precision.</Title>
          <Subtitle>
            Interactive tools for meteorologists, researchers, and enthusiasts.
          </Subtitle>
          <ButtonsContainer>
            <Button primary>Get Forecast</Button>
            <LiveMapButton>Live Map</LiveMapButton>
          </ButtonsContainer>
        </Heading>
      </ContentContainer>
    </HeroSectionContainer>
  );
};

export default HeroSection;