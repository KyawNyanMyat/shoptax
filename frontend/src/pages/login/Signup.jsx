import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useSignUp from '../../hooks/useSignUp.js';
import logo from "../../assets/react.svg"
import { FiUser } from "react-icons/fi";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    NRC: '',
    phoneNo: '',
    // shopId: ''
  })

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
      <div className='bg-gray-200 py-10 sm:mt-0 p-5 w-11/12 md:w-1/3'>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FiUser className="text-blue-600 text-5xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              <div className='flex items-center justify-center'>
                <Link to="/admin/dashboard"><img src={logo} alt="Logo"  className='rounded-full w-20 h-10 cursor-pointer'/></Link>
                <span className='text-3xl font-semibold'>အကောင့်ဖွင့်ရန်</span>
              </div>
            </h1>
          </div>

        <form onSubmit={handleSubmit} autoComplete='off'>

          <div>
            <label className='block font-semibold py-2'>နာမည်</label>
            <input type="text" required placeholder="ဦးကျော်လင်း"
              className=' w-full input input-borded focus:outline-offset-0'
              value={formData.username}
              onChange={(e)=> setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className='block font-semibold py-2'>လျို့၀ှက်နံပါတ်</label>
            <input type="password" required placeholder="ဥပမာ.၁၂၃၄fpass" 
              className=' w-full input input-borded focus:outline-offset-0'
              value={formData.password}
              onChange={(e)=> setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className='block font-semibold py-2'>လျို့၀ှက်နံပါတ် အတည်ပြုရန်</label>
            <input type="password" required placeholder="ဥပမာ.၁၂၃၄fpass" 
              className=' w-full input input-borded focus:outline-offset-0'
              value={formData.confirmPassword}
              onChange={(e)=> setFormData({...formData, confirmPassword: e.target.value})}
            />
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
              value="ယောက်ျား"
              required
              checked={formData.gender === "ယောက်ျား"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className='radio radio-sm radio-primary'
            />

            <span>မိန်းမ</span>
            <input
              type="radio"
              name="gender"
              value="မိန်းမ"
              required
              checked={formData.gender === "မိန်းမ"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className='radio radio-sm radio-primary'
            />
          </div>

          <Link to='/admin/dashboard' className='text-sm hover:underline text-green-600 hover:text-blue-700 mt-4 inline-block'> ပင်မစာမျက်နှာ သို့သွားရန်</Link>

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