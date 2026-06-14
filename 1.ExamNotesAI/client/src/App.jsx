import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Notes from './pages/Notes.jsx'
import History from './pages/History.jsx'
import Pricing from './pages/Pricing.jsx'

import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import DummyPayment from "./pages/DummyPayment.jsx";

import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUserData } from './redux/userSlice'


export const serverUrl = "https://examnotes-backend-vjow.onrender.com"

function App() {
  const dispatch = useDispatch();
  
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/currentuser`, {
          withCredentials: true
        });
        if (response.data) {
          dispatch(setUserData(response.data));
        }
      } catch (error) {
        console.log("Not logged in or session expired");
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to="/auth" replace />} />
      <Route path='/auth' element={userData ? <Navigate to="/" replace /> : <Auth />} />
      <Route path='/notes' element={userData ? <Notes /> : <Navigate to="/auth" replace />} />
      <Route path='/history' element={userData ? <History /> : <Navigate to="/auth" replace />} />
      <Route path='/pricing' element={userData ? <Pricing /> : <Navigate to="/auth" replace />} />

      <Route path='/dummy-payment/:paymentId' element={<DummyPayment />} />
      
      <Route path='/payment-success' element={<PaymentSuccess />} />
      <Route path='/payment-failed' element={<PaymentFailed />} />
    </Routes>
  );
}

export default App;