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
import UserManagement from './page/vendor/user/UserManagement'
import VendorDashboard from './page/vendor/VendorDashboard'
import Subscription from './page/vendor/subscription/Subscription'
import VendorForgotPassword from './page/ForgotPassword'
import ResetPassword from './page/ResetPassword'
import IntroAnalysis from './page/IntroductionResult'
import VendorManagement from './components/admin/VendorManagement'
function App() {
  return (
   <BrowserRouter>
      <Routes>
        {/* ===== Admin Routes ===== */}
        <Route path='/res' element={<IntroAnalysis />} />
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="code-generation" element={<CodeGenerationPage />} />
        <Route path="subscription" element={<AdminSubscription />} />
        <Route path="vendor-management" element={<VendorManagement />} />
      </Route>

      {/* Vendor Routes */}
      <Route path="/vendor" element={<DashboardLayout role="vendor" />}>
        <Route index element={<VendorDashboard />} />
        <Route path='user-management' element={<UserManagement/>} />
        <Route path="subscription" element={<Subscription />} />
      </Route>

        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Login />} />
        <Route path='/vendor-signup' element={<Signup />} />
        <Route path='/otp-verify' element={<OtpVerification />} />
        <Route path="/candidate/start_test" element={<IntroAnalysisApp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path='/forgot-password' element={<VendorForgotPassword/>} />
        {/* ===== 404 Fallback ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
