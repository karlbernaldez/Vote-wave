import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { loadImage, initTyphoonLayer, initDrawControl } from './mapUtils';

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
  if (!map) {
    console.warn('No map instance provided');
    return;
  }

  mapRef.current = map;
  map.addControl(new mapboxgl.NavigationControl());

  loadImage(map, 'typhoon-marker', '/hurricane.png');
  loadImage(map, 'low-pressure-icon', '/LPA.png');
  initTyphoonLayer(map);

  const draw = initDrawControl(map);
  setDrawInstance(draw);

  const featuresArray = Array.isArray(initialFeatures)
    ? initialFeatures
    : (initialFeatures?.features && Array.isArray(initialFeatures.features))
    ? initialFeatures.features
    : [];

  let polygonCount = 0;
  let totalLineCount = 0;

  // Fix malformed LineString coordinates
  featuresArray.forEach((feature) => {
    if (
      feature.geometry?.type === 'LineString' &&
      Array.isArray(feature.geometry.coordinates) &&
      feature.geometry.coordinates.length === 1 &&
      Array.isArray(feature.geometry.coordinates[0]) &&
      Array.isArray(feature.geometry.coordinates[0][0])
    ) {
      feature.geometry.coordinates = feature.geometry.coordinates[0];
    }
  });

  const frontLines = [];
  const nonFrontLines = [];

  // Classify and process features
  featuresArray.forEach((feature) => {
    const type = feature.geometry?.type;
    if (type === 'Polygon') {
      polygonCount++;
      const cleanFeature = {
        type: 'Feature',
        geometry: feature.geometry,
        properties: feature.properties || {},
      };
      draw.add(cleanFeature);
    } else if (type === 'LineString') {
      totalLineCount++;
      if (feature.properties?.isFront) {
        frontLines.push(feature);
      } else {
        nonFrontLines.push(feature);
      }
    }
  });

  if (typeof setLineCount === 'function') {
    setLineCount(totalLineCount);
  }

  console.log(`📏 Total Lines: ${totalLineCount}`);
  console.log(`🔲 Polygons: ${polygonCount}`);
  console.log(`🔺 Front Lines: ${frontLines.length}`);
  console.log(`🔹 Non-front Lines: ${nonFrontLines.length}`);

  // === Non-front lines layer with labels ===
  if (nonFrontLines.length > 0) {
    map.addSource('non-front-lines', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: nonFrontLines,
      },
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

    const labelFeatures = [];

    nonFrontLines.forEach((feature, index) => {
      const coords = feature.geometry.coordinates;
      const props = feature.properties || {};
      const labelValue = props.labelValue || index + 1;
      const closedMode = props.closedMode;

      if (!Array.isArray(coords) || coords.length < 2) return;

      if (closedMode) {
        const [lng, lat] = coords[0];
        labelFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: { text: String(labelValue) },
        });
      } else {
        const [lng1, lat1] = coords[0];
        const [lng2, lat2] = coords[coords.length - 1];

        labelFeatures.push(
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [lng1, lat1] },
            properties: { text: String(labelValue) },
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [lng2, lat2] },
            properties: { text: String(labelValue) },
          }
        );
      }
    });

    map.addSource('non-front-labels', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: labelFeatures,
      },
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

  // === Front lines: blue + animated red dash (no labels) ===
  if (frontLines.length > 0) {
    map.addSource('front-lines', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: frontLines,
      },
    });

    const bgLayerId = 'front-line-bg';
    const dashedLayerId = 'front-line-dash';

    map.addLayer({
      id: bgLayerId,
      type: 'line',
      source: 'front-lines',
      paint: {
        'line-color': '#0000FF',
        'line-width': 6,
        'line-opacity': 0.8,
      },
    });

    map.addLayer({
      id: dashedLayerId,
      type: 'line',
      source: 'front-lines',
      paint: {
        'line-color': '#FF0000',
        'line-width': 6,
        'line-dasharray': [0, 4, 3],
      },
    });

    const dashArraySequence = [
      [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0],
      [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2],
      [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
    ];

    let step = 0;
    function animateDashArray(timestamp) {
      const newStep = parseInt((timestamp / 150) % dashArraySequence.length);
      if (newStep !== step) {
        map.setPaintProperty(dashedLayerId, 'line-dasharray', dashArraySequence[newStep]);
        step = newStep;
      }
      requestAnimationFrame(animateDashArray);
    }
    animateDashArray(0);
  }

  setMapLoaded(true);

  // Handle point creation
  map.on('draw.create', (e) => {
    const feature = e.features[0];
    if (feature?.geometry?.type === 'Point') {
      const [lng, lat] = feature.geometry.coordinates;
      setSelectedPoint({ lng, lat });
      setShowTitleModal(true);
      draw.delete(feature.id);
    }
  });
}
