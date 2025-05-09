import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = ({ onMapLoad, isDarkMode }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error('Map container reference is not available.');
      return;
    }

    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is not defined.');
      return;
    }

    // Initialize map only if it's not already initialized
    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        projection: 'mercator',
        style: isDarkMode
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v11',
        center: [122, 12], // Adjust as needed
        zoom: 5,
      });

      map.fitBounds(
        [
          [114.0, 5.0],   // Southwest
          [130.0, 21.0],  // Northeast
        ],
        {
          padding: { top: 200, bottom: 100, left: 100, right: 200 },
        }
      );

      map.on('load', () => {
        mapRef.current = map;
        if (onMapLoad) {
          onMapLoad(map);
        }
      });
    }

    // Cleanup map instance when component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update the map style when isDarkMode changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(
        isDarkMode
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v11'
      );
    }
  }, [isDarkMode]); // Re-run whenever isDarkMode changes

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    />
  );
};

export default MapComponent;
