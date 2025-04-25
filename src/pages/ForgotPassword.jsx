import { useState } from "react"
import { toast } from "react-toastify"
import { FaLock } from 'react-icons/fa'
import { Link } from "react-router-dom"
import axios from 'axios'

function ForgotPassword() {
    const [email, setEmail] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/forgotpassword', { email });
            
            if (response.data.success) {
                toast.success('Password reset link sent to your email');
                setEmail('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
        }
    }

    return (
        <div className="forgot-password-container">
            <section className="forgot-password-header">
                <h1>
                    <FaLock /> Reset Password
                </h1>
                <p>Enter your email to reset your password</p>
            </section>

            <section className="forgot-password-form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email" 
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit">
                            Send Reset Link
                        </button>
                    </div>

                    <div className="login-prompt">
                        Remember your password? <Link to="/login">Login</Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default ForgotPassword

