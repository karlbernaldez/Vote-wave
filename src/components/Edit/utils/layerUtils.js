// components/utils/layerUtils.js
import { deleteFeature } from '../../../api/featureServices';
import { fill } from '../draw/styles';

export function addWindLayer(map) {
    map.addSource('wind_data_source', {
        type: 'raster-array',
        url: 'mapbox://karlbernaldizzy.noaa_grib',
        tileSize: 4320
    });

    map.addLayer({
        id: 'wind-layer',
        type: 'raster-particle',
        source: 'wind_data_source',
        'source-layer': '10m_wind',
        slot: 'bottom',
        paint: {
            'raster-particle-speed-factor': 0.4,
            'raster-particle-fade-opacity-factor': 0.9,
            'raster-particle-reset-rate-factor': 0.4,
            'raster-particle-count': 30000,
            'raster-particle-max-speed': 40,
            'raster-particle-color': [
                'interpolate',
                ['linear'],
                ['raster-particle-speed'],
                .8,
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

export function addGeoJsonLayer(map, file, layers, setLayers) {
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

        map.addSource(sourceId, {
            type: "geojson",
            data: geojson,
        });

        map.addLayer({
            id: fillLayerId,
            type: "fill",
            source: sourceId,
            slot: 'bottom',
            paint: {
                "fill-color": "#0080ff",
                "fill-opacity": 0.2,
            },
        });

        map.addLayer({
            id: lineLayerId,
            type: "line",
            source: sourceId,
            slot: 'bottom',
            paint: {
                "line-color": "#000",
                "line-width": 2,
            },
        });

        const baseName = file.name.replace(/\.[^/.]+$/, "") || "Layer";
        let counter = 1;
        let uniqueName = baseName;
        const existingNames = layers.map((l) => l.name);
        while (existingNames.includes(uniqueName)) {
            uniqueName = `${baseName} ${counter++}`;
        }

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
}

export function toggleLayerVisibility(map, layer, setLayers) {
    if (!map || !layer) return;

    const { name, id, fillId, lineId, visible } = layer;
    const newVisibility = visible ? 'none' : 'visible';

    const cleanedId = id.endsWith('_dash') ? id.slice(0, -5) : id;
    const bg = `${cleanedId}_bg`;
    const dash = `${cleanedId}_dash`;

    if (map.getLayer(name)) map.setLayoutProperty(name, 'visibility', newVisibility);
    if (map.getLayer(bg)) map.setLayoutProperty(bg, 'visibility', newVisibility);
    if (map.getLayer(dash)) map.setLayoutProperty(dash, 'visibility', newVisibility);

    // Toggle Draw-mode layers (e.g., lines and points)
    if (id && map.getLayer(id)) {
        const label0 = `${id}-0`;
        const label1 = `${id}-1`;
        const bg = `${id}_bg`;
        const dash = `${id}_dash`;

        map.setLayoutProperty(id, 'visibility', newVisibility);
        if (map.getLayer(label0)) map.setLayoutProperty(label0, 'visibility', newVisibility);
        if (map.getLayer(label1)) map.setLayoutProperty(label1, 'visibility', newVisibility);
    }

    // Toggle Polygon fill layer
    if (fillId && map.getLayer(fillId)) {
        map.setLayoutProperty(fillId, 'visibility', newVisibility);
    }

    // Toggle Polygon line layer
    if (lineId && map.getLayer(lineId)) {
        map.setLayoutProperty(lineId, 'visibility', newVisibility);
    }

    // Update visibility in state
    setLayers(prev =>
        prev.map(l =>
            l.id === id ? { ...l, visible: !visible } : l
        )
    );
}

export function toggleLayerLock(layer, setLayers) {
    setLayers((prev) =>
        prev.map((l) =>
            l.id === layer.id ? { ...l, locked: !l.locked } : l
        )
    );
}

export function removeLayer(map, layer, setLayers) {
    if (!map || !layer) return;

    const { name, id, fillId, lineId } = layer;
    const cleanedId = id.endsWith('_dash') ? id.slice(0, -5) : id;
    const bg = `${cleanedId}_bg`;
    const dash = `${cleanedId}_dash`;

    // Remove Draw-mode line and its label layers
    if (id) {
        const label0 = `${id}-0`;
        const label1 = `${id}-1`;

        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getLayer(label0)) map.removeLayer(label0);
        if (map.getLayer(label1)) map.removeLayer(label1);
        // if (map.getSource(layer.sourceId || name)) map.removeSource(layer.sourceId || name);
    }

    if (map.getLayer(name)) map.removeLayer(name);
    if (map.getLayer(id)) map.removeLayer(id);
    if (map.getLayer(bg)) map.removeLayer(bg);
    if (map.getLayer(dash)) map.removeLayer(dash);

    // Remove Polygon-specific layers
    if (fillId && map.getLayer(fillId)) map.removeLayer(fillId);
    if (lineId && map.getLayer(lineId)) map.removeLayer(lineId);

    // Remove source by id if exists
    if (id && map.getSource(id)) map.removeSource(id);

    // Update state
    setLayers((prev) => prev.filter((l) => l.id !== id));
}

export async function removeFeature(draw, layerID, featureID, layer) {

    // Delete from Mapbox Draw
    if (draw && typeof draw.delete === 'function') {
        draw.trash();
        draw.delete(featureID)
    }

    // Delete from backend
    try {
        const token = localStorage.getItem('authToken');

        if (featureID) {
            const cleanedFeatureID = typeof featureID === 'string' && featureID.endsWith('_dash')
                ? featureID.slice(0, -5)
                : featureID;
            console.log(`Deleting feature with ID: ${cleanedFeatureID}`);
            console.log(`Layer ID: ${layerID}`);
            await deleteFeature(cleanedFeatureID, token);
        } else {
            await deleteFeature(layerID, token);
        }

    } catch (error) {
        console.error(`Failed to delete feature ${layerID} from backend.`, error);
    }
}

export function updateLayerName(layerId, newName, setLayers) {
    setLayers((prev) =>
        prev.map((l) => (l.id === layerId ? { ...l, name: newName } : l))
    );
}

export const handleDragStart = (event, index, setDragging, setDraggedLayerIndex) => {
    setDragging(true);
    setDraggedLayerIndex(index); // Set the index of the layer being dragged
    event.dataTransfer.setData("text/plain", ""); // Necessary for the drag operation to work
};

export const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow dropping
};

export const handleDrop = (event, index, draggedLayerIndex, layers, setLayers, setDragging) => {
    event.preventDefault(); // Prevent default behavior (e.g., opening the file)
    setDragging(false); // Stop the dragging state

    // Reorder layers after the drop event
    if (draggedLayerIndex !== null && draggedLayerIndex !== index) {
        const layersCopy = [...layers];
        const draggedLayer = layersCopy[draggedLayerIndex];
        layersCopy.splice(draggedLayerIndex, 1); // Remove dragged layer
        layersCopy.splice(index, 0, draggedLayer); // Insert it at the new position
        setLayers(layersCopy); // Update state with the new layer order
    }
};