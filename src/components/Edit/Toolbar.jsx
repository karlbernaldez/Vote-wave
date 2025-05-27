import React, { useEffect, useState, useCallback, useMemo } from 'react';
import storm from "../../assets/draw_icons/hurricane.png"

import {
  ToolbarContainer,
  ToolButton,
  CollapseToggle
} from './styles/ToolBarStyles';
import {
  handleDrawModeChange,
  handleKeyPress,
  toggleDrawing,
  startDrawing,
  stopDrawing,
  toggleCollapse
} from './utils/ToolBarUtils';

import FeatureNotAvailableModal from '../modals/FeatureNotAvailable';

const DrawToolbar = ({
  draw,
  onToggleCanvas,
  isCanvasActive,
  isdarkmode,
  setLayersRef,
  setLayers,
  closedMode,
  setClosedMode,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openModals, setOpenModals] = useState({
    featureNotAvailable: false
  });

  useEffect(() => {
    if (setLayersRef?.current !== setLayers) {
      setLayersRef.current = setLayers;
    }
  }, [setLayersRef, setLayers]);

  const toggleModal = (modalKey, isOpen) => {
    setOpenModals(prev => ({ ...prev, [modalKey]: isOpen }));
  };

  const tools = useMemo(() => [
    { id: 'draw_point', icon: <img src={storm} alt="Draw Storm" style={{ width: 20, height: 20 }} />, label: 'Draw Storm (M)', hotkey: 'm' },
    { id: 'draw_line_string', icon: '📏', label: 'Draw Line (L)', hotkey: 'l' },
    { id: 'draw_polygon', icon: '⭐', label: 'Draw Polygon (P)', hotkey: 'p' },
    { id: 'draw_rectangle', icon: '⬛', label: 'Draw Rectangle (R)', hotkey: 'r' },
    { id: 'draw_circle', icon: '⚪', label: 'Draw Circle (C)', hotkey: 'c', modal: 'featureNotAvailable' }
  ], []);

  const handleDrawing = useCallback((event) => {
    handleKeyPress(
      event,
      tools,
      draw,
      isDrawing,
      toggleDrawing,
      startDrawing,
      stopDrawing,
      setIsDrawing,
      onToggleCanvas,
      setLayersRef,
      setLayers
    );
  }, [tools, draw, isDrawing, onToggleCanvas, setLayersRef, setLayers]);

  useEffect(() => {
    window.addEventListener('keydown', handleDrawing);
    return () => window.removeEventListener('keydown', handleDrawing);
  }, [handleDrawing]);

  const toggleCollapseToolbar = () => toggleCollapse(setIsCollapsed);

  return (
    <>
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
                onClick={() =>
                  tool.modal
                    ? toggleModal(tool.modal, true)
                    : handleDrawModeChange(tool.id, draw, setLayersRef)
                }
              >
                {tool.icon}
              </ToolButton>
            ))}
            <ToolButton
              title={isDrawing ? 'Stop Drawing (X)' : 'Start Drawing (🖊️)'}
              active={isCanvasActive}
              isdarkmode={isdarkmode}
              onClick={() => toggleDrawing(isDrawing, setIsDrawing, onToggleCanvas)}
            >
              {isDrawing ? '❌' : '🖊️'}
            </ToolButton>

            {isCanvasActive && (
              <ToolButton
                title={closedMode ? 'Closed Shape Mode (O)' : 'Open Shape Mode (C)'}
                active={true}
                isdarkmode={isdarkmode}
                onClick={() => setClosedMode((prev) => !prev)}
                style={{
                  backgroundColor: closedMode ? '#4CAF50' : '#F44336',
                  color: 'white'
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

      {/* ✅ Modal rendered outside toolbar */}
      <FeatureNotAvailableModal
        isOpen={openModals.featureNotAvailable}
        onClose={() => toggleModal('featureNotAvailable', false)}
      />
    </>
  );
};

export default DrawToolbar;
