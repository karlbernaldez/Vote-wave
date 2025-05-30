//  ╔═══════════════════════════════════════════════════════════════════════╗
//  ║                        🌪 Component B Project 1                       ║
//  ╠═══════════════════════════════════════════════════════════════════════╣
//  ║  📁 Project       : DOST-MECO-TECO-VOTE III Component-B               ║
//  ║  📝 Description   :  Weather forecasting platform                     ║
//  ║  👨‍💻 Author        : Karl Santiago Bernaldez                           ║
//  ║  📅 Created       : 2025-03-24                                        ║
//  ║  🕓 Last Updated  : 2025-05-29                                        ║
//  ║  🧭 Version       : v1.0.0                                            ║
//  ╚═══════════════════════════════════════════════════════════════════════╝

import React, { useState, useRef, useCallback, useEffect } from "react";
import MapComponent from "../components/Edit/MapComponent";
import LayerPanel from "../components/Edit/LayerPanel";
import DrawToolBar from "../components/Edit/Toolbar";
import Canvas from "../components/Edit/draw/canvas";
import FlagCanvas from "../components/Edit/draw/front"
import styled from "@emotion/styled";
import MarkerTitleModal from "../components/modals/MarkerTitleModal";
import { typhoonMarker as saveMarkerFn } from "../utils/mapUtils";
import { setupMap } from "../utils/mapSetup";
import { fetchFeatures } from '../api/featureServices';

const Container = styled.div`
  position: relative;
  height: 92.8vh;
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
  const setLayersRef = useRef();
  const [drawInstance, setDrawInstance] = useState(null);
  const [isCanvasActive, setIsCanvasActive] = useState(false);
  const [isFlagCanvasActive, setIsFlagCanvasActive] = useState(false);
  const [drawCounter, setDrawCounter] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false); // <- NEW state for delay
  const [closedMode, setClosedMode] = useState(false);
  const [type, setType] = useState(null);

  const mapRef = useRef(null);
  setLayersRef.current = setLayers;

  const toggleCanvas = useCallback(() => setIsCanvasActive(prev => !prev), []);
  const toggleFlagCanvas = useCallback(() => setIsFlagCanvasActive(prev => !prev), []);

  const typhoonMarker = saveMarkerFn(selectedPoint, mapRef, setShowTitleModal, type);

  const handleMapLoad = useCallback(async (map) => {
    try {
      const savedFeatures = await fetchFeatures();
      savedFeatures.forEach(feature => console.log(feature._id));

      const initialLayers = savedFeatures.map(f => ({
        id: f.sourceId,
        name: f.name || 'Untitled Feature',
        visible: true,
        locked: false,
      }));

      setLayers(initialLayers);

      setupMap({
        map,
        mapRef,
        setDrawInstance,
        setMapLoaded,
        setSelectedPoint,
        setShowTitleModal,
        initialFeatures: savedFeatures,
      });
    } catch (error) {
      console.error('Failed to load saved features:', error);
      setupMap({ map, mapRef, setDrawInstance, setMapLoaded, setSelectedPoint, setShowTitleModal });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputFocused = document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA";
      const modal = document.querySelector(".modal");
      const isInsideModal = modal?.contains(document.activeElement);

      if (showTitleModal && isInsideModal && isInputFocused) {
        e.stopPropagation();
        return;
      }

      if (e.key === "c" || e.key === "C") {
        toggleCanvas();
      }

      if (e.key === "q" || e.key === "Q") {
        toggleFlagCanvas();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showTitleModal, toggleCanvas, toggleFlagCanvas]);

  useEffect(() => {
    const toolbarDelay = setTimeout(() => {
      setShowToolbar(true);
    }, 1000); // Delay in milliseconds

    return () => clearTimeout(toolbarDelay);
  }, []);

  return (
    <Container>
      <MapWrapper collapsed={collapsed}>
        <MapComponent onMapLoad={handleMapLoad} isDarkMode={isDarkMode} />
      </MapWrapper>

      {showToolbar && (
        <DrawToolBar
          draw={drawInstance}
          mapRef={mapRef}
          onToggleCanvas={toggleCanvas}
          onToggleFlagCanvas={toggleFlagCanvas}
          isCanvasActive={isCanvasActive}
          isFlagCanvasActive={isFlagCanvasActive}
          isDarkMode={isDarkMode}
          layers={layers}
          setLayers={setLayers}
          setLayersRef={setLayersRef}
          closedMode={closedMode}
          setClosedMode={setClosedMode}
          setType={setType}
        />
      )}

      {isCanvasActive && (
        <Canvas
          mapRef={mapRef}
          drawRef={drawInstance}
          drawCounter={drawCounter}
          setDrawCounter={setDrawCounter}
          isDarkMode={isDarkMode}
          setLayersRef={setLayersRef}
          closedMode={closedMode}
        />
      )}

      {isFlagCanvasActive && (
        <FlagCanvas
          mapRef={mapRef}
          drawRef={drawInstance}
          drawCounter={drawCounter}
          setDrawCounter={setDrawCounter}
          isDarkMode={isDarkMode}
          setLayersRef={setLayersRef}
          closedMode={closedMode}
          isFlagCanvas={true}
        />
      )}

      <LayerPanel
        layers={layers}
        setLayers={setLayers}
        mapRef={mapRef}
        isDarkMode={isDarkMode}
        draw={drawInstance}
      />

      <MarkerTitleModal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        onSave={typhoonMarker}
      />
      
    </Container>
  );
};

export default Edit;