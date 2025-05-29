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
  onToggleCanvas, onToggleFlagCanvas, map, setLayersRef
) => {
  const key = event.key.toLowerCase();
  const tool = tools.find(t => t.hotkey === key);

  // Handle drawing mode change (if tool is pressed)r
  if (tool) {
    if (tool.id === 'low_pressure') {tool.id = 'draw_point';} // Normalize to draw_point for low_pressure
    handleDrawModeChange(tool.id, draw, setLayersRef);
  }

  // Handle delete/backspace to remove a layer
  if ((event.key === 'Backspace' || event.key === 'Delete') && draw?.trash) {
    const selectedFeatures = draw.getSelected();

    if (selectedFeatures?.features?.length) {
      selectedFeatures.features.forEach(feature => {
        console.log("FEATURE PROPERTIES: ", feature.properties)
        const featureID = feature.properties?.featureID;
        const layerID = feature.properties?.layerID

        if (layerID) {
          setLayersRef((prevLayers) => prevLayers.filter((l) => l.id !== layerID));
          removeFeature(draw, layerID, featureID)
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

export const toggleFlagDrawing = (isFlagDrawing, setIsFlagDrawing, onToggleFlagCanvas) => {
  isFlagDrawing ? stopFlagDrawing(setIsFlagDrawing, onToggleFlagCanvas) : startFlagDrawing(setIsFlagDrawing, onToggleFlagCanvas);
};

export const startDrawing = (setIsDrawing, onToggleCanvas) => {
  setIsDrawing(true);
  onToggleCanvas?.(true);
};

export const startFlagDrawing = (setIsFlagDrawing, onToggleFlagCanvas) => {
  setIsFlagDrawing(true);
  onToggleFlagCanvas?.(true);
};

export const stopDrawing = (setIsDrawing, onToggleFlagCanvas) => {
  setIsDrawing(false);
  onToggleFlagCanvas?.(false);
};

export const stopFlagDrawing = (setIsFlagDrawing, onToggleFlagCanvas) => {
  setIsFlagDrawing(false);
  onToggleFlagCanvas?.(false);
};

export const toggleCollapse = (setIsCollapsed) => {
  setIsCollapsed(prev => !prev);
};
