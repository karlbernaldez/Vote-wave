import React, { useState, useRef } from "react";
import MapComponent from "../components/MapComponent";
import LayerPanel from "../components/LayerPanel";
import ToolsComponent from "../components/ToolsComponent"; // Import ToolsComponent
import styled from "@emotion/styled";

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
`;

const MapWrapper = styled.div`
  flex-grow: 1;
  width: ${({ collapsed }) => (collapsed ? "100vw" : "calc(100vw - 250px)")};
  height: 100vh;
  transition: width 0.3s ease;
  position: relative;
`;

const ToolsWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10; // Keep tools on top of the map
`;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [layers, setLayers] = useState([]);
  const mapRef = useRef(null);  // Store the map reference

  const handleLayerVisibilityChange = (id) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleMapLoad = (map) => {
    mapRef.current = map; // Set the map reference on load
    console.log("Map Loaded", map);
  };

  return (
    <Container>
      <MapWrapper collapsed={collapsed}>
      <ToolsWrapper>
          <ToolsComponent mapRef={mapRef} />
        </ToolsWrapper>
        <MapComponent onMapLoad={handleMapLoad} />
      </MapWrapper>
      <LayerPanel
        layers={layers}
        setLayers={setLayers}
        mapRef={mapRef}  // Pass mapRef to LayerPanel
      />
    </Container>
  );
};

export default Home;
