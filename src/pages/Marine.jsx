import React, { useState } from "react";
import styled from "styled-components";
import { Charts } from '../components/marine/Charts';
import line1 from "../assets/Line.png";
import wave from "../assets/wave.png";

// CONTAINER
const MarineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
`;

// TITLE SECTION
const TitleWrapper = styled.div`
  background-color: #01b0ef;
  height: 52px;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-sizing: border-box;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Img = styled.img`
  height: 25px;
  width: 25px;
`;

const TextWrapper = styled.div`
  color: #fff;
  font-family: "Roboto-Medium", Helvetica, sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
  white-space: nowrap;
`;

// OPTIONS BAR
const ChartStyles = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 10px;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 8px;
    padding: 0 0.5rem;
  }
`;

const OptionBox = styled.div`
  height: 36px;
  padding: 0 1rem;
  min-width: 100px;
  background-color: ${({ active }) => (active ? "#01b0ef" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  font-family: "Roboto-Light", Helvetica, sans-serif;
  font-size: 1rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgb(0, 118, 161);
    color: #fff;
  }

  @media (max-width: 768px) {
    min-width: 90px;
    font-size: 0.9rem;
    padding: 0 0.75rem;
  }

  @media (max-width: 480px) {
    min-width: 80px;
    font-size: 0.85rem;
    padding: 0 0.5rem;
  }
`;

// CHART + LEGEND
const Line = styled.img`
  width: 100%;
  max-width: 1200px;
  height: 1px;
  margin-top: 10px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 2rem 1rem 0 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    width: 100%;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    padding-top: 3rem;
  }
`;

const Legend = styled.div`
  background-color: #01b0ef;
  margin-top: 2rem;
  width: 100%;
  max-width: 1200px;
  height: auto;
  min-height: 200px;
  padding: 1rem;
  box-sizing: border-box;
  color: white;
  text-align: center;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.75rem;
  }
`;

const Marine = () => {
  const [selected, setSelected] = useState({
    waveWind: true,
    wave: false,
    colorImpaired: false,
  });

  const toggleSelection = (key) => {
    setSelected({
      waveWind: false,
      wave: false,
      colorImpaired: false,
      [key]: true,
    });
  };

  return (
    <MarineContainer>
      <TitleWrapper>
        <Title>
          <Img src={wave} alt="Wave icon" />
          <TextWrapper>Wave Chart</TextWrapper>
        </Title>
      </TitleWrapper>

      <ChartStyles>
        <OptionBox active={selected.waveWind} onClick={() => toggleSelection("waveWind")}>
          Wave & Wind
        </OptionBox>
        <OptionBox active={selected.wave} onClick={() => toggleSelection("wave")}>
          Wave
        </OptionBox>
        <OptionBox active={selected.colorImpaired} onClick={() => toggleSelection("colorImpaired")}>
          For Color Impaired
        </OptionBox>
      </ChartStyles>

      <Line src={line1} alt="Separator" />

      <ChartWrapper>
        <div style={{ width: '100%' }}>
          <Charts selected={selected} />
        </div>
        <Legend>THIS IS FOR THE LEGEND OF CHART</Legend>
      </ChartWrapper>
    </MarineContainer>
  );
};

export default Marine;
