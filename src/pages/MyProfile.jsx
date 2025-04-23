import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { logout } from '../features/auth/authSlice';

function MyProfile() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telephone: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/users/me', {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (response.data.success) {
                const userData = response.data.data;
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    telephone: userData.telephone || ''
                });
            }
        } catch (error) {
            toast.error('Failed to fetch profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(
                'http://localhost:5000/api/v1/users/me',
                formData,
                {
                    headers: { Authorization: `Bearer ${user.token}` }
                }
            );

            if (response.data.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete('http://localhost:5000/api/v1/users/me', {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            toast.success('Account deleted successfully');
            dispatch(logout());
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        }
    };

    if (isLoading && !isEditing) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="profile-container">
            <h1>My Profile</h1>
            
            <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                    <label>
                        <FaUser /> Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        <FaEnvelope /> Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true} // Email should not be editable
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        <FaPhone /> Telephone
                    </label>
                    <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                    />
                </div>

                <div className="profile-actions">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="btn btn-edit"
                        >
                            <FaEdit /> Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                type="submit"
                                className="btn btn-save"
                                disabled={isLoading}
                            >
                                <FaSave /> {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    fetchUserProfile(); // Reset form to original data
                                }}
                                className="btn btn-cancel"
                            >
                                <FaTimes /> Cancel
                            </button>
                        </>
                    )}
                    
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="btn btn-delete"
                    >
                        <FaTrash /> Delete Account
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MyProfile;
