import React from "react";
import styled from "styled-components";
import comboChart from "../../assets/combo_chart.png";
import imageWaveWind from "../../assets/waveWindImage.png"; // Example image for waveWind
import imageWave from "../../assets/waveImage.png"; // Example image for wave
import imageColorImpaired from "../../assets/colorImpairedImage.png"; // Example image for colorImpaired

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; // Prevents vertical clipping
  min-height: 100%; // Allow content to grow
  width: 100%;
  padding: 1rem 0;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap when needed */
  justify-content: space-around; /* Distribute items evenly */
  width: 100%;
  max-width: 1099px; /* Set max-width */

  /* Add margin-top for mobile view */
  @media (max-width: 768px) {
    margin-top: -40px; /* Adjust the top margin to push the charts down */
  }
`;

const ChartBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  width: 45%; /* Default width for larger screens */

  /* Adjusting the left and top margins dynamically */
  left: ${(props) => props.left || 0}px;
  top: ${(props) => props.top || 0}px;

  /* Responsive Design */
  @media (max-width: 768px) {
    width: 100%; /* Stack 1 column on smaller screens */
    margin-bottom: 20px; /* Add some space between stacked blocks */
  }
`;


const ChartTitle = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  position: relative;
  margin-top: 20px;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 17px;
  background-color: #d9d9d9;
  width: 100%;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto; /* Maintain aspect ratio and prevent cropping */
  object-fit: contain; /* Ensure it fits inside the wrapper without cropping */
`;

const ChartBlock = ({ title, selected }) => {
  let imageSrc = imageWaveWind; // Default image

  // Conditionally change the image based on the selected option
  if (selected.wave) {
    imageSrc = imageWave;
  } else if (selected.colorImpaired) {
    imageSrc = imageColorImpaired;
  }

  return (
    <ChartBlockWrapper>
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
        <ChartBlock title="12-h Prognostic Wave Chart" selected={selected} />
        <ChartBlock title="24-h Prognostic Wave Chart" selected={selected} />
        <ChartBlock title="36-h Prognostic Wave Chart" selected={selected} />
        <ChartBlock title="48-h Prognostic Wave Chart" selected={selected} />
      </ChartContainer>
    </Wrapper>
  );
};
