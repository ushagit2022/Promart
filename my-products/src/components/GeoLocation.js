// Place this in a React component
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LocationFinder() {
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect( () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Use Nominatim for reverse geocoding
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const res = await axios.get(url);
        const address = res.data.address;
        setCity(address.city || address.town || address.village || '');
        setPincode(address.postcode || '');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  })

  return (
    <div>      
      <div>{city}</div>
      <div>{pincode}</div>
    </div>
  );
}

export default LocationFinder;