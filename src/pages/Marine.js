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
  margin-top: 40px;
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
    background-color:rgb(0, 118, 161);
    color: #ffffff;
  }
`;

const Line = styled.img`
  height: 1px;
  width: 1200px;
  object-fit: cover;
  margin-top: 0px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ChartWrapper = styled.div`
  max-width: 80%;
  /* Removed max-height and overflow properties */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px; /* push below title and line */
`;

const Legend = styled.div`
  background-color: #01b0ef;
  margin-top: 50px;
  height: 252px;
  width: 1050px;
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
    <>
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

          <Legend/>

        </ContentWrapper>

      </MarineContainer>
    </>
  );
};

export default Marine;
