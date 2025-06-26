import mapboxgl from 'mapbox-gl';
import { loadImage, initTyphoonLayer, initDrawControl, typhoonMarker as saveMarkerFn } from './mapUtils';

export function setupMap({ map, mapRef, setDrawInstance, setMapLoaded, setSelectedPoint, setShowTitleModal, setLineCount, initialFeatures = [], logger, setLoading, selectedToolRef}) {
  if (!map) return console.warn('No map instance provided');
  if (typeof setLoading === 'function') {
    setLoading(true)
  };

  if (!map._navigationControlAdded) {
    map.addControl(new mapboxgl.NavigationControl());
    map._navigationControlAdded = true;
  }

  mapRef.current = map;

  loadImage(map, 'typhoon', '/hurricane.png');
  loadImage(map, 'low_pressure', '/LPA.png');
  loadImage(map, 'high_pressure', '/HPA.png');
  loadImage(map, 'less_1', '/L1.png');

  map.on('load', () => {
    initTyphoonLayer(map);
  });

  const draw = initDrawControl(map);
  setDrawInstance(draw);

  const featuresArray = Array.isArray(initialFeatures)
    ? initialFeatures
    : initialFeatures?.features || [];

  const markerPoints = [];
  const frontLines = [];
  const nonFrontLines = [];

  let totalLineCount = 0;

  // === Classify features ===
  featuresArray.forEach((feature) => {
    const type = feature.geometry?.type;

    if (type === 'Point') {
      markerPoints.push(feature);
    } else if (type === 'Polygon') {
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
      const [points] = point.geometry?.coordinates || [];
      const [coordinates, s] = points;
      const [lng, lat] = coordinates;
      const title = point.name || '';
      const sourceId = point.sourceId || 'typhoon';
      const markerType = point.properties.type

      if (lng !== undefined && lat !== undefined) {
        saveMarkerFn({ lat, lng }, mapRef, () => { }, markerType)(title);
      }
    });
  }

  // === Non-front lines with labels ===
  if (nonFrontLines.length > 0) {
    nonFrontLines.forEach((feature) => {
      const geojsonFeature = {
        type: "Feature",
        geometry: feature.geometry,
        properties: feature.properties,
        id: feature._id,
      };

      const name = feature.sourceId;
      const sourceId = feature.sourceId || 'non-front-lines';

      map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonFeature,
      });

      // Determine if the line should be dashed
      const isDashed = feature.properties?.closedMode === false;

      map.addLayer({
        id: name,
        type: 'line',
        source: sourceId,
        slot: 'middle',
        paint: {
          'line-color': '#0080ff',
          'line-opacity': 0.5,
          'line-width': 2,
          'line-dasharray': isDashed ? [2, 2] : [], // Dashed line if not closedMode
        },
        filter: ['==', '$type', 'LineString'],
      });

      // Generate label features for this line
      const coords = feature.geometry?.coordinates;
      const props = feature.properties || {};
      const labelValue = String(props.labelValue || feature.name || 'Label');
      const closedMode = props.closedMode;
      const featureId = feature._id;

      if (Array.isArray(coords) && coords.length >= 2) {
        let points = [];

        if (closedMode) {
          const [lng, lat] = coords[0];
          points.push([lng, lat]);
        } else {
          const [lng1, lat1] = coords[0];
          const [lng2, lat2] = coords[coords.length - 1];
          points.push([lng1, lat1], [lng2, lat2]);
        }

        points.forEach((coord, i) => {
          const labelSourceId = `${name}-${i}`;
          const labelLayerId = `${name}-${i}`;

          map.addSource(labelSourceId, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  id: `${featureId}-${i}`,
                  geometry: { type: 'Point', coordinates: coord },
                  properties: { text: labelValue },
                },
              ],
            },
          });

          map.addLayer({
            id: labelLayerId,
            type: 'symbol',
            source: labelSourceId,
            slot: 'top',
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
        });
      }
    });
  }


  // === Front lines with animated dashed effect ===
  let animationFrameIds = [];

  if (frontLines.length > 0) {
    frontLines.forEach((feature, index) => {
      const sourceId = feature.sourceId;
      const bgLayerId = `${sourceId}_bg`;
      const dashLayerId = `${sourceId}_dash`;

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [feature],
        },
      });

      map.addLayer({
        id: bgLayerId,
        type: 'line',
        source: sourceId,
        slot: 'top',
        paint: {
          'line-color': '#0000FF',
          'line-width': 6,
          'line-opacity': 0.8,
        },
      });

      map.addLayer({
        id: dashLayerId,
        type: 'line',
        source: sourceId,
        slot: 'top',
        paint: {
          'line-color': '#FF0000',
          'line-width': 6,
          'line-dasharray': [0, 4, 3],
        },
      });

      const dashArraySequence = [
        [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1],
        [2.5, 4, 0.5], [3, 4, 0], [0, 0.5, 3, 3.5], [0, 1, 3, 3],
        [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5],
        [0, 3, 3, 1], [0, 3.5, 3, 0.5],
      ];

      // map.once('idle', () => {
      //   let step = 0;

      //   function animateDashArray(timestamp) {
      //     const layer = safeGetLayer(dashLayerId);
      //     if (!layer) {
      //       // Log a warning if the layer is not available
      //       console.warn(`Layer '${dashLayerId}' is not available. Skipping animation.`);
      //       return; // Return early if the layer is not found
      //     }

      //     const newStep = Math.floor((timestamp / 150) % dashArraySequence.length);
      //     if (newStep !== step) {
      //       try {
      //         map.setPaintProperty(dashLayerId, 'line-dasharray', dashArraySequence[newStep]);
      //         step = newStep;
      //       } catch (err) {
      //         console.warn(`Error updating dasharray for ${dashLayerId}:`, err);
      //         return;
      //       }
      //     }

      //     // Continue the animation
      //     animationFrameIds[index] = requestAnimationFrame(animateDashArray);
      //   }

      //   function tryStartAnimation(retries = 10) {
      //     const layer = safeGetLayer(dashLayerId);
      //     if (layer) {
      //       // If the layer exists, start the animation
      //       animationFrameIds[index] = requestAnimationFrame(animateDashArray);
      //     } else if (retries > 0) {
      //       // Retry after a delay if the layer is not ready
      //       setTimeout(() => tryStartAnimation(retries - 1), 300);
      //     } else {
      //       console.warn(`Skipping animation: '${dashLayerId}' not ready after retries.`);
      //     }
      //   }


      //   setTimeout(() => tryStartAnimation(), 300);
      // });
    });
  }

  // ✅ When fully idle (all sources & layers processed)
  map.once('idle', () => {
    if (typeof setLoading === 'function') setLoading(false); // ✅ Hide modal
    setMapLoaded(true);
  });

  // === Map loaded and draw.create handler ===
  map.on('draw.create', (e) => {
    const feature = e.features[0];

    if (feature?.geometry.type === 'Point') {
      const [lng, lat] = feature.geometry.coordinates;
      setSelectedPoint({ lng, lat });

      const selectedType = selectedToolRef?.current || '';

      if (selectedType.toLowerCase() !== 'less_1') {
        setShowTitleModal(true);
      }

      draw.delete(feature.id);
    }
  });

  setMapLoaded(true);

  // === Return cleanup function ===
  return function cleanup() {
    animationFrameIds.forEach(id => cancelAnimationFrame(id));
  };
}
