import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function PrivateRoute({ children, adminOnly = false }) {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error('Please login to continue', {
                toastId: 'auth-check',
                position: "top-right",
                autoClose: 3000
            });
        } else if (adminOnly && user.role !== 'admin') {
            toast.error('Access denied: Admin only', {
                toastId: 'admin-check',
                position: "top-right",
                autoClose: 3000
            });
        }
    }, [user, adminOnly]);

    if (!user) {
        return <Navigate to='/login' />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to='/' />;
    }

    return children;
}

export default PrivateRoute;




