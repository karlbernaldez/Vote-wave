import React, { useState } from "react";
import LayerItem from "./LayerItem";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";

const LayerPanel = ({ mapRef }) => {
    const [layers, setLayers] = useState([]); // For managing the layers in the layer panel
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeLayerId, setActiveLayerId] = useState(null); // Track active layer

    const addLayer = () => {
        const timestamp = Date.now();
        const sourceId = `source-${timestamp}`;
        const fillLayerId = `fill-layer-${timestamp}`;
        const lineLayerId = `line-layer-${timestamp}`;

        const polygonFeature = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [122.52946485381574, 20.15812810738649],
                        [121.63823231078403, 20.115233014194153],
                        [120.75681959320941, 19.98703085962501],
                        [119.89487691520458, 19.774961709941373],
                        [119.06172285629205, 19.48139514041209],
                        [118.26619679705216, 19.109586109416675],
                        [117.51653135425762, 18.66361635602657],
                        [116.82024860020924, 18.148324103729998],
                        [116.18408190234604, 17.569225156275923],
                        [115.61392331363267, 16.93242850796723],
                        [115.11479478244323, 16.244549387617223],
                        [114.6908401726767, 15.51262226402145],
                        [114.34533426005895, 14.744015825313625],
                        [114.08070450231925, 13.946351371324587],
                        [113.89856142098127, 13.127425487069715],
                        [113.799733800308, 12.295137344955458],
                        [113.7843055102471, 11.457420547278204],
                        [113.85165150208844, 10.622179089233473],
                        [114.00047132601472, 9.797226804096553],
                        [114.22881931238312, 8.990229545243636],
                        [114.53413129304475, 8.208649356303479],
                        [114.91324837885315, 7.459689968475189],
                        [115.36243882912672, 6.7502431274194254],
                        [115.87741943042737, 6.0868354735070325],
                        [116.45337803360529, 5.475575959286118],
                        [117.08499897273154, 4.922104066065756],
                        [117.76649300608887, 4.4315393556714655],
                        [118.49163318389417, 4.008433141431398],
                        [119.25379767517227, 3.65672326272242],
                        [120.04602010320988, 3.379693080661228],
                        [120.86104738238089, 3.1799358637177693],
                        [121.691404465568, 3.0593256923188092],
                        [122.52946485381574, 3.0189958799172385],
                        [123.36752524206346, 3.0593256923188092],
                        [124.19788232525057, 3.1799358637177693],
                        [125.01290960442158, 3.379693080661228],
                        [125.80513203245923, 3.6567232627224184],
                        [126.56729652373733, 4.008433141431398],
                        [127.29243670154263, 4.431539355671466],
                        [127.97393073489994, 4.922104066065755],
                        [128.60555167402617, 5.475575959286117],
                        [129.18151027720413, 6.086835473507035],
                        [129.69649087850476, 6.75024312741942],
                        [130.14568132877832, 7.459689968475182],
                        [130.52479841458674, 8.20864935630348],
                        [130.83011039524834, 8.990229545243633],
                        [131.05845838161676, 9.797226804096546],
                        [131.20727820554302, 10.622179089233473],
                        [131.27462419738438, 11.457420547278202],
                        [131.25919590732346, 12.295137344955457],
                        [131.1603682866502, 13.127425487069715],
                        [130.9782252053122, 13.946351371324585],
                        [130.71359544757252, 14.744015825313626],
                        [130.36808953495478, 15.51262226402145],
                        [129.94413492518822, 16.24454938761722],
                        [129.4450063939988, 16.93242850796723],
                        [128.87484780528547, 17.569225156275923],
                        [128.23868110742222, 18.148324103729998],
                        [127.54239835337384, 18.66361635602657],
                        [126.7927329105793, 19.109586109416675],
                        [125.99720685133941, 19.48139514041209],
                        [125.16405279242693, 19.774961709941373],
                        [124.30211011442206, 19.98703085962501],
                        [123.42069739684742, 20.115233014194153],
                        [122.52946485381574, 20.15812810738649]
                    ]
                ]
            }
        };

        if (!mapRef.current) {
            console.error("Map is not ready yet.");
            return;
        }

        const map = mapRef.current;
        console.log("Map is Loaded:", map);

        // Add source if it doesn't exist
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: polygonFeature
            });
        }

        // Add fill layer
        if (!map.getLayer(fillLayerId)) {
            map.addLayer({
                id: fillLayerId,
                type: 'fill',
                source: sourceId,
                layout: {},
                paint: {
                    'fill-color': '#0080ff',
                    'fill-opacity': 0.5
                }
            });
        }

        // Add line layer
        if (!map.getLayer(lineLayerId)) {
            map.addLayer({
                id: lineLayerId,
                type: 'line',
                source: sourceId,
                layout: {},
                paint: {
                    'line-color': '#000',
                    'line-width': 3
                }
            });
        }

        const baseName = "Layer";
        let counter = 1;
        let uniqueName = `${baseName} ${counter}`;

        const existingNames = layers.map(layer => layer.name);

        while (existingNames.includes(uniqueName)) {
            counter++;
            uniqueName = `${baseName} ${counter}`;
        }

        // Create UI Layer entry (only use fill layer ID as representative)
        const newLayer = {
            id: fillLayerId,
            name: uniqueName,
            visible: true,
            locked: false,
            outlineId: lineLayerId, // for visibility toggling
        };

        setLayers(prevLayers => [...prevLayers, newLayer]);
        console.log("Layer Added to Map and UI Layer Panel");
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

        const layerIds = [id]; // this is the fill layer ID
        if (layer.outlineId) layerIds.push(layer.outlineId); // line layer ID

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
            `Toggled visibility for layer ${id}${layer.outlineId ? ` and outline ${layer.outlineId}` : ''} to ${newVisibility ? 'visible' : 'hidden'}`
        );
    };

    const toggleLayerLock = (id) => {
        if (!id) {
            console.warn("No layer ID provided for toggleLayerLock.");
            return;
        }

        setLayers(prevLayers =>
            prevLayers.map(layer =>
                layer.id === id ? { ...layer, locked: !layer.locked } : layer
            )
        );

        console.log(`Toggled lock for layer: ${id}`);
    };


    const removeLayer = (id) => {
        const map = mapRef.current;
        if (!map) {
            console.error("Map is not ready.");
            return;
        }

        // Remove layer(s)
        const layerIdsToRemove = [id, id.replace('fill-layer', 'line-layer')];
        layerIdsToRemove.forEach((layerId) => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
        });

        // Attempt to remove the source, only if no layers are using it
        const sourceId = id.replace('fill-layer', 'source');
        const layers = map.getStyle().layers;
        const sourceStillUsed = layers.some(layer => layer.source === sourceId);

        if (!sourceStillUsed && map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }

        // Remove from UI layer state
        setLayers(prevLayers => prevLayers.filter(layer => layer.id !== id));
    };

    const updateLayerName = (id, newName) => {
        // Logic to update layer name
        setLayers((prevLayers) =>
            prevLayers.map((layer) =>
                layer.id === id ? { ...layer, name: newName } : layer
            )
        );
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
                bottom: 100,
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
                        <button
                            onClick={addLayer}
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
                            <FaPlus /> Add Layer
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LayerPanel;
