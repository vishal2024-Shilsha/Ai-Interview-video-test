import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
// import CreateAccount from './page/Account'
// import Header from './page/Header'
// import IntroAnalysisApp from './page/REsult'
import Login from './page/Login'
import NotFound from './page/NotFound'
import IntroAnalysisApp from './page/REsult'
import RecordPage from './page/Record'
import SuccessPage from './page/Success'
import DashboardLayout from './components/ui/Layout/DashboardLayout'
import AdminDashboard from './page/AdminboardPage'
import CodeGenerationPage from './page/CodeGenerationPage'
import AdminSubscription from './page/AdminSubscription'
import Signup from './page/Signup'
import OtpVerification from './page/OtpVerification'
import VendorDashboard from './page/VendorDashboard'

function App() {

  return (
   <BrowserRouter>
      <Routes>
        {/* ===== Admin Routes ===== */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="code-generation" element={<CodeGenerationPage />} />
        <Route path="subscription" element={<AdminSubscription />} />
      </Route>

      {/* Vendor Routes */}
      <Route path="/vendor" element={<DashboardLayout role="vendor" />}>
        <Route index element={<VendorDashboard />} />
        {/* <Route path="products" element={<VendorProducts />} />
        <Route path="orders" element={<VendorOrders />} /> */}
      </Route>

        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Login />} />
        <Route path='/vendor-signup' element={<Signup />} />
        <Route path='/otp-verify' element={<OtpVerification />} />
        <Route path="/result" element={<IntroAnalysisApp />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* ===== 404 Fallback ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
