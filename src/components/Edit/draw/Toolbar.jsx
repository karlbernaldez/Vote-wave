import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#2d3e4f' : '#ffffff')};
  border: 1px solid ${({ isDarkMode }) => (isDarkMode ? '#0f0f0f' : '#ccc')};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 6px 10px;
  z-index: 1000;
  gap: 8px;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ active, isDarkMode }) => (active ? (isDarkMode ? '#444' : '#e0f0ff') : 'none')};
  border: none;
  border-radius: 6px;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  color: ${({ active, isDarkMode }) => (active ? (isDarkMode ? '#1e90ff' : '#007acc') : (isDarkMode ? '#ddd' : '#333'))};

  &:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#555' : '#f0f0f0')};
    transform: scale(1.05);
  }

  &:active {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#666' : '#d0eaff')};
  }
`;

const CollapseToggle = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  color: ${({ isDarkMode }) => (isDarkMode ? '#ddd' : '#333')};
  transition: transform 0.2s ease;

  &:hover {
    color: ${({ isDarkMode }) => (isDarkMode ? '#1e90ff' : '#007acc')};
    transform: scale(1.1);
  }
`;

const DrawToolbar = ({ draw, onToggleCanvas, isCanvasActive, setDrawCounter, isDarkMode }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tools = [
    { id: 'draw_point', icon: '📍', label: 'Draw Point (m)', hotkey: 'm' },
    { id: 'draw_line_string', icon: '📏', label: 'Draw LineString (l)', hotkey: 'l' },
    { id: 'draw_polygon', icon: '⭐', label: 'Draw Polygon (p)', hotkey: 'p' },
    { id: 'draw_rectangle', icon: '⬛', label: 'Draw Rectangular Polygon (r)', hotkey: 'r' },
    { id: 'draw_circle', icon: '⚪', label: 'Draw Circular Polygon (c)', hotkey: 'c' },
  ];

  const handleDrawModeChange = (mode) => {
    if (draw?.changeMode) {
      console.log(`Switching to mode: ${mode}`);
      draw.changeMode(mode);
    } else {
      console.warn('Draw instance is not available or changeMode is not a function');
    }
  };

  const handleKeyPress = (event) => {
    const key = event.key.toLowerCase();
    const tool = tools.find(t => t.hotkey === key);

    if (tool) handleDrawModeChange(tool.id);

    if ((event.key === 'Backspace' || event.key === 'Delete') && draw?.trash) {
      draw.trash();
      console.log('Deleted shape');
    }

    if (key === 'f') toggleDrawing();
    if (key === 'x' && isDrawing) stopDrawing();
  };

  const toggleDrawing = () => {
    isDrawing ? stopDrawing() : startDrawing();
  };

  const startDrawing = () => {
    setIsDrawing(true);
    onToggleCanvas?.(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    onToggleCanvas?.(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [draw, isDrawing, onToggleCanvas]);

  return (
    <ToolbarContainer isDarkMode={isDarkMode}>
      <CollapseToggle isDarkMode={isDarkMode} onClick={toggleCollapse} title={isCollapsed ? "Expand Toolbar" : "Collapse Toolbar"}>
        {isCollapsed ? '☰' : '✖'}
      </CollapseToggle>

      {!isCollapsed && (
        <>
          {tools.map(tool => (
            <ToolButton
              key={tool.id}
              onClick={() => handleDrawModeChange(tool.id)}
              title={tool.label}
              isDarkMode={isDarkMode}
            >
              {tool.icon}
            </ToolButton>
          ))}

          <ToolButton
            onClick={toggleDrawing}
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