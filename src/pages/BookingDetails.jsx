import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

function BookingDetails() {
    const { carId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        pickupLocation: '',
        returnLocation: '',
        pickupDate: '',
        returnDate: ''
    });

    useEffect(() => {
        fetchCarDetails();
    }, [carId]);

    const fetchCarDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/cars/${carId}`);
            setCar(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch car details');
            navigate('/book-car');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/bookings', {
                car: carId,
                provider: car.provider,
                ...formData
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (response.data.success) {
                toast.success('Booking created successfully');
                navigate('/my-bookings');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="booking-details-page">
            <h1>Complete Your Booking</h1>
            {car && (
                <div className="car-info">
                    <h2>{car.name}</h2>
                    <p>Type: {car.type}</p>
                    <p>Price: ฿{car.pricePerDay}/day</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                    <label htmlFor="pickupLocation">Pickup Location</label>
                    <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="returnLocation">Return Location</label>
                    <input
                        type="text"
                        id="returnLocation"
                        name="returnLocation"
                        value={formData.returnLocation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pickupDate">Pickup Date</label>
                    <input
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="returnDate">Return Date</label>
                    <input
                        type="date"
                        id="returnDate"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">
                    Confirm Booking
                </button>
            </form>
        </div>
    );
}

export default BookingDetails;