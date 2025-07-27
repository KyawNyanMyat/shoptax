import React from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from "react-router-hash-link"

const Footer = () => {
  return (
    <footer className=" bg-emerald-700 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

        {/* Quick Links */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold mb-3">လင့်ခ်အတိုများ</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">ပင်မစာမျက်နှာ</a></li>
            <li><a href="/about" className="hover:underline">အကြောင်းအရာ</a></li>
            <li><a href="/contact" className="hover:underline">ဆက်သွယ်ရန်</a></li>
            <li><HashLink to="/#services" className="hover:underline">၀န်ဆောင်မှုများ</HashLink></li>
            <li><HashLink to="/#usage" className="hover:underline">အသုံပြုနည်း</HashLink></li>
          </ul>
        </div>

        {/* Department Info */}
        <div className="flex-1 text-center">
          <h2 className="text-xl font-bold mb-3">ဈေးနှင့်သားသတ်ဌာနစိတ်</h2>
          <p className="text-sm text-white max-w-sm mx-auto">
          ဆိုင်ခန်းအခွန်ကို စနစ်တကျကောက်ခံခြင်းအားဖြင့် မြို့နယ်ဖွံ့ဖြိုး တိုးတက်စေပါသည်။
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex-1 text-center md:text-right">
          <h3 className="text-lg font-bold mb-3">ဆက်သွယ်ရန်</h3>
          <p className="text-sm text-white">
            အမည် - ဒေါ်မော်မော်လှိုင်<br />
            ဖုန်း - ၀၉ ၄၄၉၈၇ ၀၁၁၅<br />
            တည်နေရာ - ရမည်းသင်းမြို့
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />
      <p className="text-center text-xs text-black">
        &copy; {new Date().getFullYear()} ဈေးနှင့်သားသတ်ဌာနစိတ် မူပိုင်ခွင့်ရှိသည်။
      </p>
    </footer>
  )
}

export default Footer
