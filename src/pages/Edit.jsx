import React, { useState, useRef, useCallback, useEffect } from "react";
import MapComponent from "../components/Edit/MapComponent";
import LayerPanel from "../components/Edit/LayerPanel";
import DrawToolBar from "../components/Edit/Toolbar";
import Canvas from "../components/Edit/draw/canvas";
import styled from "@emotion/styled";
import MarkerTitleModal from "../components/modals/MarkerTitleModal";
import { handleSaveMarker as saveMarkerFn } from "../utils/mapUtils";
import { setupMap } from "../utils/mapSetup";

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

  const toggleCanvas = useCallback(() => setIsCanvasActive(prev => !prev), []);

  const handleSaveMarker = saveMarkerFn(selectedPoint, mapRef, setShowTitleModal);

  const handleMapLoad = useCallback((map) => {
    setupMap({
      map,
      mapRef,
      setDrawInstance,
      setMapLoaded,
      setSelectedPoint,
      setShowTitleModal
    });
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showTitleModal, toggleCanvas]);

  return (
    <Container>
      <MapWrapper collapsed={collapsed}>
        <MapComponent onMapLoad={handleMapLoad} isDarkMode={isDarkMode} />
      </MapWrapper>
      <DrawToolBar
        draw={drawInstance}
        onToggleCanvas={toggleCanvas}
        isCanvasActive={isCanvasActive}
        isDarkMode={isDarkMode}
      />
      {isCanvasActive && (
        <Canvas
          mapRef={mapRef}
          drawCounter={drawCounter}
          setDrawCounter={setDrawCounter}
          isDarkMode={isDarkMode}
        />
      )}
      <LayerPanel
        layers={layers}
        setLayers={setLayers}
        mapRef={mapRef}
        isDarkMode={isDarkMode}
      />
      <MarkerTitleModal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        onSave={handleSaveMarker}
      />
    </Container>
  );
};

export default Edit;
