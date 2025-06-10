import React from 'react'
import { Link } from 'react-router-dom'
import { FaUserShield, FaIdCard } from 'react-icons/fa'

const AdminSignup = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 w-11/12 md:w-1/3 shadow-lg rounded-lg border-t-4 border-blue-600'>
        <form>
          {/* Header with Admin Icon */}
          <div className='flex flex-col items-center mb-6'>
            <div className='bg-blue-100 p-3 rounded-full mb-3'>
              <FaUserShield className='text-blue-600 text-2xl' />
            </div>
            <h1 className='text-2xl font-bold text-gray-800'>Admin Registration</h1>
            <p className='text-sm text-gray-600'>Restricted to authorized personnel only</p>
          </div>

          {/* Admin-Specific Fields */}
          <div className='space-y-4'>

            <div>
              <label className='block font-medium text-gray-700 mb-1'>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter name" 
                className='w-full input input-bordered focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>


            <div>
              <label className='block font-medium text-gray-700 mb-1'>Password</label>
              <input 
                type="password" 
                placeholder="Enter password" 
                className='w-full input input-bordered focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>

            <div>
              <label className='block font-medium text-gray-700 mb-1'>Official Email</label>
              <input 
                type="email" 
                placeholder="organization@domain.com" 
                className='w-full input input-bordered focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>

            <div>
              <label className='block font-medium text-gray-700 mb-1'>Enter Rank</label>
              <select className='w-full select select-bordered focus:ring-2 focus:ring-blue-500'>
                <option disabled selected>Select Rank</option>
                <option>IT Administration</option>
                <option>Human Resources</option>
                <option>System Security</option>
                <option>Operations</option>
              </select>
            </div>

            <div>
              <label className='block font-medium text-gray-700 mb-1'>Department*</label>
              <select className='w-full select select-bordered focus:ring-2 focus:ring-blue-500'>
                <option disabled selected>Select department</option>
                <option>IT Administration</option>
                <option>Human Resources</option>
                <option>System Security</option>
                <option>Operations</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='pt-6 space-y-3'>
            <button className='btn w-full bg-blue-600 hover:bg-blue-700 border-none text-white'>
              Register Admin Account
            </button>
            <Link 
              to='/admin' 
              className='block text-center text-sm hover:underline hover:text-blue-600 text-gray-600'
            >
              Already have admin access? Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSignup