import React, { useState } from "react";
import { Charts } from "../components/Marine/Charts";
import { toggleSelection } from "../components/Marine/toggleSelection"; // Import the function
import OptionBox from "../components/Marine/OptionBox"; // Import OptionBox
import line1 from "../assets/Line.png";
import wave from "../assets/wave.png";
import { MarineContainer, TitleWrapper, Title, Img, TextWrapper, ChartStyles, Line, ChartWrapper, Legend } from "../components/Marine/MarineStyle"; // Import styles

const Marine = () => {
  const [selected, setSelected] = useState({
    waveWind: true,
    wave: false,
    colorImpaired: false,
  });

  return (
    <MarineContainer>
      <TitleWrapper>
        <Title>
          <Img src={wave} alt="Wave icon" />
          <TextWrapper>Wave Chart</TextWrapper>
        </Title>
      </TitleWrapper>

      <ChartStyles>
        <OptionBox
          active={selected.waveWind}
          onClick={() => toggleSelection(setSelected, "waveWind")}
        >
          Wave & Wind
        </OptionBox>
        <OptionBox
          active={selected.wave}
          onClick={() => toggleSelection(setSelected, "wave")}
        >
          Wave
        </OptionBox>
        <OptionBox
          active={selected.colorImpaired}
          onClick={() => toggleSelection(setSelected, "colorImpaired")}
        >
          For Color Impaired
        </OptionBox>
      </ChartStyles>

      <Line src={line1} alt="Separator" />

      <ChartWrapper>
        <div style={{ width: "100%" }}>
          <Charts selected={selected} />
        </div>
        <Legend>THIS IS FOR THE LEGEND OF CHART</Legend>
      </ChartWrapper>
    </MarineContainer>
  );
};

export default Marine;
