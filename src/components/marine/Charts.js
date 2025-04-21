import React from "react";
import styled from "styled-components";
import comboChart from "../../assets/combo_chart.png";
import imageWaveWind from "../../assets/waveWindImage.png"; // Example image for waveWind
import imageWave from "../../assets/waveImage.png"; // Example image for wave
import imageColorImpaired from "../../assets/colorImpairedImage.png"; // Example image for colorImpaired

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Or adjust depending on your use case */
`;

const ChartContainer = styled.div`
  height: 1064px;
  position: relative;
  width: 1099px;
`;

const ChartBlockWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  width: 505px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
`;

const ChartTitle = styled.div`
  align-items: flex-end;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 2px;
  position: relative;
`;

const ComboChart = styled.img`
  height: 26px;
  position: relative;
  width: 26px;
  top: -6px;
`;

const TextWrapper = styled.div`
  color: #008ec1;
  font-family: "Roboto-Regular", Helvetica;
  font-size: 16px;
  font-weight: 400;
  height: 26px;
  width: 250px;
`;

const ChartImage = styled.div`
  align-items: flex-start;
  align-self: stretch;
  background-color: #d9d9d9;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 435px;
  padding: 20px 17px;
  width: 93%;
`;

const Image = styled.img`
  height: 429px;
  object-fit: cover;
  width: 470px;
`;

const ChartBlock = ({ title, left, top, selected }) => {
  let imageSrc = imageWaveWind; // Default image

  // Conditionally change the image based on the selected option
  if (selected.wave) {
    imageSrc = imageWave;
  } else if (selected.colorImpaired) {
    imageSrc = imageColorImpaired;
  }

  return (
    <ChartBlockWrapper left={left} top={top}>
      <ChartTitle>
        <ComboChart alt="Combo chart" src={comboChart} />
        <TextWrapper>{title}</TextWrapper>
      </ChartTitle>
      <ChartImage>
        <Image alt="Chart" src={imageSrc} />
      </ChartImage>
    </ChartBlockWrapper>
  );
};

export const Charts = ({ selected }) => {
  return (
    <Wrapper>
      <ChartContainer>
        <ChartBlock title="12-h Prognostic Wave Chart" left={28} top={0} selected={selected} />
        <ChartBlock title="24-h Prognostic Wave Chart" left={565} top={0} selected={selected} />
        <ChartBlock title="36-h Prognostic Wave Chart" left={28} top={532} selected={selected} />
        <ChartBlock title="48-h Prognostic Wave Chart" left={565} top={532} selected={selected} />
      </ChartContainer>
    </Wrapper>
  );
};
