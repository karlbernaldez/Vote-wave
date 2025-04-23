import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

// Access the token using VITE_ prefix
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = ({ onMapLoad }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    // Check if the map container is available
    if (!mapContainerRef.current) {
      console.error('Map container reference is not available.');
      return;
    }

    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is not defined.');
      return;
    }

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      projection: 'mercator',
      style: "mapbox://styles/mapbox/outdoors-v12",
      zoom: 5,
    });

    mapRef.current.fitBounds(
      [
        [114.0, 5.0], // Southwest corner
        [130.0, 21.0], // Northeast corner
      ],
      { padding: { top: 200, bottom: 100, left: 100, right: 200 } }
    );

    mapRef.current.on('load', () => {
      if (onMapLoad) {
        onMapLoad(mapRef.current); // Pass the map instance to the parent component
      }
    });

    return () => {
      mapRef.current?.remove(); // Cleanup map instance on unmount
    };
  }, [onMapLoad]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100vh', position: 'relative' }}
    />
  );
};

export default MapComponent;
