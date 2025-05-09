export const handleSaveMarker = (selectedPoint, mapRef, setShowTitleModal) => (title) => {
    if (!selectedPoint) return;
  
    const { lng, lat } = selectedPoint;
    const customPoint = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
      properties: { title: title || 'Untitled Marker' }
    };
  
    const source = mapRef.current?.getSource('custom-points');
    if (!source) return;
  
    const currentData = source._data || { type: 'FeatureCollection', features: [] };
  
    source.setData({
      ...currentData,
      features: [...currentData.features, customPoint]
    });
  
    setShowTitleModal(false);
  };
  