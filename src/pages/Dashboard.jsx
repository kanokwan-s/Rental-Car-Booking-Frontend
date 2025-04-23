import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaCar, FaUsers, FaChartLine, FaMoneyBillWave, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axios from 'axios'

function Dashboard() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [isLoading, setIsLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        totalBooking: 0,
        popularProvider: [],
        popularCarType: [],
        totalIncome: 0,
        totalOutcome: 0
    })

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
        }
    }, [user, navigate])

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/dashboard', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                if (response.data.success) {
                    setDashboardData(response.data.data);
                } else {
                    toast.error('Failed to fetch dashboard data');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching dashboard data');
                console.error('Dashboard fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.token) {
            fetchDashboardData();
        }
    }, [user]);

    if (isLoading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    const netIncome = dashboardData.totalIncome - dashboardData.totalOutcome;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p className="dashboard-subtitle">Overview of your business performance</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <FaCar />
                    </div>
                    <div className="stat-content">
                        <h3>Total Rentals</h3>
                        <p className="stat-number">{dashboardData.totalBooking}</p>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-content">
                        <h3>Total Income</h3>
                        <p className="stat-number">฿{dashboardData.totalIncome.toLocaleString()}</p>
                        <FaArrowUp className="trend-icon up" />
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-content">
                        <h3>Total Expenses</h3>
                        <p className="stat-number">฿{dashboardData.totalOutcome.toLocaleString()}</p>
                        <FaArrowDown className="trend-icon down" />
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon">
                        <FaChartLine />
                    </div>
                    <div className="stat-content">
                        <h3>Net Income</h3>
                        <p className="stat-number">฿{netIncome.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <h2>Popular Car Providers</h2>
                    <div className="provider-list">
                        {dashboardData.popularProvider.map((provider) => (
                            <div key={provider._id} className="provider-item">
                                <div className="provider-info">
                                    <h4>{provider.providerInfo.name}</h4>
                                    <p>{provider.totalBooking} rentals</p>
                                </div>
                                <div className="provider-progress">
                                    <div 
                                        className="progress-bar" 
                                        style={{ 
                                            width: `${(provider.totalBooking / dashboardData.totalBooking) * 100}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="analytics-card">
                    <h2>Popular Car Types</h2>
                    <div className="car-types-list">
                        {dashboardData.popularCarType.map((type, index) => (
                            <div key={index} className="car-type-item">
                                <div className="type-info">
                                    <h4>{type._id}</h4>
                                    <p>{type.count} cars</p>
                                </div>
                                <div className="type-progress">
                                    <div 
                                        className="progress-bar"
                                        style={{ 
                                            width: `${(type.count / dashboardData.totalBooking) * 100}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                <button className="action-btn" onClick={() => navigate('/manage-cars')}>
                    <FaCar /> Manage Cars
                </button>
                <button className="action-btn" onClick={() => navigate('/manage-users')}>
                    <FaUsers /> Manage Users
                </button>
                <button className="action-btn" onClick={() => navigate('/reports')}>
                    <FaChartLine /> View Reports
                </button>
            </div>
        </div>
    );
}

export default Dashboard;

