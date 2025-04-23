import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaCar, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import EditBookingModal from '../components/EditBookingModal';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // Add status filter
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && user.token) {
            fetchBookings();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/bookings', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            
            if (response.data.success) {
                setBookings(response.data.data);
            } else {
                toast.error('Failed to fetch bookings');
            }
        } catch (error) {
            if (error.code === 'ERR_CONNECTION_REFUSED') {
                toast.error('Cannot connect to server. Please ensure the backend server is running.');
            } else {
                toast.error(error.response?.data?.message || 'Cannot get bookings');
            }
            console.error('Booking fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5000/api/v1/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (response.data.success) {
                toast.success('Booking cancelled successfully');
                fetchBookings(); // Refresh the bookings list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const handleEditBooking = (booking) => {
        setSelectedBooking(booking);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (formData) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/v1/bookings/${selectedBooking._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Booking updated successfully');
                setIsEditModalOpen(false);
                fetchBookings(); // Refresh the bookings list
            } else {
                toast.error(response.data.message || 'Failed to update booking');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cannot update booking');
            console.error('Update booking error:', error);
        }
    };

    // Add filter function
    const getFilteredBookings = () => {
        if (filterStatus === 'all') return bookings;
        return bookings.filter(booking => booking.status.toLowerCase() === filterStatus);
    };

    if (isLoading) {
        return <div className="loading">Loading bookings...</div>;
    }

    return (
        <div className="bookings-container">
            <h1 className="page-title">My Bookings</h1>
            
            {/* Add filter controls for admin */}
            {user.role === 'admin' && (
                <div className="booking-filters">
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>No bookings found</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {getFilteredBookings().map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <div className="booking-header">
                                <div className="car-info">
                                    <h2>{booking.car?.name || 'Unknown Car'}</h2>
                                    <span className={`status-badge ${booking.status?.toLowerCase() || 'pending'}`}>
                                        {booking.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="booking-details">
                                <div className="detail-item">
                                    <FaCalendarAlt />
                                    <div className="detail-text">
                                        <p><strong>Pickup:</strong> {formatDate(booking.pickupDate)}</p>
                                        <p><strong>Return:</strong> {formatDate(booking.returnDate)}</p>
                                    </div>
                                </div>
                                
                                <div className="detail-item">
                                    <FaMapMarkerAlt />
                                    <p><strong>Provider:</strong> {booking.provider?.name || 'Unknown Provider'}</p>
                                </div>
                                {user.role === 'admin' && (
                                    <>
                                        <div className="detail-item">
                                            <FaUser />
                                            <p><strong>Customer:</strong> {booking.user?.name || 'Unknown User'}</p>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-envelope"></i>
                                            <p><strong>Customer Email:</strong> {booking.user?.email || 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div className="booking-actions">
                                <button 
                                    className="btn btn-edit"
                                    onClick={() => handleEditBooking(booking)}
                                >
                                    Edit Booking
                                </button>
                                <button 
                                    className="btn btn-cancel"
                                    onClick={() => handleCancelBooking(booking._id)}
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isEditModalOpen && (
                <EditBookingModal
                    booking={selectedBooking}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveEdit}
                    isAdmin={user.role === 'admin'}
                />
            )}
        </div>
    );
}

export default MyBookings;














