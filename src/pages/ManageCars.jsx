import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCar, FaEdit, FaTrash, FaPlus, FaBuilding } from 'react-icons/fa';

function ManageCars() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [providers, setProviders] = useState([]);
    const { user } = useSelector((state) => state.auth);

    const [newCar, setNewCar] = useState({
        name: '',
        type: '',
        plateNumber: '',
        price: '',
        provider: ''
    });

    const [showProviderForm, setShowProviderForm] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);
    const [newProvider, setNewProvider] = useState({
        name: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        },
        latitude: '',  // Keep as string for input value
        longitude: ''  // Keep as string for input value
    });

    // Add this helper function at the top of your component
    const formatAddress = (address) => {
        if (!address) return '';
        if (typeof address === 'string') return address;
        
        const { street, city, state, postalCode, country } = address;
        return `${street || ''}, ${city || ''}, ${state || ''} ${postalCode || ''}, ${country || ''}`.trim().replace(/,\s*,/g, ',').replace(/^,\s*/, '');
    };

    // Fetch cars and providers on component mount
    useEffect(() => {
        fetchCars();
        fetchProviders();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/cars', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Make sure we're setting an array, even if empty
            setCars(response.data.data || []); // Assuming the API returns data in { data: [...cars] } format
        } catch (error) {
            toast.error('Failed to fetch cars');
            setCars([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProviders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/providers', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Fix: Ensure we're accessing the data property and defaulting to an empty array
            setProviders(response.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch providers');
            // Fix: Set empty array on error
            setProviders([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCar(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!newCar.name || !newCar.provider || !newCar.type || !newCar.plateNumber || !newCar.price) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        const carData = {
            name: newCar.name.trim(),
            provider: newCar.provider,
            type: newCar.type.trim(),
            plateNumber: newCar.plateNumber.trim(),
            pricePerDay: parseFloat(newCar.price) || 0,
            available: true
        };

        // Validate price
        if (isNaN(carData.pricePerDay) || carData.pricePerDay <= 0) {
            toast.error('Please enter a valid price');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/cars',
                carData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                toast.success('Car added successfully');
                setShowAddForm(false);
                setNewCar({
                    name: '',
                    type: '',
                    plateNumber: '',
                    price: '',
                    provider: ''
                });
                fetchCars();
            }
        } catch (error) {
            console.error('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to add car');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (car) => {
        setEditingCar(car);
        setNewCar({
            name: car.name || '',
            type: car.type || '',
            plateNumber: car.plateNumber || '',
            price: car.pricePerDay?.toString() || '',
            provider: car.provider || ''
        });
        setShowAddForm(true);
    };

    const handleDelete = async (carId) => {
        if (!window.confirm('Are you sure you want to delete this car?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/v1/cars/${carId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Car deleted successfully');
            fetchCars();
        } catch (error) {
            toast.error('Failed to delete car');
        }
    };

    const handleProviderInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setNewProvider(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setNewProvider(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleProviderSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const providerData = {
            name: newProvider.name,
            address: newProvider.address,
            latitude: parseFloat(newProvider.latitude) || 0,  // Convert string to number
            longitude: parseFloat(newProvider.longitude) || 0  // Convert string to number
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/providers',
                providerData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                toast.success('Provider added successfully');
                setShowProviderForm(false);
                setNewProvider({
                    name: '',
                    address: {
                        street: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: ''
                    },
                    latitude: '',
                    longitude: ''
                });
                fetchProviders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add provider');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProvider = (provider) => {
        setEditingProvider(provider);
        setNewProvider({
            name: provider.name || '',
            address: {
                street: provider.address?.street || '',
                city: provider.address?.city || '',
                state: provider.address?.state || '',
                postalCode: provider.address?.postalCode || '',
                country: provider.address?.country || ''
            },
            latitude: provider.latitude?.toString() || '',  // Convert number to string
            longitude: provider.longitude?.toString() || ''  // Convert number to string
        });
        setShowProviderForm(true);
    };

    const handleDeleteProvider = async (providerId) => {
        if (!window.confirm('Are you sure you want to delete this provider? All associated cars will also be deleted.')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/v1/providers/${providerId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Provider deleted successfully');
            fetchProviders();
            fetchCars();
        } catch (error) {
            toast.error('Failed to delete provider');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="manage-cars-container">
            <div className="header">
                <h1>Manage Cars and Providers</h1>
                <div className="header-buttons">
                    <button 
                        className="add-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        <FaPlus /> Add New Car
                    </button>
                    <button 
                        className="add-btn"
                        onClick={() => setShowProviderForm(true)}
                    >
                        <FaPlus /> Add New Provider
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className="form-container">
                    <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Car Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newCar.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <input
                                type="text"
                                name="type"
                                value={newCar.type}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Plate Number</label>
                            <input
                                type="text"
                                name="plateNumber"
                                value={newCar.plateNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price per Day</label>
                            <input
                                type="number"
                                name="price"
                                value={newCar.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Provider</label>
                            <select
                                name="provider"
                                value={newCar.provider}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Provider</option>
                                {providers.map(provider => (
                                    <option key={provider._id} value={provider._id}>
                                        {provider.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                {editingCar ? 'Update Car' : 'Add Car'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingCar(null);
                                    setNewCar({
                                        name: '',
                                        type: '',
                                        plateNumber: '',
                                        price: '',
                                        provider: ''
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showProviderForm && (
                <div className="form-container">
                    <h2>{editingProvider ? 'Edit Provider' : 'Add New Provider'}</h2>
                    <form onSubmit={handleProviderSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={newProvider.name}
                                onChange={handleProviderInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Street:</label>
                            <input
                                type="text"
                                name="address.street"
                                value={newProvider.address.street}
                                onChange={handleProviderInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>City:</label>
                            <input
                                type="text"
                                name="address.city"
                                value={newProvider.address.city}
                                onChange={handleProviderInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>State:</label>
                            <input
                                type="text"
                                name="address.state"
                                value={newProvider.address.state}
                                onChange={handleProviderInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Postal Code:</label>
                            <input
                                type="text"
                                name="address.postalCode"
                                value={newProvider.address.postalCode}
                                onChange={handleProviderInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Country:</label>
                            <input
                                type="text"
                                name="address.country"
                                value={newProvider.address.country}
                                onChange={handleProviderInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Latitude:</label>
                            <input
                                type="number"
                                name="latitude"
                                value={newProvider.latitude}
                                onChange={handleProviderInputChange}
                                step="any"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Longitude:</label>
                            <input
                                type="number"
                                name="longitude"
                                value={newProvider.longitude}
                                onChange={handleProviderInputChange}
                                step="any"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                {editingProvider ? 'Update Provider' : 'Add Provider'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowProviderForm(false);
                                    setEditingProvider(null);
                                    setNewProvider({
                                        name: '',
                                        address: {
                                            street: '',
                                            city: '',
                                            state: '',
                                            postalCode: '',
                                            country: ''
                                        },
                                        latitude: '',
                                        longitude: ''
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="providers-section">
                <h2>Providers</h2>
                <div className="providers-list">
                    {providers.length === 0 ? (
                        <p>No providers available</p>
                    ) : (
                        providers.map(provider => (
                            <div key={provider._id} className="provider-card">
                                <div className="provider-info">
                                    <FaBuilding className="provider-icon" />
                                    <div>
                                        <h3>{provider.name}</h3>
                                        <p>Address: {formatAddress(provider.address)}</p>
                                        <p>Location: {provider.latitude}, {provider.longitude}</p>
                                        <p>Total Cars: {cars.filter(car => car.providerId === provider._id).length}</p>
                                    </div>
                                </div>
                                <div className="provider-actions">
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEditProvider(provider)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteProvider(provider._id)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="cars-section">
                <h2>Cars</h2>
                <div className="cars-list">
                    {!Array.isArray(cars) || cars.length === 0 ? (
                        <p>No cars available</p>
                    ) : (
                        cars.map(car => (
                            <div key={car._id} className="car-card">
                                <div className="car-info">
                                    <FaCar className="car-icon" />
                                    <div>
                                        <h3>{car.name}</h3>
                                        <p>Type: {car.type}</p>
                                        <p>Plate: {car.plateNumber}</p>
                                        <p>Price: ฿{car.pricePerDay}/day</p>
                                        <p>Provider: {providers.find(p => p._id === car.provider)?.name || 'Unknown'}</p>
                                        <p>Status: {car.available ? 'Available' : 'Not Available'}</p>
                                    </div>
                                </div>
                                <div className="car-actions">
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEdit(car)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(car._id)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageCars;






