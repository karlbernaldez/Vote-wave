import React, { useState } from "react";
import styled from "styled-components";
import { Charts } from '../components/marine/Charts';
import line1 from "../assets/Line.png";
import wave from "../assets/wave.png";


const MarineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TitleWrapper = styled.div`
  background-color: #01b0ef;
  height: 52px;
  top: 80px;
  width: 63%;
  z-index: 1;
`;

const Img = styled.img`
  height: 25px;
  object-fit: cover;
  position: relative;
  width: 25px;
`;

const TextWrapper = styled.div`
  color: #ffffff;
  font-family: "Roboto-Medium", Helvetica;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: normal;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
`;

const Title = styled.div`
  align-items: flex-start;
  display: inline-flex;
  gap: 5px;
  left: 70px;
  position: relative;
  top: 12px;
`;

const ChartStyles = styled.div`
  display: flex;
  justify-content: center; /* Start by centering the buttons */
  width: 100%;
  padding: 0 10%; /* Add padding on both sides to avoid sticking to the edges */
  margin-top: 20px; /* Increased margin-top to move the chart lower */

  /* Responsive Design */
  @media (max-width: 1200px) {
    padding: 0 5%; /* Reduce the padding for smaller screens */
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack the options vertically */
    align-items: center;
    margin-top: 30px; /* Adjust margin-top for smaller screens */
    padding: 0 10%; /* Ensure some space on smaller screens */
  }
`;

const OptionBox = styled.div`
  height: 32px;
  width: ${(props) => props.width || "120px"};
  background-color: ${(props) => (props.active ? "#01b0ef" : "transparent")};
  color: ${(props) => (props.active ? "#ffffff" : "#000000")};
  font-family: "Roboto-Light", Helvetica;
  font-size: 16px;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: rgb(0, 118, 161);
    color: #ffffff;
  }
`;

const Line = styled.img`
  height: 1px;
  width: 100%; /* Make sure the width is fluid and takes the full container width */
  object-fit: cover;
  margin-top: 0px;

  /* Responsive Design */
  @media (max-width: 1200px) {
    width: 100%; /* Ensure the line takes full width on smaller screens */
  }

  /* Optional: Set a max-width for larger screens to keep the line from becoming too wide */
  @media (min-width: 1201px) {
    max-width: 1200px; /* Prevent it from becoming too wide on large screens */
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ChartWrapper = styled.div`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px; /* push below title and line */

  /* Responsive Design */
  @media (max-width: 1200px) {
    max-width: 100%; /* Make the chart container take full width on smaller screens */
    margin-top: 30px;
  }
`;

const Legend = styled.div`
  background-color: #01b0ef;
  margin-top: 50px;
  height: 252px;
  width: 1050px;

  /* Responsive Design */
  @media (max-width: 1200px) {
    width: 90%; /* Adjust width for smaller screens */
  }

  @media (max-width: 768px) {
    width: 100%; /* Full width on mobile screens */
    height: 200px; /* Adjust height on smaller screens */
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
          <Img alt="Wave" src={wave} />
          <TextWrapper>Wave Chart</TextWrapper>
        </Title>
      </TitleWrapper>

      <ChartStyles>
        <OptionBox
          width="120px"
          active={selected.waveWind}
          onClick={() => toggleSelection("waveWind")}
        >
          Wave & Wind
        </OptionBox>
        <OptionBox
          width="100px"
          active={selected.wave}
          onClick={() => toggleSelection("wave")}
        >
          Wave
        </OptionBox>
        <OptionBox
          width="145px"
          active={selected.colorImpaired}
          onClick={() => toggleSelection("colorImpaired")}
        >
          For Color Impaired
        </OptionBox>
      </ChartStyles>

      <Line alt="Line" src={line1} />

      <ContentWrapper>
        <ChartWrapper>
          <div style={{ marginTop: "50px" }}>
            <Charts selected={selected} />
          </div>
        </ChartWrapper>

        <Legend>THIS IS FOR THE LEGEND OF CHART</Legend>
      </ContentWrapper>
    </MarineContainer>
  );
};

export default Marine;
