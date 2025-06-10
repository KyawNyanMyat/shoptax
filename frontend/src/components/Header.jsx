import { FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets/react.svg"

const Header = () => {
  return (
    <header className="bg-primary text-white px-8 py-4 shadow flex justify-between items-center">
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <img
          src={logo} // Change this path to your actual logo
          alt="TDD Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">Township Development Department</h1>
          <p className="text-sm text-gray-200">Serving the community with dedication</p>
        </div>
      </div>

      {/* Nav + Bell */}
      <div className="flex items-center gap-6">
        <Link to='/' className="hover:underline">Home</Link>
        <Link to='/about' className="hover:underline">About</Link>
        <Link to='/contact' className="hover:underline">Contact</Link>
        <Link to='/login' className="btn btn-sm btn-accent text-white">Login</Link>

        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <FiBell className="text-white text-2xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
