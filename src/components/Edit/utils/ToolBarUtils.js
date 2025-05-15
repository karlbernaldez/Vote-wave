import { removeFeature } from "./layerUtils";

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

  // Handle drawing mode change (if tool is pressed)r
  if (tool) {
    handleDrawModeChange(tool.id, draw, setLayersRef);
  }

  // Handle delete/backspace to remove a layer
  if ((event.key === 'Backspace' || event.key === 'Delete') && draw?.trash) {
    const selectedFeatures = draw.getSelected();

    if (selectedFeatures?.features?.length) {
      selectedFeatures.features.forEach(feature => {
        const featureID = feature.properties?.featureID;
        const layerID = feature.properties?.layerID

        if (layerID) {
          setLayersRef((prevLayers) => prevLayers.filter((l) => l.id !== layerID));
          removeFeature(draw, layerID)
        } else {
          console.warn("Deleted feature is missing sourceId in properties.");
        }
      });
    } else {
      console.error("No features selected for deletion.");
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
