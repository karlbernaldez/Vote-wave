import MapboxDraw from '@mapbox/mapbox-gl-draw';
import DrawLineString from '../components/Edit/draw/linestring';
import DrawRectangle from '../components/Edit/draw/rectangle';
import DrawCircle from '../components/Edit/draw/circle';
import SimpleSelect from '../components/Edit/draw/simple_select';
import drawStyles from '../components/Edit/draw/styles';

/** Load image to map if not loaded yet */
export function loadImage(map, name, path) {
  if (!map.hasImage(name)) {
    map.loadImage(path, (error, image) => {
      if (error) {
        console.error(`Error loading image ${name} from ${path}:`, error);
        return;
      }
      if (!map.hasImage(name)) {
        map.addImage(name, image);
        console.log(`Image ${name} loaded successfully from ${path}`);
      }
    });
  }
}

/** Initialize typhoon marker source and layer */
export function initTyphoonLayer(map) {
  if (!map.getSource('typhoon-points')) {
    map.addSource('typhoon-points', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
  }

  if (!map.getLayer('typhoon-layer')) {
    map.addLayer({
      id: 'typhoon-layer',
      type: 'symbol',
      source: 'typhoon-points',
      layout: {
        'icon-image': ['get', 'icon'],
        'icon-size': [
          'case',
          ['==', ['get', 'markerType'], 'low_pressure'],
          0.2,
          0.09,
        ],
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [
          'case',
          ['==', ['get', 'markerType'], 'low_pressure'],
          [0, 2.0],
          [0, 1.25],
        ],
        'text-anchor': 'top',
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
      },
      minzoom: 0,
      maxzoom: 24,
    });
  }
}

/** Initialize Mapbox Draw instance with custom modes and styles */
export function initDrawControl(map) {
  if (map.drawControl) {
    // Already initialized
    return map.drawControl;
  }

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
  map.drawControl = draw; // store instance to avoid duplicates
  return draw;
}

/**
 * Add a typhoon or low pressure marker point feature to the map source.
 * @param {object} selectedPoint - {lng, lat} coordinates
 * @param {object} mapRef - React ref to Mapbox map instance
 * @param {function} setShowTitleModal - callback to hide title modal
 * @param {string} type - feature type, e.g. 'draw_point' or 'low_pressure'
 * @returns {function} - function accepting the title string
 */
export const typhoonMarker = (selectedPoint, mapRef, setShowTitleModal, type) => (title) => {
  if (!selectedPoint) return;

  const { lng, lat } = selectedPoint;

  const iconMap = {
    draw_point: 'typhoon-marker',
    low_pressure: 'low-pressure-icon',
  };

  const defaultTitles = {
    draw_point: 'Typhoon',
    low_pressure: 'LPA',
  };

  const customPoint = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: {
      title: title || defaultTitles[type],
      markerType: type,
      icon: iconMap[type] || 'typhoon-marker',
    },
  };

  const source = mapRef.current?.getSource('typhoon-points');
  if (!source) return;

  const currentData = source._data || {
    type: 'FeatureCollection',
    features: [],
  };

  source.setData({
    ...currentData,
    features: [...currentData.features, customPoint],
  });

  setShowTitleModal(false);
};
