import { Route, Routes } from "react-router-dom"
import Contact from "./pages/Contact"
import './App.css'
import Home from "./pages/Home"
import About from "./pages/About"
import Login from "./pages/login/Login"
import Signup from "./pages/login/Signup"
import DashboardHome from "./pages/userDashboard/DashboardHome"
import WarningMessages from "./pages/userDashboard/WarningMessages"
import Receipts from "./pages/userDashboard/Receipts"
import SubmitPaymentProof from "./pages/userDashboard/SubmitPaymentProof"
function App() {

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="bg-base-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />

            <Route path="/user/" element={<DashboardHome/>} />
            <Route path="/user/warningmessage" element={<WarningMessages />} />
            <Route path="/user/receipt" element={<Receipts />} />
            <Route path="/user/paymentproof" element={<SubmitPaymentProof />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
