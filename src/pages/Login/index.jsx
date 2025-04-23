import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
import { login, reset } from "../../features/auth/authSlice"
import { useNavigate, Link } from "react-router-dom"
import './Login.css'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate('/')
        }

        dispatch(reset())
    }, [isError, isSuccess, user, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(login({ email, password }))
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="logo-container">
                    <img src="/images/Logo_MW.png" alt="Car Rental Logo" />
                </div>
                
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Please login to your account</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Email address"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <div className="auth-links">
                        <Link to="/forgot-password">Forgot Password?</Link>
                        <Link to="/register">Create an account</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
