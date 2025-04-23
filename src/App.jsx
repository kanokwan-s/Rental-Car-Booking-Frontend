import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import MyProfile from './pages/MyProfile'
import PrivateRoute from './components/PrivateRoute'


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
                            path='/profile' 
                            element={
                                <ErrorBoundary>
                                    <PrivateRoute>
                                        <MyProfile />
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








