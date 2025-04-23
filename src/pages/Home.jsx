import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCar, FaCalendarAlt, FaUserCog, FaTachometerAlt, FaList } from 'react-icons/fa';

function Home() {
    const { user } = useSelector((state) => state.auth);

    const adminCards = [
        {
            icon: <FaTachometerAlt size={24} />,
            title: 'Dashboard',
            description: 'View analytics and manage system',
            link: '/dashboard',
            color: '#4a90e2'
        },
        {
            icon: <FaCar size={24} />,
            title: 'Manage Cars',
            description: 'Add, edit, and remove vehicles',
            link: '/manage-cars',
            color: '#50b83c'
        },
        {
            icon: <FaList size={24} />,
            title: 'All Bookings',
            description: 'View and manage all reservations',
            link: '/my-bookings',
            color: '#f5a623'
        }
    ];

    const userCards = [
        {
            icon: <FaCar size={24} />,
            title: 'Book a Car',
            description: 'Reserve your next vehicle',
            link: '/book-car',
            color: '#4a90e2'
        },
        {
            icon: <FaCalendarAlt size={24} />,
            title: 'My Bookings',
            description: 'View and manage your reservations',
            link: '/my-bookings',
            color: '#50b83c'
        }
    ];

    const cardsToShow = user?.role === 'admin' ? adminCards : userCards;

    return (
        <div className="home-container">
            <h1 className="welcome-title">
                Welcome{user ? `, ${user.name}` : ' to Car Rental'}!
            </h1>
            <div className="cards-grid">
                {cardsToShow.map((card, index) => (
                    <Link to={card.link} key={index} className="card">
                        <div className="card-icon" style={{ backgroundColor: card.color }}>
                            {card.icon}
                        </div>
                        <div className="card-content">
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home
