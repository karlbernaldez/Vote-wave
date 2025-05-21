import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';
import { saveFeature } from '../../../api/featureServices';
const DrawingCanvas = ({ mapRef, drawCounter, setDrawCounter, setLayersRef }) => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const map = mapRef.current;

  // Prevent page scroll during touch drawing
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    document.body.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  const convertToGeoJSON = () => {
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

  const downloadGeoJSON = () => {
    const geojson = convertToGeoJSON();
    if (!geojson) return;

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'drawing.geojson';
    link.click();
  };

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const updatedLines = lines.slice(0, -1).concat(lastLine);
    setLines(updatedLines);
  };

  const handlePointerUp = () => {
    if (!map) return;

    isDrawing.current = false;
    const geojson = convertToGeoJSON();

    const nextCounter = drawCounter + 1; // Calculate next value first
    const sourceId = `draw-${nextCounter}`;
    const layerId = `freehand-${nextCounter}`;

    console.log(`Drawing finished. Generating source and layer with IDs:`);
    console.log(`Source ID: ${sourceId}`);
    console.log(`Layer ID: ${layerId}`);

    // Remove existing source/layer if necessary
    if (map.getSource(sourceId)) {
      console.log(`Source with ID ${sourceId} already exists. Removing it.`);
      map.removeSource(sourceId);
    }

    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson,
    });

    console.log(`Source with ID ${sourceId} added to the map.`);

    if (map.getLayer(layerId)) {
      console.log(`Layer with ID ${layerId} already exists. Removing it.`);
      map.removeLayer(layerId);
    }

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
    });
    console.log(`Layer with ID ${layerId} added to the map.`);

    if (geojson.features.length > 0) {
      const feature = geojson.features[0]; // Since each draw produces one feature

      saveFeature({
        geometry: feature.geometry,
        properties: feature.properties || {},
        name: 'Freehand Layer',
        sourceId: sourceId,
      })
        .then(() => {
          console.log('Feature saved successfully.');
        })
        .catch((err) => {
          console.error('Error saving feature:', err);
        });
    }

    // Update React state
    if (typeof setLayersRef?.current === 'function') {
      const baseName = 'Freehand Layer';

      setLayersRef.current((prevLayers) => {
        let counter = 1;
        let uniqueName = baseName;
        const existingNames = prevLayers.map((l) => l.name);

        while (existingNames.includes(uniqueName)) {
          uniqueName = `${baseName} ${counter++}`;
        }

        return [
          ...prevLayers,
          {
            id: layerId, // ✅ Corrected casing
            sourceID:sourceId,
            name: uniqueName,
            visible: true,
            locked: false,
          },
        ];
      });
    }

    // Finally update drawCounter
    setDrawCounter(nextCounter);
    setLines([]);
  };

  return (
    <div>
      <button
        onClick={downloadGeoJSON}
        style={{ position: 'absolute', zIndex: 100, top: '10px', right: '3rem' }}
      >
        Download GeoJSON
      </button>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          pointerEvents: 'auto',
        }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="red"
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingCanvas;
