import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ToolbarContainer, ToolButton, CollapseToggle } from './styles/ToolBarStyles';
import { handleDrawModeChange, handleKeyPress, toggleDrawing, startDrawing, stopDrawing, toggleCollapse } from './utils/ToolBarUtils';

import FeatureNotAvailableModal from '../modals/FeatureNotAvailable';

const DrawToolbar = ({ draw, onToggleCanvas, isCanvasActive, isdarkmode, setLayersRef, setLayers }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Ensure setLayersRef is initialized correctly
  useEffect(() => {
    if (setLayersRef?.current !== setLayers) {
      setLayersRef.current = setLayers;
    }
  }, [setLayersRef, setLayers]); // Dependencies to ensure that setLayersRef is updated with the latest function

  const [openModals, setOpenModals] = useState({
    featureNotAvailable: false,
  });

  const toggleModal = (modalKey, isOpen) => {
    setOpenModals((prev) => ({ ...prev, [modalKey]: isOpen }));
  };

  const tools = useMemo(() => [
    { id: 'draw_point', icon: '📍', label: 'Draw Point (m)', hotkey: 'm' },
    { id: 'draw_line_string', icon: '📏', label: 'Draw LineString (l)', hotkey: 'l' },
    { id: 'draw_polygon', icon: '⭐', label: 'Draw Polygon (p)', hotkey: 'p' },
    { id: 'draw_rectangle', icon: '⬛', label: 'Draw Rectangular Polygon (r)', hotkey: 'r' },
    { id: 'draw_circle', icon: '⚪', label: 'Draw Circular Polygon (c)', hotkey: 'c', modal: 'featureNotAvailable' },
  ], []); // Memoizing tools to prevent unnecessary recalculations

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
      setLayersRef, // ✅ Use correct updater function here
      setLayers // ✅ Pass again if needed elsewhere in the function
    );
  }, [draw, isDrawing, tools, onToggleCanvas, setLayers, setLayersRef]);

  const toggleCollapseToolbar = () => toggleCollapse(setIsCollapsed);

  useEffect(() => {
    window.addEventListener('keydown', handleDrawing);
    return () => window.removeEventListener('keydown', handleDrawing);
  }, [handleDrawing]); // Now, handleDrawing is stable and doesn't change on every render

  return (
    <ToolbarContainer isdarkmode={isdarkmode}>
      <CollapseToggle
        isdarkmode={isdarkmode}
        onClick={toggleCollapseToolbar}
        title={isCollapsed ? 'Expand Toolbar' : 'Collapse Toolbar'}
      >
        {isCollapsed ? '☰' : '✖'}
      </CollapseToggle>

      {!isCollapsed && (
        <>
          {tools.map((tool) => (
            <ToolButton
              key={tool.id}
              onClick={() =>
                tool.modal
                  ? toggleModal(tool.modal, true)
                  : handleDrawModeChange(tool.id, draw, setLayersRef)
              }
              title={tool.label}
              isdarkmode={isdarkmode}
            >
              {tool.icon}
            </ToolButton>
          ))}

          <ToolButton
            onClick={() =>
              toggleDrawing(isDrawing, setIsDrawing, onToggleCanvas)
            }
            title={isDrawing ? 'Stop Drawing (X)' : 'Start Drawing (Pencil)'}
            active={isCanvasActive}
            isdarkmode={isdarkmode}
          >
            {isDrawing ? '❌' : '🖊️'}
          </ToolButton>
        </>
      )}

      <FeatureNotAvailableModal
        isOpen={openModals.featureNotAvailable}
        onClose={() => toggleModal('featureNotAvailable', false)}
      />
    </ToolbarContainer>
  );
};

export default DrawToolbar;
