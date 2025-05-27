// src/components/Edit/draw/drawingHelpers.js

export const convertToGeoJSON = (lines, mapRef) => {
  if (!mapRef.current) {
    console.error('Map reference is not available!');
    return null;
  }

  const geojsonFeatures = lines.map((line) => {
    const coords = [];

    for (let i = 0; i < line.points.length; i += 2) {
      const x = line.points[i];
      const y = line.points[i + 1];
      const lngLat = mapRef.current.unproject([x, y]);
      coords.push([lngLat.lng, lngLat.lat]);
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
      properties: {},
    };
  });

  return {
    type: 'FeatureCollection',
    features: geojsonFeatures,
  };
};

export const downloadGeoJSON = (lines, mapRef) => {
  const geojson = convertToGeoJSON(lines, mapRef);
  if (!geojson) return;

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: 'application/json',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'drawing.geojson';
  link.click();
};

export const handlePointerDown = (e, lines, setLines, isDrawing) => {
  isDrawing.current = true;
  const pos = e.target.getStage().getPointerPosition();
  setLines([...lines, { points: [pos.x, pos.y] }]);
};

export const handlePointerMove = (e, lines, setLines, isDrawing) => {
  if (!isDrawing.current) return;
  const stage = e.target.getStage();
  const point = stage.getPointerPosition();
  const lastLine = lines[lines.length - 1];
  lastLine.points = lastLine.points.concat([point.x, point.y]);

  const updatedLines = lines.slice(0, -1).concat(lastLine);
  setLines(updatedLines);
};

export const handlePointerUp = async (
  mapRef,
  lines,
  setLines,
  isDrawing,
  drawCounter,
  setDrawCounter,
  setLayersRef,
  saveFeature,
  closedMode
) => {
  const map = mapRef.current;
  if (!map) return;

  isDrawing.current = false;

  // --- CLOSE THE LAST LINE IF closedMode IS TRUE ---
  if (closedMode && lines.length > 0) {
    const lastLineIndex = lines.length - 1;
    const lastLine = { ...lines[lastLineIndex] };

    if (lastLine.points.length >= 4) {
      const firstX = lastLine.points[0];
      const firstY = lastLine.points[1];
      lastLine.points = [...lastLine.points, firstX, firstY];
      const updatedLines = [...lines];
      updatedLines[lastLineIndex] = lastLine;
      setLines(updatedLines);
      lines = updatedLines; // update local reference for further use
    }
  }

  // --- PROCEED WITH ORIGINAL FUNCTIONALITY ---
  const geojson = convertToGeoJSON(lines, mapRef);

  const nextCounter = drawCounter + 1;
  const sourceId = `draw-${nextCounter}`;
  const layerId = `freehand-${nextCounter}`;

  // Remove existing source/layer for drawing line if necessary
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }

  // Insert drawing line layer below custom-points-layer if exists, else top
  const beforeLayer = map.getLayer('custom-points-layer') ? 'custom-points-layer' : undefined;

  map.addSource(sourceId, {
    type: 'geojson',
    data: geojson,
  });

  map.addLayer({
    id: layerId,
    type: 'line',
    source: sourceId,
    layout: {},
    paint: {
      'line-color': '#0080ff',
      'line-opacity': 0.5,
      'line-width': 2,
    },
  }, beforeLayer);

  // --- ADD LABELS ---
  if (lines.length > 0) {
    const lastLine = lines[lines.length - 1];
    if (lastLine.points.length >= 4) {
      const labelSourceId = `label-${nextCounter}`;
      const labelLayerId = `label-layer-${nextCounter}`;

      // Remove old label source/layer if exists
      if (map.getLayer(labelLayerId)) {
        map.removeLayer(labelLayerId);
      }
      if (map.getSource(labelSourceId)) {
        map.removeSource(labelSourceId);
      }

      let features = [];

      if (closedMode) {
        // Label at closing point (first point), default "5"
        const firstX = lastLine.points[0];
        const firstY = lastLine.points[1];
        const lngLat = map.unproject([firstX, firstY]);
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lngLat.lng, lngLat.lat],
          },
          properties: {
            text: '5',
          },
        });
      } else {
        // Label at both ends, default "3"
        const firstX = lastLine.points[0];
        const firstY = lastLine.points[1];
        const lastX = lastLine.points[lastLine.points.length - 2];
        const lastY = lastLine.points[lastLine.points.length - 1];

        const firstLngLat = map.unproject([firstX, firstY]);
        const lastLngLat = map.unproject([lastX, lastY]);

        features.push(
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [firstLngLat.lng, firstLngLat.lat],
            },
            properties: {
              text: '3',
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lastLngLat.lng, lastLngLat.lat],
            },
            properties: {
              text: '3',
            },
          }
        );
      }

      const labelGeoJSON = {
        type: 'FeatureCollection',
        features,
      };

      map.addSource(labelSourceId, {
        type: 'geojson',
        data: labelGeoJSON,
      });

      map.addLayer({
        id: labelLayerId,
        type: 'symbol',
        source: labelSourceId,
        layout: {
          'text-field': ['get', 'text'],
          'text-size': 18,
          'text-anchor': 'bottom',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': '#FF0000',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2,
        },
      }, beforeLayer);
    }
  }

  // Bring custom-points-layer to top so it doesn't get hidden
  if (map.getLayer('custom-points-layer')) {
    try {
      map.moveLayer('custom-points-layer');
    } catch (e) {
      console.warn('Could not move custom-points-layer:', e);
    }
  }

  // Update React state and save feature with unique name
  if (typeof setLayersRef?.current === 'function') {
    const baseName = 'Freehand Layer';

    setLayersRef.current((prevLayers) => {
      let counter = 1;
      let uniqueName = baseName;
      const existingNames = prevLayers.map((l) => l.name);

      while (existingNames.includes(uniqueName)) {
        uniqueName = `${baseName} ${counter++}`;
      }

      if (geojson.features.length > 0) {
        const feature = geojson.features[0];

        saveFeature({
          geometry: feature.geometry,
          properties: feature.properties || {},
          name: uniqueName,
          sourceId: sourceId,
        })
          .then(() => {
            console.log('Feature saved successfully.');
          })
          .catch((err) => {
            console.error('Error saving feature:', err);
          });
      }

      return [
        ...prevLayers,
        {
          id: layerId,
          sourceID: sourceId,
          name: uniqueName,
          visible: true,
          locked: false,
        },
      ];
    });
  }

  setDrawCounter(nextCounter);
  setLines([]);
};
