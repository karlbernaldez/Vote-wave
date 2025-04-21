import React, { useState } from "react";
import styled from "styled-components";
import { Charts } from '../components/marine/Charts';
import line1 from "../assets/Line.png";
import wave from "../assets/wave.png";

const MarineContainer = styled.div`
  background-color: #e8e8e8;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  overflow: auto; /* Make the container scrollable */
  height: 100vh; /* Ensure full height for scrolling */
`;

const Div2 = styled.div`
  background-color: #e8e8e8;
  height: 2296px;
  overflow: hidden;
  position: relative;
  width: 1280px;
  display: flex;
  justify-content: center;
`;

const Footer = styled.img`
  height: 325px;
  left: 0;
  position: absolute;
  top: 1971px;
  width: 1280px;
`;

const OverlapGroup = styled.div`
  height: 1200px;
  left: 0;
  position: absolute;
  top: 133px;
  width: 1280px;
`;

const Line = styled.img`
  height: 1px;
  object-fit: cover;
  position: absolute;
  top: 67px;
  width: 1100px;
  left: 50%;
  transform: translateX(-50%);
`;

const TitleWrapper = styled.div`
  background-color: #01b0ef;
  height: 52px;
  left: 0;
  position: absolute;
  top: 81px;
  width: 100%;
`;

const Title = styled.div`
  align-items: flex-start;
  display: inline-flex;
  gap: 5px;
  left: 101px;
  position: relative;
  top: 12px;
`;

const Img = styled.img`
  height: 25px;
  object-fit: cover;
  position: relative;
  width: 25px;
`;

const TextWrapper6 = styled.div`
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

const Legend = styled.div`
  background-color: #01b0ef;
  height: 252px;
  left: 0;
  position: absolute;
  top: 1348px;
  width: 1282px;
`;

const LegendOption = styled.div`
  align-items: center;
  display: inline-flex;
  position: relative;
  top: 35px;
  left: 120px;
  gap: 20px;
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
            <Div2>
                <TitleWrapper>
                    <Title>
                        <Img alt="Wave" src={wave} />
                        <TextWrapper6>Wave Chart</TextWrapper6>
                    </Title>
                </TitleWrapper>

                <OverlapGroup>
                    <LegendOption>
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
                    </LegendOption>

                    <Line alt="Line" src={line1} />

                    {/* Wrapper to ensure Charts appears below the line */}
                    <div style={{ marginTop: "100px" }}>
                        <Charts selected={selected} />
                    </div>
                </OverlapGroup>

                <Legend />
            </Div2>
        </MarineContainer>
    );
};

export default Marine;
