import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import storm from "../../assets/draw_icons/hurricane.png";
import lpa from "../../assets/draw_icons/LPA.png";
import PointInputChoiceModal from '../modals/MarkerChoice';
import ManualInputModal from '../modals/ManualInputModal';
import FeatureNotAvailableModal from '../modals/FeatureNotAvailable';
import { typhoonMarker as saveMarkerFn } from "../../utils/mapUtils";
import { ToolbarContainer, ToolButton, CollapseToggle} from './styles/ToolBarStyles';
import { handleDrawModeChange, toggleDrawing, toggleFlagDrawing, startDrawing, startFlagDrawing, stopDrawing, stopFlagDrawing, toggleCollapse } from './utils/ToolBarUtils';

const DrawToolbar = ({ draw, mapRef, onToggleCanvas, onToggleFlagCanvas, isCanvasActive, isdarkmode, setLayersRef, setLayers, closedMode, setClosedMode, setType }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFlagDrawing, setIsFlagDrawing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [manualInputData, setManualInputData] = useState(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const selectedToolRef = useRef(null);

  const [openModals, setOpenModals] = useState({ featureNotAvailable: false, pointInputChoice: false, manualInput: false});

  useEffect(() => {
    if (setLayersRef?.current !== setLayers) {
      setLayersRef.current = setLayers;
    }
  }, [setLayersRef, setLayers]);

  const toggleModal = (modalKey, isOpen) => {
    setOpenModals(prev => ({ ...prev, [modalKey]: isOpen }));
  };

  const tools = useMemo(() => [
    {
      id: 'low_pressure',
      icon: <img src={lpa} alt="Low Pressure Area" style={{ width: 20, height: 20 }} />,
      label: 'Low Pressure Area (A)',
      hotkey: 'a',
      modal: 'pointInputChoice',
    },
    {
      id: 'draw_point',
      icon: <img src={storm} alt="Draw Storm" style={{ width: 20, height: 20 }} />,
      label: 'Draw Storm (M)',
      hotkey: 'm',
      modal: 'pointInputChoice',
    },
    { id: 'draw_line_string', icon: '📏', label: 'Draw Line (L)', hotkey: 'l' },
    { id: 'draw_polygon', icon: '⭐', label: 'Draw Polygon (P)', hotkey: 'p' },
    { id: 'draw_rectangle', icon: '⬛', label: 'Draw Rectangle (R)', hotkey: 'r' },
    { id: 'draw_circle', icon: '⚪', label: 'Draw Circle (C)', hotkey: 'c', modal: 'featureNotAvailable' },
  ], []);

  const handleToolClick = (tool) => {
    selectedToolRef.current = tool.id;
    setSelectedToolType(tool.id);
    if (setType) {
      setType(tool.id);
    }

    if (isDrawing) stopDrawing(setIsDrawing, onToggleCanvas);
    if (isFlagDrawing) stopFlagDrawing(setIsFlagDrawing, onToggleFlagCanvas);

    if (tool.modal) {
      toggleModal(tool.modal, true);
      return;
    }

    handleDrawModeChange(tool.id, draw, setLayersRef);
  };

  const handlePointInputChoice = (method) => {
    toggleModal('pointInputChoice', false);
    const selectedType = selectedToolRef.current || 'draw_point';

    if (method === 'manual') {
      toggleModal('manualInput', true);
    } else if (method === 'map') {
      if (selectedType === 'draw_point') {
        handleDrawModeChange('draw_point', draw, setLayersRef);
      } else if (selectedType === 'low_pressure') {
        handleDrawModeChange('draw_point', draw, setLayersRef);
      }
    }
  };

  const handleManualInputSubmit = (data) => {
    const selectedType = selectedToolRef.current || 'draw_point';

    if (setType) setType(selectedType);

    saveMarkerFn({ lat: data.lat, lng: data.lng }, mapRef, setShowTitleModal, selectedType)(data.title);
    setManualInputData(data);
    toggleModal('manualInput', false);
  };

  const handleDrawing = useCallback((event) => {
    
  }, [tools, draw, isDrawing, isFlagDrawing, onToggleCanvas, onToggleFlagCanvas, setLayersRef, setLayers]);

  useEffect(() => {
    window.addEventListener('keydown', handleDrawing);
    return () => window.removeEventListener('keydown', handleDrawing);
  }, [handleDrawing]);

  const toggleCollapseToolbar = () => toggleCollapse(setIsCollapsed);

  return (
    <>
      {/* Modals */}
      <PointInputChoiceModal
        isOpen={openModals.pointInputChoice}
        onClose={() => toggleModal('pointInputChoice', false)}
        onSelect={handlePointInputChoice}
      />

      <FeatureNotAvailableModal
        isOpen={openModals.featureNotAvailable}
        onClose={() => toggleModal('featureNotAvailable', false)}
      />

      <ManualInputModal
        isOpen={openModals.manualInput}
        onClose={() => toggleModal('manualInput', false)}
        onSubmit={handleManualInputSubmit}
      />

      {/* Toolbar */}
      <ToolbarContainer isdarkmode={isdarkmode}>
        <CollapseToggle
          title={isCollapsed ? 'Expand Toolbar' : 'Collapse Toolbar'}
          isdarkmode={isdarkmode}
          onClick={toggleCollapseToolbar}
        >
          {isCollapsed ? '☰' : '✖'}
        </CollapseToggle>

        {!isCollapsed && (
          <>
            {tools.map((tool) => (
              <ToolButton
                key={tool.id}
                title={tool.label}
                isdarkmode={isdarkmode}
                onClick={() => handleToolClick(tool)}
              >
                {tool.icon}
              </ToolButton>
            ))}

            <ToolButton
              title={isFlagDrawing ? 'Stop Flag Drawing (X)' : 'Start Flag Drawing (🚩)'}
              isdarkmode={isdarkmode}
              onClick={() => {
                // Turn off freehand if it's active
                if (isDrawing) stopDrawing(setIsDrawing, onToggleCanvas);

                // Toggle flag drawing mode
                toggleFlagDrawing(isFlagDrawing, setIsFlagDrawing, onToggleFlagCanvas);
              }}
            >
              {isFlagDrawing ? '❌' : '🚩'}
            </ToolButton>

            <ToolButton
              title={isDrawing ? 'Stop Freehand Drawing (X)' : 'Start Freehand Drawing (🖊️)'}
              $active={isCanvasActive}
              $isdarkmode={isdarkmode}
              onClick={() => {
                // Turn off flag if it's active
                if (isFlagDrawing) stopFlagDrawing(setIsFlagDrawing, onToggleFlagCanvas);

                // Toggle freehand drawing mode
                toggleDrawing(isDrawing, setIsDrawing, onToggleCanvas);
              }}
            >
              {isDrawing ? '❌' : '🖊️'}
            </ToolButton>


            {isCanvasActive && (
              <ToolButton
                title={closedMode ? 'Closed Shape Mode (O)' : 'Open Shape Mode (C)'}
                $active
                $isdarkmode={isdarkmode}
                onClick={() => setClosedMode((prev) => !prev)}
                style={{
                  backgroundColor: closedMode ? '#4CAF50' : '#F44336',
                  color: 'white',
                }}
              >
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {closedMode ? 'O' : 'C'}
                </span>
              </ToolButton>
            )}
          </>
        )}
      </ToolbarContainer>
    </>
  );
};

export default DrawToolbar;
