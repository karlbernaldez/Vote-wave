import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 4px;
  z-index: 100;
`;

const ToolButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${({ active }) => (active ? 'blue' : 'black')};

  &:hover {
    background-color: #f0f0f0;
    border-radius: 5px;
  }
`;

const DrawToolbar = ({ draw, onToggleCanvas, isCanvasActive, setDrawCounter }) => {
  const [isDrawing, setIsDrawing] = useState(false); // State to track drawing mode

  const tools = [
    { id: 'draw_point', icon: '📍', label: 'Draw Point (m)', hotkey: 'm' },
    { id: 'draw_line_string', icon: '📏', label: 'Draw LineString (l)', hotkey: 'l' },
    { id: 'draw_polygon', icon: '⭐', label: 'Draw Polygon (p)', hotkey: 'p' },
    { id: 'draw_rectangle', icon: '⬛', label: 'Draw Rectangular Polygon (r)', hotkey: 'r' },
    { id: 'draw_circle', icon: '⚪', label: 'Draw Circular Polygon (c)', hotkey: 'c' },
  ];

  const handleDrawModeChange = (mode) => {
    if (draw && typeof draw.changeMode === 'function') {
      console.log(`Switching to mode: ${mode}`);
      draw.changeMode(mode);
    } else {
      console.warn('Draw instance is not available or changeMode is not a function');
    }
  };

  const handleKeyPress = (event) => {
    const key = event.key.toLowerCase();
    const tool = tools.find(t => t.hotkey === key);

    if (tool) {
      handleDrawModeChange(tool.id);
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (draw && typeof draw.trash === 'function') {
        draw.trash();
        console.log('Deleted shape');
      } else {
        console.warn('Draw instance not available or trash method missing');
      }
    }

    if (key === 'f') {
      // Toggle canvas with 'f' key
      toggleDrawing();
    }

    if (key === 'x' && isDrawing) {
      // Stop drawing when 'x' is pressed
      stopDrawing();
    }
  };

  const toggleDrawing = () => {
    if (isDrawing) {
      stopDrawing();
    } else {
      startDrawing();
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    if (onToggleCanvas) onToggleCanvas(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (onToggleCanvas) onToggleCanvas(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [draw, isDrawing, onToggleCanvas]);

  return (
    <ToolbarContainer>
      {tools.map(tool => (
        <ToolButton
          key={tool.id}
          onClick={() => handleDrawModeChange(tool.id)}
          title={tool.label}
        >
          {tool.icon}
        </ToolButton>
      ))}

      {/* Pen tool button for Canvas */}
      <ToolButton
        onClick={toggleDrawing}
        title={isDrawing ? "Stop Drawing (X)" : "Start Drawing (Pencil)"}
        active={isCanvasActive}
      >
        {isDrawing ? '❌' : '🖊️'}
      </ToolButton>
    </ToolbarContainer>
  );
};

export default DrawToolbar;
