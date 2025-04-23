import React from "react";
import styled from "styled-components";

import satelliteImg from "../../assets/features_cover_images/satellite.png";
import radarImg from "../../assets/features_cover_images/radar.png";
import precipitationImg from "../../assets/features_cover_images/precipitation.png";
import lightningImg from "../../assets/features_cover_images/lightning.png";
import uvImg from "../../assets/features_cover_images/uv.png";
import tempImg from "../../assets/features_cover_images/temp.png";

const features = [
  { title: "Satellite", img: satelliteImg },
  { title: "Radar", img: radarImg },
  { title: "Precipitation", img: precipitationImg },
  { title: "Lightning", img: lightningImg },
  { title: "UV Index", img: uvImg },
  { title: "Temperature", img: tempImg },
];

const StyledFeature = styled.section`
  width: 100%;
  max-width: 1280px;
  padding: 40px 20px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 32px 16px; 
  }

  @media (max-width: 480px) {
    padding: 24px 12px;
  }
`;


const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }

  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-family: "Roboto-Regular", Helvetica, sans-serif;
  color: #000;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 26px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  font-family: "Roboto-LightItalic", Helvetica, sans-serif;
  color: #000;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0px 4px 4px #00000040;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

const FeatureImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 280px;
  object-fit: contain;
  border-radius: 12px;

  @media (max-width: 768px) {
    max-height: 240px;
  }

  @media (max-width: 480px) {
    max-height: 200px;
  }
`;

const FeatureTitle = styled.div`
  font-size: 24px;
  font-family: "Roboto-Light", Helvetica, sans-serif;
  font-weight: 300;
  letter-spacing: 2px;
  color: #000;
  text-align: center;
  margin-top: 16px;

  @media (max-width: 768px) {
    font-size: 18px;
    letter-spacing: 1.2px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    letter-spacing: 1px;
  }
`;

const Feature = () => {
  return (
    <StyledFeature>
      <Header>
        <Title>Weather Graphs</Title>
        <Subtitle>Providing accurate, real-time weather data for the Filipino people.</Subtitle>
      </Header>
      <FeatureGrid>
        {features.map(({ title, img }, index) => (
          <Card key={`${title}-${index}`}>
            <FeatureImage src={img} alt={title} />
            <FeatureTitle>{title}</FeatureTitle>
          </Card>
        ))}
      </FeatureGrid>
    </StyledFeature>
  );
};

export default Feature;
