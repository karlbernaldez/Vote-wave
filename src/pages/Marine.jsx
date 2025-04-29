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
  background-color: ${({ theme }) => theme.mainColors.blue};
  height: 52px;
  width: 100%;
  max-width: 1200px;
  margin-top: ${({ theme }) => theme.spacing.medium};
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  @media (max-width: 768px) {
    border-radius: ${({ theme }) => theme.borderRadius.medium};
  }
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
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
`;

// OPTIONS BAR
const ChartStyles = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.xsmall};
    padding: 0 0.5rem;
  }
`;

const OptionBox = styled.div`
  height: 36px;
  padding: 0 1rem;
  min-width: 100px;
  background-color: ${({ active, theme }) =>
    active ? theme.mainColors.blue : 'transparent'};
  color: ${({ active, theme }) =>
    active ? theme.colors.textPrimary : theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.light};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.xsmall};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.highlight};
    color: ${({ theme }) => theme.colors.textPrimary};
    transform: translateY(-3px) scale(1.05); /* lift and zoom */
    box-shadow: 0 8px 20px rgba(1, 176, 239, 0.4); /* soft colored glow */
  }

  @media (max-width: 768px) {
    min-width: 90px;
    font-size: ${({ theme }) => theme.fontSizes.small};
    padding: 0 0.75rem;
  }

  @media (max-width: 480px) {
    min-width: 80px;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    padding: 0 0.5rem;
  }
`;

// CHART + LEGEND
const Line = styled.img`
  width: 100%;
  max-width: 1200px;
  height: 1px;
  margin-top: ${({ theme }) => theme.spacing.small};
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
    padding-top: 2rem;
    margin-right: 1rem;
  }
`;

const Legend = styled.div`
  background-color: ${({ theme }) => theme.mainColors.blue};
  margin-top: 2rem;
  width: 100%;
  max-width: 1200px;
  min-height: 200px;
  padding: 1rem;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.light};
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
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
