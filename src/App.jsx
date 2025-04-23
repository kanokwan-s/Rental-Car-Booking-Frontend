import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import BookCar from './pages/BookCar'
import MyBookings from './pages/MyBookings'
import MyProfile from './pages/MyProfile'
import ManageCars from './pages/ManageCars'
import PrivateRoute from './components/PrivateRoute'
import BookingDetails from './pages/BookingDetails'

function App() {
    return (
        <>
        <Router>
            <div className="container">
                <ErrorBoundary>
                    <Header/>
                    <Routes>
                        <Route path='/' element={<Home/>} />
                        <Route path='/login' element={<Login/>} />
                        <Route path='/register' element={<Register/>} />
                        <Route path='/forgot-password' element={<ForgotPassword/>} />
                        <Route 
                            path='/book-car' 
                            element={
                                <ErrorBoundary>
                                    <PrivateRoute>
                                        <BookCar />
                                    </PrivateRoute>
                                </ErrorBoundary>
                            } 
                        />
                        <Route 
                            path='/book/:carId' 
                            element={
                                <ErrorBoundary>
                                    <PrivateRoute>
                                        <BookingDetails />
                                    </PrivateRoute>
                                </ErrorBoundary>
                            } 
                        />
                        <Route 
                            path='/my-bookings' 
                            element={
                                <ErrorBoundary>
                                    <PrivateRoute>
                                        <MyBookings />
                                    </PrivateRoute>
                                </ErrorBoundary>
                            } 
                        />
                        <Route 
                            path='/profile' 
                            element={
                                <ErrorBoundary>
                                    <PrivateRoute>
                                        <MyProfile />
                                    </PrivateRoute>
                                </ErrorBoundary>
                            } 
                        />
                        <Route 
                            path='/dashboard' 
                            element={
                                <ErrorBoundary>
                                    <PrivateRoute adminOnly={true}>
                                        <Dashboard />
                                    </PrivateRoute>
                                </ErrorBoundary>
                            } 
                        />
                        <Route 
                            path='/manage-cars' 
                            element={
                                <ErrorBoundary>
                                    <PrivateRoute adminOnly={true}>
                                        <ManageCars />
                                    </PrivateRoute>
                                </ErrorBoundary>
                            } 
                        />
                        <Route 
                            path='/all-bookings' 
                            element={
                                <ErrorBoundary>
                                    <PrivateRoute adminOnly={true}>
                                        <MyBookings />
                                    </PrivateRoute>
                                </ErrorBoundary>
                            } 
                        />
                    </Routes>
                </ErrorBoundary>
            </div>
        </Router>
        <ToastContainer/>
        </>
    );
}

export default App;








