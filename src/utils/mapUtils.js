export const typhoonMarker = (selectedPoint, mapRef, setShowTitleModal, type) => (title) => {
  if (!selectedPoint) return;

  const { lng, lat } = selectedPoint;

  const iconMap = {
    draw_point: 'typhoon-marker',
    low_pressure: 'low-pressure-icon'
  };

  // Set default titles based on type
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
      icon: iconMap[type] || 'typhoon-marker'
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
