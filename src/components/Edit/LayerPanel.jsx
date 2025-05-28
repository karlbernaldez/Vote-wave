import React, { useState, useRef } from "react";
import LayerItem from "./LayerItem";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { addWindLayer, addGeoJsonLayer, toggleLayerVisibility, toggleLayerLock, removeLayer, updateLayerName, handleDragStart, handleDragOver, handleDrop } from "./utils/layerUtils";
import { theme, darkTheme } from '../../styles/theme';
import { panelStyle, headerStyle, buttonStyle, listStyle, footerStyle } from "./styles/LayerPanelStyles";
import Modal from "../modals/MapNotReady";

const LayerPanel = ({ mapRef, isDarkMode, layers, setLayers, draw }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mapNotReady, setMapNotReady] = useState(false);
    const [activeLayerId, setActiveLayerId] = useState(null);
    const [setDragging] = useState(false); // State to track dragging
    const [draggedLayerIndex, setDraggedLayerIndex] = useState(null); // Track which layer is being dragged
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
        addWindLayer(mapRef.current);
    };

    const addLayer = () => {
        if (!mapRef.current) {
            console.error("Map is not ready yet.");
            setMapNotReady(true);
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

        // Select the corresponding feature in Mapbox Draw
        if (draw && typeof draw.changeMode === "function" && typeof draw.get === "function") {
            const feature = draw.get(id); // Check if the feature exists
            if (feature) {
                draw.changeMode("simple_select", { featureIds: [id] });
            } else {
                console.warn(`Feature with ID ${id} not found in draw.`);
            }
        }
    };

    return (
        <>
            <div
                style={panelStyle(currentTheme, isCollapsed)}
                onDragOver={handleDragOver}
            >
                <div
                    style={headerStyle(currentTheme, isCollapsed)}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
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
                                    toggleLayerVisibility={() => toggleLayerVisibility(mapRef.current, layer, setLayers)}
                                    toggleLayerLock={() => toggleLayerLock(layer, setLayers)}
                                    removeLayer={() => removeLayer(mapRef.current, layer, setLayers, draw)}
                                    updateLayerName={(newName) => updateLayerName(layer.id, newName, setLayers)}
                                    isActiveLayer={activeLayerId === layer.id}
                                    setActiveLayer={setActiveLayer}
                                    index={index}
                                    isDarkMode={isDarkMode}
                                    draggable={true}
                                    onDragStart={(e) => handleDragStart(e, index, setDragging, setDraggedLayerIndex)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index, draggedLayerIndex, layers, setLayers, setDragging)}
                                    draw={draw}
                                    mapRef={mapRef.current}
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

            {mapNotReady && (
                <Modal isOpen={mapNotReady} onClose={() => setMapNotReady(false)} />
            )}
        </>
    );
};

export default LayerPanel;