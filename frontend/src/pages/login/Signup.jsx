import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='flex flex-col h-screen items-center justify-center'>
      <div className='bg-gray-200 py-10 mt-18 sm:mt-0 p-6 w-11/12 md:w-1/3'>

        <form>
          <div className='flex items-center justify-center'>
            <Link to="/"><img src="./src/assets/react.svg" alt="Logo"  className='rounded-full w-20 h-10 cursor-pointer'/></Link>
            <span className='text-3xl font-semibold'>Signup</span>
          </div>

          <div>
            <label className='block font-semibold py-2'>UserName</label>
            <input type="text" placeholder="Enter your name" className=' w-full input input-borded focus:outline-offset-0'/>
          </div>

          <div>
            <label className='block font-semibold py-2'>Password</label>
            <input type="text" placeholder="Enter your Password" className=' w-full input input-borded focus:outline-offset-0'/>
          </div>

          <div>
            <label className='block font-semibold py-2'>Confirm Password</label>
            <input type="text" placeholder="Enter your Password again" className=' w-full input input-borded focus:outline-offset-0'/>
          </div>

          <div>
            <label className='block font-semibold py-2'>NRC</label>
            <input type="text" placeholder="Enter your NRC" className=' w-full input input-borded focus:outline-offset-0'/>
          </div>
          
          <div className='flex items-center gap-3'>
            <label className='block font-semibold py-2'>Choose your gender</label>
            <span>Male</span> <input type="radio" name="gender" value={"male"} className='radio radio-sm radio-primary'/>
            <span>Female</span> <input type="radio" name='gender' value={"female"} className='radio radio-sm radio-primary'/>
          </div>

          <div className='pt-3'>
            <button className='btn btn-success w-full'>Signup</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Signup