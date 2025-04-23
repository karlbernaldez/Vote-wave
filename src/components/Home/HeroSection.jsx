// src/components/HeroSection.jsx

import React from 'react';
import styled from 'styled-components';
import bg from '../../assets/bg.png';

const HeroSectionContainer = styled.div`
  height: 900px;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    height: 600px;
  }

  @media (max-width: 480px) {
    height: 500px;
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

  @media (max-width: 768px) {
    margin-left: 40px;
    width: 90%;
  }

  @media (max-width: 480px) {
    margin-left: 20px;
    width: 90%;
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
    font-size: 30px;
  }

  @media (max-width: 480px) {
    font-size: 30px;
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
  text-align: left;
  margin-top: -50px;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-top: -30px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-top: -30px;
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
    gap: 10px;
    flex-direction: column;
    align-items: center;
    margin-top: -10px;
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
  height: auto;
  line-height: normal;

  &:hover {
    background-color: ${({ primary }) => (primary ? '#0088cc' : '#e0f7f7')};
    border-color: #0088cc;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 18px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 1px 2px;
    width: 100%;
    height: 40px;
    margin: 5px 0;
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
            <Button primary>Get Started</Button>
            <Button>Live Map</Button>
          </ButtonsContainer>
        </Heading>
      </ContentContainer>
    </HeroSectionContainer>
  );
};

export default HeroSection;
