import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useSignUp from '../../hooks/useSignUp.js';
import logo from "/logo.png"
import { FiUser, FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    NRC: '',
    phoneNo: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [shops, setShops] = useState([]);
  
  const { loading, signup } = useSignUp()

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const success = await signup(formData)

    // If signup is successful, reset the form
    if (success) {
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        gender: '',
        NRC: '',
        phoneNo: '',
      });
    }
  }



  return (
    <div className='flex flex-col h-full items-center justify-center md:mt-10 min-h-screen'>
      <div className='bg-gray-200 py-10 sm:mt-0 p-5 w-11/12 md:w-1/3 rounded-t-4xl border-t-4 border-green-500 shadow shadow-green-400'>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Link to="/admin/dashboard"><img src={logo} alt="Logo"  className='rounded-full w-20 h-24 cursor-pointer'/></Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              <div className='flex items-center justify-center'>
                <FiUser className="text-blue-600 text-5xl" />
                <span className='text-3xl font-semibold'>အကောင့်ဖွင့်ရန်</span>
              </div>
            </h1>
          </div>

        <form onSubmit={handleSubmit} autoComplete='off'>

          <div>
            <label className='block font-semibold py-2'>နာမည်</label>
            <input type="text" maxLength={50} required placeholder="ဦးကျော်လင်း"
              className=' w-full input input-borded focus:outline-offset-0'
              value={formData.username}
              onChange={(e)=> setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className='relative'>
            <label className='block font-semibold py-2'>လျို့၀ှက်နံပါတ်</label>
            <input type={showPassword ? "text" :"password"} required placeholder="ဥပမာ.၁၂၃၄fpass" 
              className=' w-full input input-borded focus:outline-offset-0 pr-10'
              value={formData.password}
              onChange={(e)=> setFormData({...formData, password: e.target.value})}
              maxLength={30}
            />
            <span
              className="absolute right-3 top-13 z-10 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye className="text-xl" /> : <FiEyeOff className="text-xl" />}
            </span>
          </div>

          <div className='relative'>
            <label className='block font-semibold py-2'>လျို့၀ှက်နံပါတ် အတည်ပြုရန်</label>
            <input type={showConfirmPassword ? "text" :"password"} required placeholder="ဥပမာ.၁၂၃၄fpass" 
              className=' w-full input input-borded focus:outline-offset-0 pr-10'
              value={formData.confirmPassword}
              onChange={(e)=> setFormData({...formData, confirmPassword: e.target.value})}
              maxLength={30}
            />
            <span
              className="absolute right-3 top-13 z-10 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEye className="text-xl" /> : <FiEyeOff className="text-xl" />}
            </span>
          </div>

          <div>
            <label className='block font-semibold py-2'>မှတ်ပုံတင်</label>
            <input type="text" required placeholder="၁၂/အစန(နိင်)၁၅၃၆၇၈" 
              className=' w-full input input-borded focus:outline-offset-0'
              value={formData.NRC}
              onChange={(e)=> setFormData({...formData, NRC: e.target.value})}
            />
          </div>

          <div>
            <label className='block font-semibold py-2'>ဖုန်းနံပါတ်</label>
            <input type="text" required placeholder="၀၉-၆၇၇၈၅၅၄၉၈" 
              className=' w-full input input-borded focus:outline-offset-0'
              value={formData.phoneNo}
              onChange={(e)=> setFormData({...formData, phoneNo: e.target.value})}
            />
          </div>
          
          <div className='flex items-center gap-3'>
            <label className='block font-semibold py-2'>လိင်ရွေးရန်</label>

            <span>ယောက်ျား</span>
            <input
              type="radio"
              name="gender"
              value="Male"
              required
              checked={formData.gender === "Male"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className='radio radio-sm radio-primary'
            />

            <span>မိန်းမ</span>
            <input
              type="radio"
              name="gender"
              value="Female"
              required
              checked={formData.gender === "Female"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className='radio radio-sm radio-primary'
            />
          </div>

          <Link to='/admin/dashboard' className='text-sm hover:underline text-green-600 hover:text-blue-700 mt-4 inline-block'> အုပ်ချုပ်ရေးဒက်ရှ်ဘုတ် သို့သွားရန်</Link>

          <div className='pt-3'>
            <button className='btn btn-success w-full'>
              {loading ? <span className="loading loading-spinner loading-xs"></span>
                : "အကောင့်ဖွင့်ရန်"
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Signup