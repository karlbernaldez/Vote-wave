import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { loadImage, initTyphoonLayer, initDrawControl } from './mapUtils'; // helper imports

export function setupMap({
  map,
  mapRef,
  setDrawInstance,
  setMapLoaded,
  setSelectedPoint,
  setShowTitleModal,
  setLineCount, // callback to pass lineCount back
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

  // Normalize incoming feature array
  const featuresArray = Array.isArray(initialFeatures)
    ? initialFeatures
    : (initialFeatures && Array.isArray(initialFeatures.features) ? initialFeatures.features : []);

  let lineCount = 0;
  let polygonCount = 0;

  // Fix nested LineString coordinate issues
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

  // Count and handle Polygons vs Lines
  featuresArray.forEach((feature, i) => {
    const type = feature.geometry?.type;
    if (type === 'Polygon') {
      polygonCount++;

      // 🧼 Sanitize for draw.add (remove Mongo-specific props)
      const cleanFeature = {
        type: 'Feature',
        geometry: feature.geometry,
        properties: feature.properties || {},
      };

      console.log(`➕ Drawing polygon via draw.add`, cleanFeature);
      draw.add(cleanFeature);
    } else if (type === 'LineString') {
      lineCount++;
    }
  });

  // Pass back line count
  if (typeof setLineCount === 'function') {
    setLineCount(lineCount);
  }

  console.log(`📏 Lines: ${lineCount}`);
  console.log(`🔲 Polygons: ${polygonCount}`);

  if (lineCount > 0) {
    const lineFeatures = featuresArray.filter((f) => f.geometry?.type === 'LineString');

    const lineFeatureCollection = {
      type: 'FeatureCollection',
      features: lineFeatures,
    };

    // Remove existing layers/sources if present
    if (map.getSource('initial-features')) {
      map.removeLayer('initial-lines-layer');
      map.removeLayer('initial-label-layer');
      map.removeSource('initial-features');
      map.removeSource('initial-label-source');
    }

    map.addSource('initial-features', {
      type: 'geojson',
      data: lineFeatureCollection,
    });

    map.addLayer({
      id: 'initial-lines-layer',
      type: 'line',
      source: 'initial-features',
      paint: {
        'line-color': '#0080ff',
        'line-opacity': 0.5,
        'line-width': 2,
      },
      filter: ['==', '$type', 'LineString'],
    });

    // Generate line endpoint label points
    const lineLabelFeatures = [];

    lineFeatures.forEach((feature, index) => {
      const coords = feature.geometry.coordinates;
      const props = feature.properties || {};
      const labelValue = props.labelValue || index + 1;
      const closedMode = props.closedMode;

      if (!Array.isArray(coords) || coords.length < 2) return;

      if (closedMode) {
        const [lng, lat] = coords[0];
        lineLabelFeatures.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          properties: {
            text: String(labelValue),
          },
        });
      } else {
        const [lng1, lat1] = coords[0];
        const [lng2, lat2] = coords[coords.length - 1];

        lineLabelFeatures.push(
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng1, lat1],
            },
            properties: {
              text: String(labelValue),
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng2, lat2],
            },
            properties: {
              text: String(labelValue),
            },
          }
        );
      }
    });

    map.addSource('initial-label-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: lineLabelFeatures,
      },
    });

    map.addLayer({
      id: 'initial-label-layer',
      type: 'symbol',
      source: 'initial-label-source',
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

  setMapLoaded(true);

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
