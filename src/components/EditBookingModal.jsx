import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

function EditBookingModal({ booking, onClose, onSave }) {
    const [formData, setFormData] = useState({
        pickupDate: '',
        returnDate: '',
        pickupLocation: '',
        returnLocation: ''
    });

    useEffect(() => {
        if (booking) {
            // Format dates properly for input fields
            const pickupDate = new Date(booking.pickupDate).toISOString().split('T')[0];
            const returnDate = new Date(booking.returnDate).toISOString().split('T')[0];
            
            setFormData({
                pickupDate,
                returnDate,
                pickupLocation: booking.pickupLocation || '',
                returnLocation: booking.returnLocation || ''
            });
        }
    }, [booking]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Validate dates
            const pickup = new Date(formData.pickupDate);
            const return_ = new Date(formData.returnDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (pickup < today) {
                toast.error('Pickup date cannot be in the past');
                return;
            }
            if (return_ <= pickup) {
                toast.error('Return date must be after pickup date');
                return;
            }

            // Create a new object with properly formatted dates
            const updatedFormData = {
                ...formData,
                pickupDate: new Date(formData.pickupDate + 'T00:00:00').toISOString(),
                returnDate: new Date(formData.returnDate + 'T00:00:00').toISOString()
            };

            await onSave(updatedFormData);
            onClose();
        } catch (error) {
            toast.error('Failed to update booking');
            console.error('Error updating booking:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Edit Booking</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            <FaCalendarAlt /> Pickup Date
                        </label>
                        <input
                            type="date"
                            name="pickupDate"
                            value={formData.pickupDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <FaCalendarAlt /> Return Date
                        </label>
                        <input
                            type="date"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleChange}
                            min={formData.pickupDate}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <FaMapMarkerAlt /> Pickup Location
                        </label>
                        <input
                            type="text"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <FaMapMarkerAlt /> Return Location
                        </label>
                        <input
                            type="text"
                            name="returnLocation"
                            value={formData.returnLocation}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBookingModal;


