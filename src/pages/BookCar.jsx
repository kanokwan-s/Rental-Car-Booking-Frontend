import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ProvidersMap from '../components/ProvidersMap';

function BookCar() {
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [availableCars, setAvailableCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchProviders();
    }, []);

    useEffect(() => {
        if (selectedProvider) {
            fetchProviderCars(selectedProvider._id);
        }
    }, [selectedProvider]);

    const fetchProviders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/providers');
            setProviders(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch providers');
        } finally {
            setLoading(false);
        }
    };

    const fetchProviderCars = async (providerId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/providers/${providerId}/cars`);
            setAvailableCars(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch available cars');
            setAvailableCars([]);
        }
    };

    const handleProviderSelect = (provider) => {
        setSelectedProvider(provider);
    };

    return (
        <div className="book-car-page">
            <h1>Select a Car Provider</h1>
            
            <div className="booking-container">
                <div className="map-section">
                    <ProvidersMap 
                        providers={providers}
                        selectedProvider={selectedProvider}
                        onProviderSelect={handleProviderSelect}
                    />
                </div>

                <div className="booking-details">
                    <h2>Available Providers</h2>
                    <div className="providers-list">
                        {providers.map((provider) => (
                            <div 
                                key={provider._id}
                                className={`provider-card ${selectedProvider?._id === provider._id ? 'selected' : ''}`}
                                onClick={() => handleProviderSelect(provider)}
                            >
                                <h3>{provider.name}</h3>
                                <p>📍 {provider.address?.street}</p>
                                <p>📞 {provider.telephone}</p>
                            </div>
                        ))}
                    </div>

                    {selectedProvider && (
                        <div className="available-cars">
                            <h2>Available Cars</h2>
                            {availableCars.length === 0 ? (
                                <p>No cars available from this provider</p>
                            ) : (
                                <div className="cars-grid">
                                    {availableCars.map((car) => (
                                        <div key={car._id} className="car-card">
                                            <h3>{car.name}</h3>
                                            <div className="car-details">
                                                <p>Type: {car.type}</p>
                                                <p>Plate: {car.plateNumber}</p>
                                                <p>Price: ฿{car.pricePerDay}/day</p>
                                            </div>
                                            <button 
                                                className="book-button"
                                                onClick={() => navigate(`/book/${car._id}`)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookCar;


