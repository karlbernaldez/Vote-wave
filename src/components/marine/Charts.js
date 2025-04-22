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
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap when needed */
  justify-content: space-around; /* Distribute items evenly */
  width: 100%;
  max-width: 1099px; /* Set max-width */

  /* Add margin-top for mobile view */
  @media (max-width: 768px) {
    margin-top: 1100px; /* Adjust the top margin to push the charts down */
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
  height: 435px;
  padding: 20px 17px;
  background-color: #d9d9d9;
  width: 100%; /* Adjust width to be fluid */
`;

const Image = styled.img`
  height: 429px;
  object-fit: cover;
  width: 100%; /* Ensure the image takes up full width of the container */
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
