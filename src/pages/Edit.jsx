import React, { useState, useRef, useCallback, useEffect } from "react";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapComponent from "../components/MapComponent";
import LayerPanel from "../components/Edit/LayerPanel";
import DrawToolBar from "../components/Edit/draw/Toolbar";
import Canvas from "../components/Edit/draw/canvas";
import styled from "@emotion/styled";
import MarkerTitleModal from "../components/modals/MarkerTitleModal";

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
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const mapRef = useRef(null);

  // Toggle canvas visibility
  const toggleCanvas = useCallback(() => setIsCanvasActive(prev => !prev), []);

  // Handle saving the title for the created marker
  const handleSaveMarker = useCallback((title) => {
    if (!selectedPoint) return;

    const { lng, lat } = selectedPoint;
    const customPoint = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      properties: {
        title: title || 'Untitled Marker'
      }
    };

    const source = mapRef.current?.getSource('custom-points');
    if (!source) return;

    const currentData = source._data || {
      type: 'FeatureCollection',
      features: []
    };

    source.setData({
      ...currentData,
      features: [...currentData.features, customPoint]
    });

    setShowTitleModal(false);  // Close the modal after saving the title
  }, [selectedPoint]);

  // Handle map load and setup controls, sources, and layers
  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;

    if (!mapRef.current) {
      console.error('Map is not ready yet.');
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

    map.loadImage('/map-pin.png', (error, image) => {
      if (error) {
        console.error('Error loading image:', error);
        return;
      }
      if (!map.hasImage('custom-marker')) {
        map.addImage('custom-marker', image);
      }
    });

    map.addSource('custom-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    map.addLayer({
      id: 'custom-points-layer',
      type: 'symbol',
      source: 'custom-points',
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 0.2,
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1.50],
        'text-anchor': 'top'
      }
    });

    map.on('draw.create', (e) => {
      const feature = e.features[0];
      if (feature && feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        console.log('🧭 Point created at:', { lng, lat });

        setSelectedPoint({ lng, lat });  // Store coordinates of the created point
        setShowTitleModal(true);  // Show modal to input title
        draw.delete(feature.id);  // Optional: remove from Draw so the tiny circle isn't shown
      }
    });
  }, []);

  // Keyboard hotkey handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if modal is open and input is focused
      const isInputFocused = document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA";
      const modal = document.querySelector(".modal"); // Ensure correct modal class is used
      const isInsideModal = modal?.contains(document.activeElement);

      if (showTitleModal && isInsideModal && isInputFocused) {
        e.stopPropagation(); // Stop hotkey from triggering when typing inside modal
        return; // Skip hotkey actions
      }

      // Example hotkey: toggle canvas with "C"
      if (e.key === "c" || e.key === "C") {
        toggleCanvas();
      }

      // Add other hotkeys as needed
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showTitleModal, toggleCanvas]);

  return (
    <Container>
      <MapWrapper collapsed={collapsed}>
        <MapComponent
          onMapLoad={handleMapLoad}
          isDarkMode={isDarkMode}
        />
      </MapWrapper>
      <DrawToolBar
        draw={drawInstance}
        onToggleCanvas={toggleCanvas}
        isCanvasActive={isCanvasActive}
        isDarkMode={isDarkMode}
      />
      {isCanvasActive &&
        <Canvas
          mapRef={mapRef}
          drawCounter={drawCounter}
          setDrawCounter={setDrawCounter}
          isDarkMode={isDarkMode}
        />
      }
      <LayerPanel
        layers={layers}
        setLayers={setLayers}
        mapRef={mapRef}
        isDarkMode={isDarkMode}
      />

      {/* Modal for inputting marker title */}
      <MarkerTitleModal 
        isOpen={showTitleModal} 
        onClose={() => setShowTitleModal(false)} 
        onSave={handleSaveMarker} 
      />
    </Container>
  );
};

export default Edit;