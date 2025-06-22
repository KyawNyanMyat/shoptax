import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useSignUp from '../../hooks/useSignUp.js';

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
    await signup(formData)
  }


  // useEffect(() => {
  //   console.log(formData)
  //   const fetchShops = async () => {
  //     try {
  //       const res = await fetch('/api/shops')
  //       const data = await res.json()
  //       setShops(data)
  //     } catch (err) {
  //       console.error("Failed to fetch shops:", err)
  //     }
  //   }

  //   fetchShops()
  // }, [])


  return (
    <div className='flex flex-col h-full items-center justify-center mt-10 min-h-screen'>
      <div className='bg-gray-200 py-10 mt-18 sm:mt-0 p-5 w-11/12 md:w-1/3'>

        <form onSubmit={handleSubmit} autoComplete='off'>
          <div className='flex items-center justify-center'>
            <Link to="/"><img src="./src/assets/react.svg" alt="Logo"  className='rounded-full w-20 h-10 cursor-pointer'/></Link>
            <span className='text-3xl font-semibold'>Signup</span>
          </div>

          <div>
            <label className='block font-semibold py-2'>UserName</label>
            <input type="text" required placeholder="Enter your name" className=' w-full input input-borded focus:outline-offset-0'
              onChange={(e)=> setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className='block font-semibold py-2'>Password</label>
            <input type="password" required placeholder="Enter your Password" className=' w-full input input-borded focus:outline-offset-0'
              onChange={(e)=> setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className='block font-semibold py-2'>Confirm Password</label>
            <input type="password" required placeholder="Enter your Password again" className=' w-full input input-borded focus:outline-offset-0'
              onChange={(e)=> setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          {/* <div>
            <label className='block font-semibold py-2'>Choose Shop</label>
            <select
              className='select select-bordered w-full focus:outline-offset-0'
              value={formData.shopId}
              onChange={(e) =>
                setFormData({ ...formData, shopId: e.target.value })
              }
            >
              <option value="" disabled>Choose a shop</option>
              {
                shops.map((item, idx)=>(
                  <option key={item._id} value={item._id}>HallNo {item.marketHallNo} - ShopNo {item.shopNo}</option>
                ))
              }
              <option disabled>End</option>
            </select>
          </div> */}

          <div>
            <label className='block font-semibold py-2'>NRC</label>
            <input type="text" required placeholder="Enter your NRC" className=' w-full input input-borded focus:outline-offset-0'
              onChange={(e)=> setFormData({...formData, NRC: e.target.value})}
            />
          </div>

          <div>
            <label className='block font-semibold py-2'>Phone Number</label>
            <input type="text" required placeholder="Enter your phone number" className=' w-full input input-borded focus:outline-offset-0'
              onChange={(e)=> setFormData({...formData, phoneNo: e.target.value})}
            />
          </div>
          
          <div className='flex items-center gap-3'>
            <label className='block font-semibold py-2'>Choose your gender</label>

            <span>Male</span>
            <input
              type="radio"
              name="gender"
              value="male"
              required
              checked={formData.gender === "male"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className='radio radio-sm radio-primary'
            />

            <span>Female</span>
            <input
              type="radio"
              name="gender"
              value="female"
              required
              checked={formData.gender === "female"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className='radio radio-sm radio-primary'
            />
          </div>


          <div className='pt-3'>
            <button className='btn btn-success w-full'>
              {loading ? <span className="loading loading-spinner loading-xs"></span>
                : "Sign Up"
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Signup