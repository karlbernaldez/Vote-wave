import React, { useState, useRef } from "react";
import LayerItem from "./LayerItem";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { addWindLayer, addGeoJsonLayer, toggleLayerVisibility, toggleLayerLock, removeLayer, updateLayerName } from "./utils/layerUtils";
import { theme, darkTheme } from '../../styles/theme';
import { panelStyle, headerStyle, buttonStyle, listStyle, footerStyle } from "./styles/LayerPanelStyles"; 

const LayerPanel = ({ mapRef, isDarkMode }) => {
    const [layers, setLayers] = useState([]); 
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeLayerId, setActiveLayerId] = useState(null); 
    const fileInputRef = useRef();

    const currentTheme = isDarkMode ? darkTheme : theme;

    const windLayer = () => {
        if (!mapRef.current) return;
        addWindLayer(mapRef.current);
    };

    const handleGeoJSONUpload = (event) => {
        const file = event.target.files[0];
        if (!file || !mapRef.current) return;
        addGeoJsonLayer(mapRef.current, file, layers, setLayers);
    };

    const addLayer = () => {
        if (!mapRef.current) {
            console.error("Map is not ready yet.");
            return;
        }

        fileInputRef.current.value = null; 
        fileInputRef.current.click();
    };

    const setActiveLayer = (id) => {
        const layer = layers.find(layer => layer.id === id);
        if (!layer) {
            console.warn(`Layer with ID ${id} not found.`);
            return;
        }
        setActiveLayerId(id);
        console.log(`Layer ${id} is now active.`);
    };

    return (
        <div style={panelStyle(currentTheme, isCollapsed)}>
            <div style={headerStyle(currentTheme, isCollapsed)} onClick={() => setIsCollapsed(!isCollapsed)}>
                <span>Layers</span>
                <div>{isCollapsed ? <FaChevronUp /> : <FaChevronDown />}</div>
            </div>

            {!isCollapsed && (
                <>
                    <ul style={listStyle(currentTheme)}>
                        {layers.map((layer, index) => (
                            <LayerItem
                                key={layer.id}
                                layer={layer}
                                toggleLayerVisibility={() =>
                                    toggleLayerVisibility(mapRef.current, layer, setLayers)
                                }
                                toggleLayerLock={() =>
                                    toggleLayerLock(layer, setLayers)
                                }
                                removeLayer={() =>
                                    removeLayer(mapRef.current, layer, setLayers)
                                }
                                updateLayerName={(newName) =>
                                    updateLayerName(layer.id, newName, setLayers)
                                }
                                isActiveLayer={activeLayerId === layer.id}
                                setActiveLayer={setActiveLayer}
                                index={index}
                                isDarkMode={isDarkMode}
                            />
                        ))}
                    </ul>

                    <div style={footerStyle(currentTheme)}>
                        <button onClick={addLayer} style={buttonStyle(currentTheme)}>
                            <input
                                type="file"
                                accept=".geojson,application/geo+json,application/json"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleGeoJSONUpload}
                            />
                            <FaPlus /> Add GeoJson Layer
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LayerPanel;
