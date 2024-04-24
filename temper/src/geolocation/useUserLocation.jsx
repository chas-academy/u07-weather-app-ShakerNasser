// geolocation/useUserLocation.js
import { useState, useEffect } from 'react';

const useUserLocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }

    const watchId = geo.watchPosition(
      (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => geo.clearWatch(watchId);
  }, []);

  return { position, error };
};

export default useUserLocation;
