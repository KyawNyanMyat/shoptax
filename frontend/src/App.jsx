import { Navigate, Outlet, Route, Routes } from "react-router-dom"
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
import AdminLogin from "./adminpages/login/AdminLogin"
import AdminSignup from "./adminpages/login/AdminSignup"
import AdminDashboardHome from "./adminpages/adminDashboard/AdminDashboardHome"
import { Toaster } from "react-hot-toast"
import ManageAdmins from "./adminpages/adminDashboard/ManageAdmins"
import AdminManageUsers from "./adminpages/adminDashboard/ManageUsers"
import AdminManageShops from "./adminpages/adminDashboard/AdminManageShops"
import AdminManagePayments from "./adminpages/adminDashboard/AdminManagePayment"
import AdminManageReceipts from "./adminpages/adminDashboard/AdminManageReceipts"
import AdminViewWarnings from "./adminpages/adminDashboard/AdminViewWarning"
import AdminSendWarning from "./adminpages/adminDashboard/AdminSendWarning"
import { UserAuthContextProvider, useUserAuthContext } from "./context/userAuthContext"
//import SocketTest from "./Test"
function App() {

  const UserProtectedLayout = () => (
    <UserAuthContextProvider>
      <Outlet />
    </UserAuthContextProvider>
  );
  
  return (
    <>
      <div className="flex flex-col min-h-screen" >
        {/* <SocketTest/> */} 
        <main className="bg-white">
          {/* In the future Add auth */}
          <Routes>
            
            {/* User */}
            <Route path="/login" element={<Login/>} />

            <Route element={<UserProtectedLayout/>}>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About/>} />

              <Route path="/user" element={ <DashboardHome />} />
              <Route path="/user/warningmessage" element={<WarningMessages />} />
              <Route path="/user/receipt" element={<Receipts />} />
              <Route path="/user/paymentproof" element={<SubmitPaymentProof />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
            <Route path="/admin/manageuser" element={<AdminManageUsers />} />
            <Route path="/admin/manageadmin" element={<ManageAdmins />} />
            <Route path="/admin/manageshop" element={<AdminManageShops />} />
            <Route path="/admin/managepayment" element={<AdminManagePayments />} />
            <Route path="/admin/sendwarning" element={<AdminSendWarning />} />
            <Route path="/admin/viewreceipt" element={<AdminManageReceipts />} />
            <Route path="/admin/viewwarning" element={<AdminViewWarnings />} />
            <Route path="/admin/user/signup" element={<Signup/>} />
          </Routes>
          <Toaster/>
        </main>
      </div>
    </>
  )
}

export default App
