import React, { useState, useRef, useEffect } from "react";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapComponent from "../components/MapComponent";
import LayerPanel from "../components/Edit/LayerPanel";
import DrawToolBar from "../components/Edit/draw/Toolbar";
import Canvas from "../components/Edit/draw/canvas";
import styled from "@emotion/styled";

const mapboxgl = require('mapbox-gl');
const DrawLineString = require('../components/Edit/draw/linestring');
const DrawRectangle = require('../components/Edit/draw/rectangle');
const DrawCircle = require('../components/Edit/draw/circle');
const SimpleSelect = require('../components/Edit/draw/simple_select');
const drawStyles = require('../components/Edit/draw/styles');

const Container = styled.div`
  position: relative;
  height: 93vh;
  width: 100%;
  display: flex;
  overflow: hidden;
`;

const MapWrapper = styled.div`
  flex-grow: 1;
  width: ${({ collapsed }) => (collapsed ? "100vw" : "calc(100vw - 250px)")};
  height: 100%;
  transition: width 0.3s ease;
  position: relative;
`;

const Edit = ({ isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [layers, setLayers] = useState([]);
  const [drawInstance, setDrawInstance] = useState(null);
  const [isCanvasActive, setIsCanvasActive] = useState(false);
  const [drawCounter, setDrawCounter] = useState(0); // Initialize drawCounter state
  const toggleCanvas = () => setIsCanvasActive(prev => !prev);
  const [mapLoaded, setMapLoaded] = useState(false); // Track map load status
  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;

    if (!mapRef.current) {
      console.error("Map is not ready yet.");
      return;
    }

    map.addControl(new mapboxgl.NavigationControl());

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        simple_select: SimpleSelect,
        direct_select: MapboxDraw.modes.direct_select,
        draw_line_string: DrawLineString,
        draw_rectangle: DrawRectangle,
        draw_circle: DrawCircle
      },
      styles: drawStyles
    });

    map.addControl(draw);
    setDrawInstance(draw);
    setMapLoaded(true); // Set map as loaded
  };

  return (
    <Container>
      <MapWrapper collapsed={collapsed}>
        <MapComponent onMapLoad={handleMapLoad} isDarkMode={isDarkMode} />
      </MapWrapper>
      <DrawToolBar 
        draw={drawInstance} 
        onToggleCanvas={toggleCanvas} 
        isCanvasActive={isCanvasActive} 
      />
      {isCanvasActive && 
        <Canvas 
          mapRef={mapRef} 
          drawCounter={drawCounter} 
          setDrawCounter={setDrawCounter} // Pass setDrawCounter here
        />
      }
      <LayerPanel
        layers={layers}
        setLayers={setLayers}
        mapRef={mapRef}
      />
    </Container>
  );
};

export default Edit;
