import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useLogin from '../../hooks/useLogin.js'

const Login = () => {
  const [formData, setFormData] = useState({
    username:"",
    password: ""
  })
  const {loading, login} = useLogin();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    await login(formData)
  }
  return (

    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='bg-gray-200 p-6 w-11/12 md:w-1/3'>

        <form onSubmit={handleSubmit}>
          <div className='flex items-center justify-center'>
            <Link to="/"><img src="./src/assets/react.svg" alt="Logo"  className='rounded-full w-20 h-10 cursor-pointer'/></Link>
            <span className='text-3xl font-semibold'>Login</span>
          </div>

          <div>
            <label className='block font-semibold py-2'>UserName</label>
            <input type="text" placeholder="Enter your name" className='w-full input input-borded focus:outline-offset-0'
              onChange={(e)=> setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className='block font-semibold py-2'>Password</label>
            <input type="text" placeholder="Enter your Password" className='w-full input input-borded focus:outline-offset-0'
              onChange={(e)=> setFormData({...formData, password: e.target.value})}
            />
          </div>

          <Link to='/signup' className='text-sm hover:underline hover:text-blue-700 mt-4 inline-block'> Don't have an account?</Link>

          <div className='pt-3'>
            <button className='btn btn-success w-full'>
              {loading ? <span className="loading loading-spinner loading-xs"></span>
                : "Login"
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login