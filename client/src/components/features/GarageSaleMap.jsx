import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useGeolocated } from 'react-geolocated';
import axios from 'axios';
import GarageSaleForm from './GarageSaleForm';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const GarageSaleMap = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { coords } = useGeolocated();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await axios.get('/api/garage-sales');
        setSales(data);
      } catch (error) {
        console.error('Error fetching garage sales:', error);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="relative">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coords ? { lat: coords.latitude, lng: coords.longitude } : { lat: 37.7749, lng: -122.4194 }}
          zoom={12}
        >
          {sales.map(sale => (
            <Marker
              key={sale._id}
              position={{ lat: sale.location.lat, lng: sale.location.lng }}
              onClick={() => setSelectedSale(sale)}
            />
          ))}

          {selectedSale && (
            <InfoWindow
              position={{ lat: selectedSale.location.lat, lng: selectedSale.location.lng }}
              onCloseClick={() => setSelectedSale(null)}
            >
              <div className="p-2">
                <h3 className="font-bold">{selectedSale.title}</h3>
                <p className="text-sm">{selectedSale.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(selectedSale.date).toLocaleDateString()}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <button
        onClick={() => setShowForm(true)}
        className="absolute top-4 right-4 btn-primary z-10"
      >
        Add Garage Sale
      </button>

      <GarageSaleForm 
        show={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={async (saleData) => {
          try {
            const { data } = await axios.post('/api/garage-sales', saleData);
            setSales([...sales, data]);
            setShowForm(false);
          } catch (error) {
            console.error('Error creating garage sale:', error);
          }
        }}
      />
    </div>
  );
};

export default GarageSaleMap;