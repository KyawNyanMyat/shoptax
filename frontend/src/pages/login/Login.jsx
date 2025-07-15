import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useLogin from '../../hooks/useLogin.js'
import logo from "/logo.png"
import { FiUser, FiEye, FiEyeOff  } from 'react-icons/fi'

const Login = () => {
  const [formData, setFormData] = useState({
    username:"",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  
  const {loading, login} = useLogin();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    await login(formData)
  }
  return (

    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='bg-gray-200 p-6 w-11/12 md:w-1/3 rounded-4xl border-t-6 border-blue-500 shadow shadow-green-900'>

        <form onSubmit={handleSubmit}>
         {/* Header */}
         <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 rounded-full mb-3">
              <Link to="/"><img src={logo} alt="Logo"  className='rounded-full w-20 h-24 cursor-pointer'/></Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              <div className='flex items-center justify-around'>
                <FiUser className="text-cyan-600 text-5xl" />
                <span className='text-3xl font-semibold'>အကောင့်၀င်ရန်</span>
              </div>
            </h1>
          </div>

          <div>
            <label className='block font-semibold py-2'>နာမည်</label>
            <input type="text" maxLength={30} placeholder="နာမည်ထည့်ရန်" className='w-full input input-borded focus:outline-offset-0'
              onChange={(e)=> setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className='relative'>
            <label className='block font-semibold py-2'>လျို့၀ှက်နံပါတ်</label>
            <input type={showPassword ? "text" :"password"} maxLength={50} placeholder="လျို့၀ှက်နံပါတ်ထည့်ရန်" className='w-full input input-borded focus:outline-offset-0 pr-10'
              onChange={(e)=> setFormData({...formData, password: e.target.value})}
            />
            <span
              className="absolute right-3 top-13 z-10 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye className="text-xl" /> : <FiEyeOff className="text-xl" />}
            </span>
          </div>

          <Link to='/' className='text-sm text-green-600 hover:underline hover:text-blue-700 mt-4 inline-block'> ပင်မစာမျက်နှာ သို့သွားရန်</Link>

          <div className='pt-3'>
            <button className='btn btn-primary w-full'>
              {loading ? <span className="loading loading-spinner loading-xs"></span>
                : "အကောင့်၀င်ရန်"
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login