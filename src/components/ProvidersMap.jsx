import { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok coordinates
const containerStyle = {
    width: '100%',
    height: '100%',
};

// Helper function to format address
const formatAddress = (address) => {
    if (!address) return 'Address not available';
    if (typeof address === 'string') return address;
    
    const { street, city, state, postalCode, country } = address;
    return `${street || ''}, ${city || ''}, ${state || ''} ${postalCode || ''}, ${country || ''}`
        .trim()
        .replace(/,\s*,/g, ',')
        .replace(/^,\s*/, '')
        .replace(/,\s*$/, '') || 'Address not available';
};

function ProvidersMap({ providers = [], selectedProvider, onProviderSelect }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const [map, setMap] = useState(null);

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps...</div>;
    }

    // Convert providers' location data to the format expected by Google Maps
    const validProviders = providers.filter(provider => 
        provider?.location?.latitude && provider?.location?.longitude
    ).map(provider => ({
        ...provider,
        position: {
            lat: provider.location.latitude,
            lng: provider.location.longitude
        }
    }));

    // Calculate map center based on selected provider or default to Bangkok
    const mapCenter = selectedProvider?.location 
        ? { 
            lat: selectedProvider.location.latitude, 
            lng: selectedProvider.location.longitude 
          }
        : defaultCenter;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={13}
            onLoad={onLoad}
            options={{
                gestureHandling: 'cooperative',
                clickableIcons: false,
                disableDefaultUI: true,
                zoomControl: true,
            }}
        >
            {validProviders.map(provider => (
                <MarkerF
                    key={provider.id}
                    position={provider.position}
                    onClick={() => onProviderSelect(provider)}
                >
                    {selectedProvider?.id === provider.id && (
                        <InfoWindowF
                            position={provider.position}
                            onCloseClick={() => onProviderSelect(null)}
                        >
                            <div>
                                <h3>{provider.name || 'Unnamed Provider'}</h3>
                                <p>⭐ {provider.rating || 'N/A'}</p>
                                <p>📍 {formatAddress(provider.address)}</p>
                                <p>🚗 {provider.cars?.length || 0} cars available</p>
                            </div>
                        </InfoWindowF>
                    )}
                </MarkerF>
            ))}
        </GoogleMap>
    );
}

export default ProvidersMap;















