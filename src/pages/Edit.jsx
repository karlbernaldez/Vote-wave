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
  const [drawCounter, setDrawCounter] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  const toggleCanvas = () => setIsCanvasActive(prev => !prev);

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
    setMapLoaded(true);
  };

  return (
    <Container>
      <MapWrapper collapsed={collapsed}>
        <MapComponent 
          onMapLoad={handleMapLoad} 
          isDarkMode={isDarkMode} // Pass the dark mode flag here
        />
      </MapWrapper>
      <DrawToolBar 
        draw={drawInstance} 
        onToggleCanvas={toggleCanvas} 
        isCanvasActive={isCanvasActive} 
        isDarkMode={isDarkMode} // Pass dark mode flag to the toolbar
      />
      {isCanvasActive && 
        <Canvas 
          mapRef={mapRef} 
          drawCounter={drawCounter} 
          setDrawCounter={setDrawCounter} 
          isDarkMode={isDarkMode} // Pass dark mode flag to the canvas
        />
      }
      <LayerPanel
        layers={layers}
        setLayers={setLayers}
        mapRef={mapRef}
        isDarkMode={isDarkMode} // Pass dark mode flag to the LayerPanel
      />
    </Container>
  );
};

export default Edit;
