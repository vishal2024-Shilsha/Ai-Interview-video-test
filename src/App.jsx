import { BrowserRouter, Route, Routes,Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import ProtectedRoute from "./libs/ProtectedRoute";
import PageLoader from "./libs/PageLoader";

/* =========================
   Lazy Loaded Layout
========================= */
const DashboardLayout = lazy(() =>
  import("./components/ui/Layout/DashboardLayout")
);

/* =========================
   Lazy Loaded Admin Pages
========================= */
const AdminDashboard = lazy(() => import("./page/AdminboardPage"));
const AdminSubscription = lazy(() => import("./page/AdminSubscription"));
const VendorManagement = lazy(() =>
  import("./components/admin/VendorManagement")
);
const SubscriptionList = lazy(() =>
  import("./components/admin/SubscriptionList")
);
const AdminLoginPage = lazy(() => import("./components/admin/Login"));

/* =========================
   Lazy Loaded Vendor Pages
========================= */
const VendorDashboard = lazy(() => import("./page/vendor/VendorDashboard"));
const UserManagement = lazy(() =>
  import("./page/vendor/user/UserManagement")
);
const Subscription = lazy(() =>
  import("./page/vendor/subscription/Subscription")
);
const ViewSubscription = lazy(() =>
  import("./page/vendor/subscription/ViewSubscription")
);
const Profile = lazy(() => import("./page/vendor/Profile"));
const ResultManagement = lazy(() =>
  import("./page/vendor/result/ResultManagement")
);

/* =========================
   Lazy Loaded Public Pages
========================= */
const Login = lazy(() => import("./page/Login"));
const Signup = lazy(() => import("./page/Signup"));
const OtpVerification = lazy(() => import("./page/OtpVerification"));
const IntroAnalysisApp = lazy(() => import("./page/REsult"));
const IntroAnalysis = lazy(() => import("./page/IntroductionResult"));
const RecordPage = lazy(() => import("./page/Record"));
const VendorForgotPassword = lazy(() =>
  import("./page/ForgotPassword")
);
const ResetPassword = lazy(() => import("./page/ResetPassword"));
const CheckoutPage = lazy(() => import("./libs/CheckoutPage"));
const Cancel = lazy(() => import("./libs/Cancel"));
const Success = lazy(() => import("./libs/PaymentSuccess"));
const SuccessPageTest = lazy(() => import("./page/TestSuccess"));
const ProcessingPayment = lazy(() =>
  import("./page/vendor/subscription/VerifyPayments")
);
const PaymentSuccess = lazy(() =>
  import("./page/vendor/subscription/PaymentSucessPage")
);
const PaymentFailed = lazy(() =>
  import("./page/vendor/subscription/PaymentFailed")
);
const Unauthorized = lazy(() => import("./libs/UnauthorizedPage"));
const NotFound = lazy(() => import("./page/NotFound"));


/* =========================
   App Component
========================= */
function App() {

  const isAuthenticated = !!localStorage.getItem('token'); // or use state/context


  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ===== Admin Routes ===== */}
          <Route path="/res" element={<IntroAnalysis />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route
              path="subscription/user"
              element={<AdminSubscription />}
            />
            <Route
              path="subscription/list"
              element={<SubscriptionList />}
            />
            <Route
              path="vendor-management"
              element={<VendorManagement />}
            />
          </Route>

          {/* ===== Vendor Routes ===== */}
          <Route
            path="/vendor/*"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route
              path="user-management"
              element={<UserManagement />}
            />
            <Route
              path="subscription/plan"
              element={<Subscription />}
            />
            <Route
              path="subscription/view"
              element={<ViewSubscription />}
            />
            <Route path="profile" element={<Profile />} />
            <Route
              path="result-management"
              element={<ResultManagement />}
            />
            <Route
              path="result-management/view"
              element={<IntroAnalysis />}
            />
          </Route>

          {/* ===== Public Routes ===== */}
          <Route
            path="/"
            element={
              localStorage.getItem("role") ? (
                // If logged in, redirect based on role
               ( localStorage.getItem("role") === "admin" && isAuthenticated) ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/vendor/dashboard" replace />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/vendor-signup" element={<Signup />} />
          <Route path="/otp-verify" element={<OtpVerification />} />
          <Route
            path="/candidate/start_test"
            element={<IntroAnalysisApp />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/success" element={<Success />} />
          <Route path="/test-success" element={<SuccessPageTest />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/payment/cancel" element={<Cancel />} />
          <Route path="/checkout-page" element={<CheckoutPage />} />
          <Route
            path="/verify-payments"
            element={<ProcessingPayment />}
          />
          <Route
            path="/payment-success"
            element={<PaymentSuccess />}
          />
          <Route
            path="/forgot-password"
            element={<VendorForgotPassword />}
          />
          <Route
            path="/payment-failed"
            element={<PaymentFailed />}
          />

          {/* ===== Fallback Routes ===== */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

