// geolocation/useUserLocation.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserLocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState(null); // Tillstånd för platsnamn

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }

    const watchId = geo.watchPosition(
      async (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // Omvänd geokodning för att hämta platsnamn från koordinater
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCVT6efFTgELjYvAazwjclhWwGRJXIrhoE`
          );

          if (response.data.results.length > 0) {
            const formattedAddress = response.data.results[0].formatted_address;
            setLocationName(formattedAddress);
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          setLocationName('Unknown location');
        }
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => geo.clearWatch(watchId);
  }, []);

  return { position, error, locationName };
};

export default useUserLocation;
