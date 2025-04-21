import React, { useState, useRef } from "react";
import Header from '../components/Header';
import MapComponent from "../components/MapComponent";
import LayerPanel from "../components/LayerPanel";
import styled from "@emotion/styled";

// Ensure body/html is also 100% height in your global CSS (important!)
const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
`;

const MapWrapper = styled.div`
  flex-grow: 1;
  width: ${({ collapsed }) => (collapsed ? "100vw" : "calc(100vw - 250px)")};
  height: 100vh;
  transition: width 0.3s ease;
  position: relative;
`;

const Edit = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [layers, setLayers] = useState([]);
  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    console.log("Map Loaded", map);
  };

  return (
    <Container>
      <MapWrapper collapsed={collapsed}>
        <MapComponent onMapLoad={handleMapLoad} />
      </MapWrapper>

      <LayerPanel
        layers={layers}
        setLayers={setLayers}
        mapRef={mapRef}
      />
    </Container>
  );
};

export default Edit;
