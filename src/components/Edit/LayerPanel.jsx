import React, { useState, useRef } from "react";
import LayerItem from "./LayerItem";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";

const LayerPanel = ({ mapRef }) => {
    const [layers, setLayers] = useState([]); // For managing the layers in the layer panel
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeLayerId, setActiveLayerId] = useState(null); // Track active layer
    const fileInputRef = useRef();

    const windLayer = () => {
        mapRef.current.addSource('wind_data_source', {
            type: 'raster-array',
            url: 'mapbox://karlbernaldizzy.noaa_grib',
            tileSize: 4320
        });

        mapRef.current.addLayer({
            id: 'wind-layer',
            type: 'raster-particle',
            source: 'wind_data_source',
            'source-layer': '10m_wind',
            paint: {
                'raster-particle-speed-factor': 0.4,
                'raster-particle-fade-opacity-factor': 0.9,
                'raster-particle-reset-rate-factor': 0.4,
                'raster-particle-count': 4000,
                'raster-particle-max-speed': 40,
                'raster-particle-color': [
                    'interpolate',
                    ['linear'],
                    ['raster-particle-speed'],
                    1.5,
                    'rgba(134,163,171,256)',
                    2.5,
                    'rgba(126,152,188,256)',
                    4.12,
                    'rgba(110,143,208,256)',
                    4.63,
                    'rgba(110,143,208,256)',
                    6.17,
                    'rgba(15,147,167,256)',
                    7.72,
                    'rgba(15,147,167,256)',
                    9.26,
                    'rgba(57,163,57,256)',
                    10.29,
                    'rgba(57,163,57,256)',
                    11.83,
                    'rgba(194,134,62,256)',
                    13.37,
                    'rgba(194,134,63,256)',
                    14.92,
                    'rgba(200,66,13,256)',
                    16.46,
                    'rgba(200,66,13,256)',
                    18.0,
                    'rgba(210,0,50,256)',
                    20.06,
                    'rgba(215,0,50,256)',
                    21.6,
                    'rgba(175,80,136,256)',
                    23.66,
                    'rgba(175,80,136,256)',
                    25.21,
                    'rgba(117,74,147,256)',
                    27.78,
                    'rgba(117,74,147,256)',
                    29.32,
                    'rgba(68,105,141,256)',
                    31.89,
                    'rgba(68,105,141,256)',
                    33.44,
                    'rgba(194,251,119,256)',
                    42.18,
                    'rgba(194,251,119,256)',
                    43.72,
                    'rgba(241,255,109,256)',
                    48.87,
                    'rgba(241,255,109,256)',
                    50.41,
                    'rgba(256,256,256,256)',
                    57.61,
                    'rgba(256,256,256,256)',
                    59.16,
                    'rgba(0,256,256,256)',
                    68.93,
                    'rgba(0,256,256,256)',
                    69.44,
                    'rgba(256,37,256,256)'
                ]
            }
        });
    }

    const addLayer = () => {
        if (!mapRef.current) {
            console.error("Map is not ready yet.");
            return;
        }

        // Trigger file picker
        fileInputRef.current.value = null; // Reset previous file
        fileInputRef.current.click();
    };

    const handleGeoJSONUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            let geojson;
            try {
                geojson = JSON.parse(e.target.result);
            } catch (err) {
                console.error("Invalid JSON:", err);
                return;
            }

            const timestamp = Date.now();
            const sourceId = `geojson-source-${timestamp}`;
            const fillLayerId = `geojson-fill-${timestamp}`;
            const lineLayerId = `geojson-line-${timestamp}`;

            const map = mapRef.current;

            // Add the GeoJSON source
            map.addSource(sourceId, {
                type: "geojson",
                data: geojson,
            });

            // Add fill layer
            map.addLayer({
                id: fillLayerId,
                type: "fill",
                source: sourceId,
                layout: {},
                paint: {
                    "fill-color": "#0080ff",
                    "fill-opacity": 0.5,
                },
            });

            // Add line layer
            map.addLayer({
                id: lineLayerId,
                type: "line",
                source: sourceId,
                layout: {},
                paint: {
                    "line-color": "#000",
                    "line-width": 2,
                },
            });

            // Generate unique layer name
            const baseName = file.name.replace(/\.[^/.]+$/, "") || "Layer";
            let counter = 1;
            let uniqueName = baseName;
            const existingNames = layers.map((l) => l.name);
            while (existingNames.includes(uniqueName)) {
                uniqueName = `${baseName} ${counter++}`;
            }

            // Add to UI state
            setLayers((prev) => [
                ...prev,
                {
                    id: sourceId,
                    name: uniqueName,
                    visible: true,
                    locked: false,
                    fillId: fillLayerId,
                    lineId: lineLayerId,
                },
            ]);

            console.log("GeoJSON source + layers added:", sourceId);
        };

        reader.readAsText(file);
    };

    const toggleLayerVisibility = (id) => {
        const layer = layers.find(layer => layer.id === id);
        if (!layer) {
            console.warn(`Layer with ID ${id} not found.`);
            return;
        }

        const newVisibility = !layer.visible;
        const map = mapRef.current;

        if (!map) {
            console.error("Map is not ready.");
            return;
        }

        const layerIds = [layer.fillId, layer.lineId];

        layerIds.forEach(layerId => {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(
                    layerId,
                    'visibility',
                    newVisibility ? 'visible' : 'none'
                );
            } else {
                console.warn(`Layer ${layerId} not found on map.`);
            }
        });

        // Update UI state
        setLayers(prevLayers =>
            prevLayers.map(l =>
                l.id === id ? { ...l, visible: newVisibility } : l
            )
        );

        console.log(
            `Toggled visibility for layer ${layer.fillId} and ${layer.lineId} to ${newVisibility ? 'visible' : 'hidden'}`
        );
    };

    const toggleLayerLock = (id) => {
        if (!id) {
            console.warn("No layer ID provided for toggleLayerLock.");
            return;
        }

        const targetLayer = layers.find(l => l.id === id);
        if (!targetLayer) {
            console.warn(`Layer with ID ${id} not found.`);
            return;
        }

        const newLockedStatus = !targetLayer.locked;

        setLayers(prevLayers =>
            prevLayers.map(layer =>
                layer.id === id ? { ...layer, locked: newLockedStatus } : layer
            )
        );

        console.log(`Toggled lock for layer: ${id} => ${newLockedStatus}`);
    };

    const removeLayer = (sourceId) => {
        const map = mapRef.current;
        if (!map) {
            console.error("Map is not ready.");
            return;
        }

        const targetLayer = layers.find(l => l.id === sourceId);
        if (!targetLayer) {
            console.warn(`Layer with source ID ${sourceId} not found.`);
            return;
        }

        // Remove fill and line layers if they exist
        [targetLayer.fillId, targetLayer.lineId].forEach(layerId => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
        });

        // Remove the source
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }

        // Update UI state
        setLayers(prevLayers => prevLayers.filter(layer => layer.id !== sourceId));

        console.log(`Removed layer and source: ${sourceId}`);
    };

    const updateLayerName = (id, newName) => {
        if (!id) {
            console.warn("No layer ID provided for updateLayerName.");
            return;
        }

        setLayers(prevLayers =>
            prevLayers.map(layer =>
                layer.id === id ? { ...layer, name: newName } : layer
            )
        );

        console.log(`Updated layer name for ${id} to "${newName}"`);
    };

    const setActiveLayer = (id) => {
        // Find the layer in your UI state
        const layer = layers.find(layer => layer.id === id);

        if (!layer) {
            console.warn(`Layer with ID ${id} not found.`);
            return;
        }

        // Logic to set the active layer
        setActiveLayerId(id);
        console.log(`Layer ${id} is now active.`);
    };

    return (
        <div
            style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "12px",
                zIndex: 3,
                width: "250px",
                maxHeight: isCollapsed ? "50px" : "300px",
                overflowY: isCollapsed ? "hidden" : "auto",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "max-height 0.3s ease-in-out",
            }}
        >
            {/* Header with Collapse Toggle */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: isCollapsed ? "0" : "10px",
                    cursor: "pointer",
                }}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <span>Layers</span>
                <div>
                    {isCollapsed ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </div>

            {/* Layer Items - Only show if expanded */}
            {!isCollapsed && (
                <>
                    <ul style={{ padding: 0, listStyleType: "none" }}>
                        {layers.map((layer, index) => (
                            <LayerItem
                                key={layer.id}
                                layer={layer}
                                toggleLayerVisibility={toggleLayerVisibility}
                                toggleLayerLock={toggleLayerLock}
                                removeLayer={removeLayer}
                                updateLayerName={updateLayerName}
                                isActiveLayer={activeLayerId === layer.id}
                                setActiveLayer={setActiveLayer}
                                index={index}
                                onDragStart={() => { }}
                                onDragOver={() => { }}
                                onDrop={() => { }}
                            />
                        ))}
                    </ul>

                    {/* Add Layer Button */}
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <button onClick={addLayer}
                            style={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                padding: "8px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                width: "100%",
                            }}
                        >
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

                    {/* <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <button
                            onClick={windLayer}
                            style={{
                                backgroundColor: "#2196F3",
                                color: "white",
                                border: "none",
                                padding: "8px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                width: "100%",
                                marginTop: "5px"
                            }}
                        >
                            🌬️ Add Wind Layer
                        </button>
                    </div> */}
                </>
            )}
        </div>
    );
};

export default LayerPanel;
