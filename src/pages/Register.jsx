import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from "react-redux"
import { register, reset } from "../features/auth/authSlice"
import { useNavigate, Link } from "react-router-dom"

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        telephone: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' // Add default role
    });

    const { name, email, password, confirmPassword, telephone, role } = formData;
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

        // Add telephone validation
        if (!telephone.trim()) {
            toast.error('Phone number is required')
            return
        }

        // Validate phone number format (adjust regex according to your needs)
        const phoneRegex = /^\d{10}$/  // Assumes 10-digit phone number
        if (!phoneRegex.test(telephone.trim())) {
            toast.error('Please enter a valid 10-digit phone number')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        const userData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            telephone: telephone.trim(),
            role // Include role in userData
        }

        dispatch(register(userData))
    }

    return (
        <div className="register-container">
            <section className="register-header">
                <h1>
                    <FaUser /> Register
                </h1>
                <p>Please create an account</p>
            </section>

            <section className="register-form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            className="form-control"
                            id="telephone"
                            name="telephone"
                            value={telephone}
                            onChange={onChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            placeholder="Confirm password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <select
                            className="form-control"
                            id="role"
                            name="role"
                            value={role}
                            onChange={onChange}
                            required
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="register-button">
                            {isLoading ? 'Loading...' : 'Register'}
                        </button>
                    </div>

                    <div className="login-prompt">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default Register

