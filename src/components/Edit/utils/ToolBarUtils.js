export const handleDrawModeChange = (mode, draw) => {
  if (draw?.changeMode) {
    console.log(`Switching to mode: ${mode}`);
    draw.changeMode(mode);
  } else {
    console.warn('Draw instance is not available or changeMode is not a function');
  }
};

export const handleKeyPress = (event, tools, draw, isDrawing, toggleDrawing, startDrawing, stopDrawing, setIsDrawing, onToggleCanvas) => {
  const key = event.key.toLowerCase();
  const tool = tools.find(t => t.hotkey === key);

  if (tool) handleDrawModeChange(tool.id, draw);

  if ((event.key === 'Backspace' || event.key === 'Delete') && draw?.trash) {
    draw.trash();
    console.log('Deleted shape');
  }

  if (key === 'f') toggleDrawing(isDrawing, setIsDrawing, onToggleCanvas);
  if (key === 'x' && isDrawing) stopDrawing(setIsDrawing, onToggleCanvas);
};

export const toggleDrawing = (isDrawing, setIsDrawing, onToggleCanvas) => {
  isDrawing ? stopDrawing(setIsDrawing, onToggleCanvas) : startDrawing(setIsDrawing, onToggleCanvas);
};

export const startDrawing = (setIsDrawing, onToggleCanvas) => {
  setIsDrawing(true);
  onToggleCanvas?.(true);
};

export const stopDrawing = (setIsDrawing, onToggleCanvas) => {
  setIsDrawing(false);
  onToggleCanvas?.(false);
};

export const toggleCollapse = (setIsCollapsed) => {
  setIsCollapsed(prev => !prev);
};
