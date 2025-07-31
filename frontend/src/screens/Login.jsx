import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useState } from 'react';
import {UserContext} from '../context/user.context';
import { useContext } from 'react';
const Login = () => {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const {setUser} = useContext(UserContext);
  const navigate = useNavigate();

  function submitHandler(e){
    e.preventDefault();
    axios.post('/users/login',{email,password}).
    then((res)=>{console.log(res.data)
    
    localStorage.setItem('token',res.data.token);
    setUser(res.data.user);
      navigate('/');
    }
  ).catch((err)=>{console.log(err.response.data)})
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;