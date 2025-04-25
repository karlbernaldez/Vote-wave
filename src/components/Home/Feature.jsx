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
    align-items: flex-start;
    text-align: left;
    margin-bottom: 30px;
    padding-left: 1rem;
    width: 100%;
    margin-top: -2rem;
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
    font-size: 20px;
    font-weight: 400;
    color: white;
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
    display: none;
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
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 12px;
    padding: 8px 0;
    margin-top: -2rem;
    margin-left: 0.5rem;

    /* Hide scrollbar for Webkit browsers */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for Firefox */
    scrollbar-width: none;

    /* Hide scrollbar for IE and Edge */
    -ms-overflow-style: none;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow: hidden;
  scroll-snap-align: start;
  min-width: 180px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    margin-right: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: none;
    padding: 0;
    min-width: 200px;
  }
`;


const FeatureImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 12px;

  @media (max-width: 768px) {
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    height: 260px;
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
    display: none;
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