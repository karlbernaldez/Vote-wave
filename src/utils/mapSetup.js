import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {
  loadImage,
  initTyphoonLayer,
  initDrawControl,
  loadMarkerPoints,
  typhoonMarker as saveMarkerFn,
} from './mapUtils';

export function setupMap({
  map,
  mapRef,
  setDrawInstance,
  setMapLoaded,
  setSelectedPoint,
  setShowTitleModal,
  setLineCount,
  initialFeatures = [],
}) {
  if (!map) return console.warn('No map instance provided');

  mapRef.current = map;

  // Add navigation control only once
  if (!map.navigationControlAdded) {
    map.addControl(new mapboxgl.NavigationControl());
    map.navigationControlAdded = true;
  }

  loadImage(map, 'typhoon', '/hurricane.png');
  loadImage(map, 'low_pressure', '/LPA.png');
  initTyphoonLayer(map);

  const draw = initDrawControl(map);
  setDrawInstance(draw);

  const featuresArray = Array.isArray(initialFeatures)
    ? initialFeatures
    : initialFeatures?.features || [];

  const markerPoints = [];
  const frontLines = [];
  const nonFrontLines = [];

  let polygonCount = 0;
  let totalLineCount = 0;

  // === Classify features ===
  featuresArray.forEach((feature) => {
    const type = feature.geometry?.type;

    if (type === 'Point') {
      markerPoints.push(feature);
    } else if (type === 'Polygon') {
      polygonCount++;
      draw.add({
        type: 'Feature',
        geometry: feature.geometry,
        properties: feature.properties || {},
      });
    } else if (type === 'LineString') {
      totalLineCount++;

      // Fix malformed LineString
      const coords = feature.geometry?.coordinates;
      if (
        Array.isArray(coords) &&
        coords.length === 1 &&
        Array.isArray(coords[0]) &&
        Array.isArray(coords[0][0])
      ) {
        feature.geometry.coordinates = coords[0];
      }

      (feature.properties?.isFront ? frontLines : nonFrontLines).push(feature);
    }
  });

  if (typeof setLineCount === 'function') {
    setLineCount(totalLineCount);
  }

  // === Render Marker Points ===
  if (markerPoints.length > 0) {
    markerPoints.forEach((point) => {
      const coords = point.geometry?.coordinates || [];
      if (coords.length === 2 && typeof coords[0] === 'number') {
        const [lng, lat] = coords;
        const title = point.name || '';
        const sourceId = point.sourceId || 'typhoon';
        const markerType = sourceId.includes('_')
          ? sourceId.substring(0, sourceId.lastIndexOf('_'))
          : sourceId;

        saveMarkerFn({ lat, lng }, mapRef, () => { }, markerType)(title);
      }
    });
  }

  // === Non-front lines with labels ===
  if (nonFrontLines.length > 0) {
    map.addSource('non-front-lines', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: nonFrontLines },
    });

    map.addLayer({
      id: 'non-front-lines-layer',
      type: 'line',
      source: 'non-front-lines',
      paint: {
        'line-color': '#0080ff',
        'line-opacity': 0.5,
        'line-width': 2,
      },
      filter: ['==', '$type', 'LineString'],
    });

    const labelFeatures = nonFrontLines.flatMap((feature, index) => {
      const coords = feature.geometry?.coordinates;
      const props = feature.properties || {};
      const labelValue = String(props.labelValue || index + 1);
      const closedMode = props.closedMode;

      if (!Array.isArray(coords) || coords.length < 2) return [];

      if (closedMode) {
        const [lng, lat] = coords[0];
        return [{
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: { text: labelValue },
        }];
      } else {
        const [lng1, lat1] = coords[0];
        const [lng2, lat2] = coords[coords.length - 1];
        return [
          { type: 'Feature', geometry: { type: 'Point', coordinates: [lng1, lat1] }, properties: { text: labelValue } },
          { type: 'Feature', geometry: { type: 'Point', coordinates: [lng2, lat2] }, properties: { text: labelValue } },
        ];
      }
    });

    map.addSource('non-front-labels', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: labelFeatures },
    });

    map.addLayer({
      id: 'non-front-label-layer',
      type: 'symbol',
      source: 'non-front-labels',
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
    });
  }

  // === Front lines with animated dashed effect ===
  if (frontLines.length > 0) {
    map.addSource('front-lines', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: frontLines },
    });

    map.addLayer({
      id: 'front-line-bg',
      type: 'line',
      source: 'front-lines',
      paint: {
        'line-color': '#0000FF',
        'line-width': 6,
        'line-opacity': 0.8,
      },
    });

    map.addLayer({
      id: 'line-dash',
      type: 'line',
      source: 'front-lines',
      paint: {
        'line-color': '#FF0000',
        'line-width': 6,
        'line-dasharray': [0, 4, 3],
      },
    });

    const dashArraySequence = [
      [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5],
      [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0], [0, 0.5, 3, 3.5],
      [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2],
      [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
    ];

    // Animate dash array after map is idle and a short delay
    map.once('idle', () => {
      let step = 0;

      function animateDashArray(timestamp) {
        const newStep = Math.floor((timestamp / 150) % dashArraySequence.length);
        if (newStep !== step && map.getLayer('line-dash')) {
          try {
            map.setPaintProperty('line-dash', 'line-dasharray', dashArraySequence[newStep]);
            step = newStep;
          } catch (err) {
            console.warn("Layer might be missing or updated:", err);
          }
        }
        requestAnimationFrame(animateDashArray);
      }

      // Add delay before starting animation (e.g., 1000ms)
      setTimeout(() => {
        if (map.getLayer('line-dash')) {
          animateDashArray(0);
        } else {
          console.warn("Skipping animation: 'line-dash' layer not ready.");
        }
      }, 1000);
    });
  }

  // === draw.create event handler ===
  map.on('draw.create', (e) => {
    const feature = e.features[0];
    if (feature?.geometry.type === 'Point') {
      const [lng, lat] = feature.geometry.coordinates;
      setSelectedPoint({ lng, lat });
      setShowTitleModal(true);
      draw.delete(feature.id);
    }
  });

  setMapLoaded(true);
}
