export const handleDrawModeChange = (mode, draw, setLayersRef) => {
  if (draw?.changeMode) {
    console.log(`Switching to mode: ${mode}`);
    draw.changeMode(mode, {
      setLayersRef, // ✅ now it's correctly passed
    });
  } else {
    console.warn('Draw instance is not available or changeMode is not a function');
  }
};

export const handleKeyPress = (
  event, tools, draw, isDrawing, toggleDrawing, 
  startDrawing, stopDrawing, setIsDrawing, 
  onToggleCanvas, map, setLayersRef
) => {
  const key = event.key.toLowerCase();
  const tool = tools.find(t => t.hotkey === key);

  console.log("HANDLEKEYPRESS FUNCTION");

  // Handle drawing mode change (if tool is pressed)
  if (tool) {
    handleDrawModeChange(tool.id, draw, setLayersRef);
  }

  // Handle delete/backspace to remove a layer
  if ((event.key === 'Backspace' || event.key === 'Delete') && draw?.trash) {
    const selectedFeatures = draw.getSelected();

    if (selectedFeatures?.features?.length) {
      selectedFeatures.features.forEach(feature => {
        const sourceId = feature.properties?.sourceId;

        if (sourceId) {
          console.log("Deleted shape sourceID:", feature.id);

          setLayersRef((prevLayers) => prevLayers.filter((l) => l.id !== feature.id));
          // Trigger the delete in draw (to remove the feature from the map)
          draw.delete(feature.id); // Delete selected shapes
        } else {
          console.warn("Deleted feature is missing sourceId in properties.");
        }
      });
    } else {
      console.log("No features selected for deletion.");
    }
  }

  // Handle start/stop drawing (toggle with 'f')
  if (key === 'f') toggleDrawing(isDrawing, setIsDrawing, onToggleCanvas);

  // Handle stop drawing with 'x'
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
