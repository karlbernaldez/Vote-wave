import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawLineString from "../components/Edit/draw/linestring";
import DrawRectangle from "../components/Edit/draw/rectangle";
import DrawCircle from "../components/Edit/draw/circle";
import SimpleSelect from "../components/Edit/draw/simple_select";
import drawStyles from "../components/Edit/draw/styles";

const mapboxgl = require('mapbox-gl');

export function setupMap({ map, mapRef, setDrawInstance, setMapLoaded, setSelectedPoint, setShowTitleModal, initialFeatures = [] }) {
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
      draw_circle: DrawCircle
    },
    styles: drawStyles
  });

  map.addControl(draw);
  initialFeatures.forEach(feature => {
    draw.add(feature);
  });
  setDrawInstance(draw);
  setMapLoaded(true);

  map.loadImage('/map-pin.png', (error, image) => {
    if (!error && !map.hasImage('custom-marker')) {
      map.addImage('custom-marker', image);
    }
  });

  map.addSource('custom-points', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] }
  });

  map.addLayer({
    id: 'custom-points-layer',
    type: 'symbol',
    source: 'custom-points',
    layout: {
      'icon-image': 'custom-marker',
      'icon-size': 0.2,
      'text-field': ['get', 'title'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 1.50],
      'text-anchor': 'top'
    }
  });

  map.on('draw.create', (e) => {
    const feature = e.features[0];
    if (feature?.geometry.type === 'Point') {
      const [lng, lat] = feature.geometry.coordinates;
      setSelectedPoint({ lng, lat });
      setShowTitleModal(true);
      draw.delete(feature.id);
    }
  });
};
