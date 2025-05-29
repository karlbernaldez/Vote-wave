import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawLineString from "../components/Edit/draw/linestring";
import DrawRectangle from "../components/Edit/draw/rectangle";
import DrawCircle from "../components/Edit/draw/circle";
import SimpleSelect from "../components/Edit/draw/simple_select";
import drawStyles from "../components/Edit/draw/styles";

const mapboxgl = require('mapbox-gl');

export function setupMap({
  map,
  mapRef,
  setDrawInstance,
  setMapLoaded,
  setSelectedPoint,
  setShowTitleModal,
  initialFeatures = [],
}) {
  mapRef.current = map;
  map.addControl(new mapboxgl.NavigationControl());

  const draw = new MapboxDraw({
    displayControlsDefault: false,
    modes: {
      ...MapboxDraw.modes,
      simple_select: SimpleSelect,
      direct_select: MapboxDraw.modes.direct_select,
      draw_line_string: DrawLineString,
      draw_rectangle: DrawRectangle,
      draw_circle: DrawCircle,
    },
    styles: drawStyles,
  });

  map.addControl(draw);

  // Load custom marker images
  const loadImageIfNeeded = (name, path) => {
    if (!map.hasImage(name)) {
      map.loadImage(path, (error, image) => {
        if (!error && !map.hasImage(name)) {
          map.addImage(name, image);
        }
      });
    }
  };

  loadImageIfNeeded('typhoon-marker', '/hurricane.png');
  loadImageIfNeeded('low-pressure-icon', '/LPA.png'); // <-- custom icon

  // Add GeoJSON source for markers
  map.addSource('typhoon-points', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  // Symbol layer using `icon` from each feature
  map.addLayer({
    id: 'typhoon-layer',
    type: 'symbol',
    source: 'typhoon-points',
    layout: {
      'icon-image': ['get', 'icon'], // dynamic from properties.icon
      'icon-size': [
        'case',
        ['==', ['get', 'markerType'], 'low_pressure'],
        0.2,  // double size for low_pressure
        0.09   // default size
      ],
      'text-field': ['get', 'title'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [
        'case',
        ['==', ['get', 'markerType'], 'low_pressure'],
        [0, 2.0], // higher offset for larger icon
        [0, 1.25] // default offset
      ],
      'text-anchor': 'top',
      'icon-allow-overlap': true,
      'text-allow-overlap': true,
    },
    minzoom: 0,
    maxzoom: 24,
  });

  // Add any initial features
  initialFeatures.forEach((feature) => {
    draw.add(feature);
  });

  setDrawInstance(draw);
  setMapLoaded(true);

  // Listen for point feature draw and trigger modal
  map.on('draw.create', (e) => {
    const feature = e.features[0];
    if (feature?.geometry.type === 'Point') {
      const [lng, lat] = feature.geometry.coordinates;
      setSelectedPoint({ lng, lat });
      setShowTitleModal(true);
      draw.delete(feature.id);
    }
  });
}
