import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

export default function InteractiveMap({ listings = [] }) {
  const [selectedListing, setSelectedListing] = useState(null);
  const { location: userLocation, error } = useGeolocation();
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3B82F6',
              fillOpacity: 1,
              strokeColor: '#FFF',
              strokeWeight: 2
            }}
          />
        )}

        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.lat, lng: listing.lng }}
            onClick={() => setSelectedListing(listing)}
          />
        ))}

        {selectedListing && (
          <InfoWindow
            position={{ lat: selectedListing.lat, lng: selectedListing.lng }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <div className="p-2">
              <h3 className="font-bold">{selectedListing.title}</h3>
              <p className="text-gray-600">${selectedListing.price}</p>
              <p className="text-sm">{selectedListing.location}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {error && (
        <div className="text-red-500 mt-2">
          Location access denied. Showing default map view.
        </div>
      )}
    </LoadScript>
  );
}