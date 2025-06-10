import React from 'react'
import { Link } from 'react-router-dom'
import { FaShieldAlt } from 'react-icons/fa' // Import admin icon

const AdminLogin = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Admin login logic here
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-6 w-11/12 md:w-1/3 shadow-lg rounded-lg border-t-4 border-blue-600'>
        <form onSubmit={handleSubmit}>
          {/* Header with Admin Icon */}
          <div className='flex items-center justify-center gap-3 mb-6'>
            <FaShieldAlt className='text-blue-600 text-2xl' />
            <span className='text-3xl font-semibold text-gray-800'>Admin Login</span>
          </div>

          {/* Username Field */}
          <div className='mb-4'>
            <label className='block font-semibold py-2 text-gray-700'>Admin ID</label>
            <input 
              type="text" 
              placeholder="Enter admin username" 
              className='w-full input input-bordered focus:outline-blue-500 focus:outline-offset-0'
            />
          </div>

          {/* Password Field */}
          <div className='mb-2'>
            <label className='block font-semibold py-2 text-gray-700'>Password</label>
            <input 
              type="password"  // Changed to password type
              placeholder="Enter your password" 
              className='w-full input input-bordered focus:outline-blue-500 focus:outline-offset-0'
            />
          </div>

          {/* Footer Links */}
          <div className='flex justify-between items-center mt-4'>
            <Link 
              to='/login' 
              className='text-sm hover:underline hover:text-blue-600 text-gray-600'
            >
              ← User Login
            </Link>
            
            <Link 
              to='/admin/forgot-password' 
              className='text-sm hover:underline hover:text-blue-600 text-gray-600'
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <div className='pt-5'>
            <button className='btn w-full bg-blue-600 hover:bg-blue-700 border-none text-white'>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin