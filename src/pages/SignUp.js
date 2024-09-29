import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


const SignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [entries, setEntries] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [entrie, setEntrie] = useState({
    email: '',
    name: '',
    password: '',
  });

  const sendData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://todo-server-tau-snowy.vercel.app/app/signup', {
        email: entries.email,
        name: entries.name,
        password: entries.password,
      });
      
      if (response.status === 201) {
        console.log("Signup successful:", response.data);
        setIsLogin(!isLogin);
      }
    } catch (error) {
      console.log("Error", error.response.data.message)
      setError(error.response.data.message)
      setTimeout(()=>{
        setError('')
      },2000)
    }
  };
  
  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://todo-server-tau-snowy.vercel.app/app/signin', {
        email: entrie.email,
        password: entrie.password,
      }, { withCredentials: true });
  
      let data = await response.data;
      Cookies.set('token', data.token)
      console.log('Login Response:', data);
  
      if (data.message === 'User logged in successfully') {
        window.location.href = '/';  
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      setError(error.response.data.message)
      setTimeout(()=>{
        setError('')
      },2000)
    }
  };
  
  return (
    <div className='formBody'>
      <div className="wrapper">
        <div className="title-text">
          <div className={`title login ${isLogin ? 'active' : ''}`}>
            Login Form
          </div>
          <div className={`title signup ${!isLogin ? 'active' : ''}`}>
            Signup Form
          </div>
        </div>
        <div className="form-container">
          <div className="slide-controls">
            <input
              type="radio"
              name="slide"
              id="login"
              checked={isLogin}
              onChange={() => setIsLogin(true)}
            />
            <input
              type="radio"
              name="slide"
              id="signup"
              checked={!isLogin}
              onChange={() => setIsLogin(false)}
            />
            <label htmlFor="login" className={`slide login ${isLogin ? 'active' : ''}`}>
              Login
            </label>
            <label htmlFor="signup" className={`slide signup ${!isLogin ? 'active' : ''}`}>
              Signup
            </label>
            <div className="slider-tab"></div>
          </div>
        <div className="error text-center text-danger" style={{fontSize:"14px", marginBottom:"-10px"}}>{error}</div>
          <div className="form-inner">
            {isLogin ? (
              <form className="login" onSubmit={login}>
                <div className="field">
                <input
                    type="email"
                    value={entrie.email}
                    onChange={(e) => setEntrie({ ...entrie, email: e.target.value })}
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="field">
                <input
                    type="password"
                    value={entrie.password}
                    onChange={(e) => setEntrie({ ...entrie, password: e.target.value })}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="pass-link">
                  <a href="#">Forgot password?</a>
                </div>
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input type="submit" value="Login" />
                </div>
                <div className="signup-link">
                  Not a member? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>Signup now</a>
                </div>
              </form>
            ) : (
              <form className="signup" onSubmit={sendData}>
                <div className="field">
                  <input
                    type="email"
                    value={entries.email}
                    onChange={(e) => setEntries({ ...entries, email: e.target.value })}
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="text"
                    value={entries.name}
                    onChange={(e) => setEntries({ ...entries, name: e.target.value })}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    value={entries.password}
                    onChange={(e) => setEntries({ ...entries, password: e.target.value })}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input type="submit" value="Signup" />
                </div>
                
              </form>
              
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
