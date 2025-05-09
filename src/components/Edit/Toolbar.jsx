import React, { useEffect, useState } from 'react';
import { ToolbarContainer, ToolButton, CollapseToggle } from './styles/ToolBarStyles';
import { handleDrawModeChange, handleKeyPress, toggleDrawing, startDrawing, stopDrawing, toggleCollapse } from './utils/ToolBarUtils';

const DrawToolbar = ({ draw, onToggleCanvas, isCanvasActive, isDarkMode }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const tools = [
    { id: 'draw_point', icon: '📍', label: 'Draw Point (m)', hotkey: 'm' },
    { id: 'draw_line_string', icon: '📏', label: 'Draw LineString (l)', hotkey: 'l' },
    { id: 'draw_polygon', icon: '⭐', label: 'Draw Polygon (p)', hotkey: 'p' },
    { id: 'draw_rectangle', icon: '⬛', label: 'Draw Rectangular Polygon (r)', hotkey: 'r' },
    { id: 'draw_circle', icon: '⚪', label: 'Draw Circular Polygon (c)', hotkey: 'c' },
  ];

  const handleDrawing = (event) => {
    handleKeyPress(event, tools, draw, isDrawing, toggleDrawing, startDrawing, stopDrawing, setIsDrawing, onToggleCanvas);
  };

  const toggleCollapseToolbar = () => toggleCollapse(setIsCollapsed);

  useEffect(() => {
    window.addEventListener('keydown', handleDrawing);
    return () => window.removeEventListener('keydown', handleDrawing);
  }, [draw, isDrawing, onToggleCanvas]);

  return (
    <ToolbarContainer isDarkMode={isDarkMode}>
      <CollapseToggle isDarkMode={isDarkMode} onClick={toggleCollapseToolbar} title={isCollapsed ? "Expand Toolbar" : "Collapse Toolbar"}>
        {isCollapsed ? '☰' : '✖'}
      </CollapseToggle>

      {!isCollapsed && (
        <>
          {tools.map(tool => (
            <ToolButton
              key={tool.id}
              onClick={() => handleDrawModeChange(tool.id, draw)}
              title={tool.label}
              isDarkMode={isDarkMode}
            >
              {tool.icon}
            </ToolButton>
          ))}

          <ToolButton
            onClick={() => toggleDrawing(isDrawing, setIsDrawing, onToggleCanvas)}
            title={isDrawing ? "Stop Drawing (X)" : "Start Drawing (Pencil)"}
            active={isCanvasActive}
            isDarkMode={isDarkMode}
          >
            {isDrawing ? '❌' : '🖊️'}
          </ToolButton>
        </>
      )}
    </ToolbarContainer>
  );
};

export default DrawToolbar;
