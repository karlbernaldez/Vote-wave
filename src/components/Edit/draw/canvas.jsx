import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';
import { saveFeature } from '../../../api/featureServices';

import {
  convertToGeoJSON,
  downloadGeoJSON,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
} from './canvasUtils';

const DrawingCanvas = ({ mapRef, drawCounter, setDrawCounter, setLayersRef, closedMode }) => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    document.body.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => downloadGeoJSON(lines, mapRef)}
        style={{ position: 'absolute', zIndex: 100, top: '10px', right: '3rem' }}
      >
        Download GeoJSON
      </button>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={(e) => handlePointerDown(e, lines, setLines, isDrawing)}
        onPointerMove={(e) => handlePointerMove(e, lines, setLines, isDrawing)}
        onPointerUp={() =>
          handlePointerUp(
            mapRef,
            lines,
            setLines,
            isDrawing,
            drawCounter,
            setDrawCounter,
            setLayersRef,
            saveFeature,
            closedMode
          )
        }
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
