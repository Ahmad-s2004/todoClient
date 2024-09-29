import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Tasks from './pages/Tasks'
import Today from './pages/Today'
import Category from './pages/Category'
import SignUp from './pages/SignUp'
import PrivateRoute from './components/PrivateRoute'
import Cookies from 'js-cookie';

const App = () => {
  const token = Cookies.get('token');
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {token ? (
            <>
              <Route path='/' element={<PrivateRoute element={<Tasks />} />} />
              <Route path='/today' element={<PrivateRoute element={<Today />} />} />
              <Route path='/category/:_id' element={<PrivateRoute element={<Category />} />} />
              <Route path="*" element={<Navigate to="/" />} /> 
            </>
          ) : (
            <>
              <Route path='/signup' element={<SignUp />} />
              <Route path="*" element={<Navigate to="/signup" />} /> 
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
