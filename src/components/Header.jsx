import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../features/auth/authSlice"

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    
    console.log('Current user:', user); // Add this line to debug

    const onLogout =() => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <header className="main-header">
            <div className="header-content">
                <div className="logo">
                    <Link to='/'>
                        <img src="/images/Logo_MW.png" 
                             alt="Car Rental Logo" 
                             style={{ height: '50px', width: 'auto' }} />
                    </Link>
                </div>
                <nav className="nav-links">
                    {user ? (
                        <div className="user-menu">
                            <span className="welcome-text">Welcome, {user.name}</span>
                            <button className="nav-button logout-button" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to='/login' className="nav-button login-button">
                                Login
                            </Link>
                            <Link to='/register' className="nav-button register-button">
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header
