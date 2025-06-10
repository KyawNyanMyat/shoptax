import React from 'react'

const Footer = () => {
  return (
    <footer className=" bg-emerald-600 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

        {/* Quick Links */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="#services" className="hover:underline">Services</a></li>
            <li><a href="/vote" className="hover:underline">Contact</a></li>
            <li><a href="/faq" className="hover:underline">Login</a></li>
          </ul>
        </div>

        {/* Department Info */}
        <div className="flex-1 text-center">
          <h2 className="text-xl font-bold mb-3">Township Development Dept.</h2>
          <p className="text-sm text-white max-w-sm mx-auto">
            Committed to improving township living through better shop tax management, clean streets, reliable water, and garbage services.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex-1 text-center md:text-right">
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p className="text-sm text-white">
            Email: kyawnyanmyat40@gmail.com<br />
            Phone: +95 9 9743 37432<br />
            Location: Yamethin, Myanmar
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />
      <p className="text-center text-xs text-black">
        &copy; {new Date().getFullYear()} Township Development Department. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
