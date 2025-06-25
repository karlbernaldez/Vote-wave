import MapboxDraw from '@mapbox/mapbox-gl-draw';
import DrawLineString from '../components/Edit/draw/linestring';
import DrawRectangle from '../components/Edit/draw/rectangle';
import DrawCircle from '../components/Edit/draw/circle';
import SimpleSelect from '../components/Edit/draw/simple_select';
import drawStyles from '../components/Edit/draw/styles';


export function loadImage(map, name, path) {
  if (!map.hasImage(name)) {
    map.loadImage(path, (error, image) => {
      if (error) {
        console.error(`Error loading image ${name} from ${path}:`, error);
        return;
      }
      if (!map.hasImage(name)) {
        map.addImage(name, image);
        // console.log(`Image ${name} loaded successfully from ${path}`);
      }
    });
  }
}

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
      slot: 'top',
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
      paint: {
        'text-color': 'red',
      },
      minzoom: 0,
      maxzoom: 24,
    });
    // console.log('✅ Typhoon layer initialized.');
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
  if (!selectedPoint) {
    console.warn('⚠️ No selected point provided.');
    return;
  }

  const { lng, lat } = selectedPoint;

  const iconMap = {
    typhoon: 'typhoon',           // Icon for Typhoon
    low_pressure: 'low_pressure', // Icon for Low Pressure Area (LPA)
    high_pressure: 'high_pressure',
    less_1: 'less_1'
  };

  const defaultTitles = {
    typhoon: 'Typhoon',
    low_pressure: 'LPA',
  };

  const markerType = type;
  const iconName = iconMap[markerType];  // Default to typhoon if not specified
  const feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lng, lat],
    },
    properties: {
      title: title || defaultTitles[markerType],  // Use LPA title if no title provided
      markerType,
      icon: iconName, // Ensure the correct icon is associated with the marker
    },
  };

  const map = mapRef.current;
  if (!map) {
    console.error('❌ Map reference is null.');
    return;
  }

  const sourceId = `${title}`;
  const layerId = `${title}`;

  // // Remove old source and layer if they exist
  // if (map.getSource(sourceId)) {
  //   map.removeSource(sourceId);
  // }
  // if (map.getLayer(layerId)) {
  //   map.removeLayer(layerId);
  // }

  // Add source for marker
  try {
    map.addSource(sourceId, {
      type: 'geojson',
      data: feature,
    });
  } catch (error) {
    map.removeSource(sourceId);
    map.removeLayer(layerId);
    console.error(`❌ Failed to add source "${sourceId}":`, error);
  }


  // Build layout object conditionally: omit text-related props if type === 'less_1'
  const layout = {
    'icon-image': ['get', 'icon'],
    'icon-size': [
      'case',
      ['==', ['get', 'markerType'], 'low_pressure'],
      0.1,
      ['==', ['get', 'markerType'], 'less_1'],
      0.28,   // 0.07 * 4 = 0.28 for less_1 (4x bigger)
      0.07,   // default size for others (e.g., typhoon)
    ],
    'icon-allow-overlap': true,
  };

  if (markerType !== 'less_1') {
    layout['text-field'] = ['get', 'title'];
    layout['text-font'] = ['Open Sans Semibold', 'Arial Unicode MS Bold'];
    layout['text-offset'] = [
      'case',
      ['==', ['get', 'markerType'], 'low_pressure'],
      [0, 1.0],
      [0, 1.25],
    ];
    layout['text-anchor'] = 'top';
    layout['text-allow-overlap'] = true;
  }

  // Build paint object conditionally: omit text color if type === 'less_1'
  const paint = {};

  if (markerType !== 'less_1') {
    paint['text-color'] = [
      'case',
      ['==', ['get', 'markerType'], 'low_pressure'],
      'red',
      ['==', ['get', 'markerType'], 'high_pressure'],
      'blue',
      'purple',
    ];
  }

  // Add layer for marker
  map.addLayer({
    id: layerId,
    type: 'symbol',
    source: sourceId,
    slot: 'top',
    layout,
    paint,
  });

  setShowTitleModal(false);
};

