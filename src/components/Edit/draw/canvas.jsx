import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';

const DrawingCanvas = ({ mapRef, drawCounter, setDrawCounter }) => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const map = mapRef.current;

  // Function to convert drawing to GeoJSON format
  const convertToGeoJSON = () => {
    if (!mapRef.current) {
      console.error('Map reference is not available!');
      return null;
    }

    const geojsonFeatures = lines.map((line) => {
      const coords = [];

      // Convert each screen point to map coordinates (lng, lat)
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

  // Function to trigger the download of the GeoJSON file
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

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const updatedLines = lines.slice(0, -1).concat(lastLine);
    setLines(updatedLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    const geojson = convertToGeoJSON();

    // Increment the counter for each drawing and update the state
    setDrawCounter((prevCounter) => prevCounter + 1);

    const sourceId = `draw-${drawCounter + 1}`;  // Unique ID for each source
    const layerId = `layer-${drawCounter + 1}`;  // Unique ID for each layer

    // Log the generated source and layer IDs for debugging
    console.log(`Drawing finished. Generating source and layer with IDs:`);
    console.log(`Source ID: ${sourceId}`);
    console.log(`Layer ID: ${layerId}`);

    // Add the source with the unique ID
    if (map.getSource(sourceId)) {
      console.log(`Source with ID ${sourceId} already exists. Removing it.`);
      map.removeSource(sourceId); // Remove existing source if it exists
    }

    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson,
    });

    // Log source addition
    console.log(`Source with ID ${sourceId} added to the map.`);

    // Add the layer with the unique ID
    if (map.getLayer(layerId)) {
      console.log(`Layer with ID ${layerId} already exists. Removing it.`);
      map.removeLayer(layerId); // Remove existing layer if it exists
    }

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {},
      paint: {
        'line-color': '#0080ff',
        'line-opacity': 0.5,
        'line-width': 2, // Customize the line width if needed
      },
    });

    // Log layer addition
    console.log(`Layer with ID ${layerId} added to the map.`);
  };

  return (
    <div>
      {/* Button to trigger download */}
      <button onClick={downloadGeoJSON} style={{ position: 'absolute', zIndex: 100, top: '10px', left: '10px' }}>
        Download GeoJSON
      </button>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
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
