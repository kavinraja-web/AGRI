import { useState, useEffect } from 'react';

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(pos => {
            setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          });
        }
      });
    }
  }, []);

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          resolve(loc);
        },
        (err) => {
          reject(err);
        }
      );
    });
  };

  return { userLocation, requestLocation };
}
