import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import ProtectedRoute from "./libs/ProtectedRoute";
import PageLoader from "./libs/PageLoader";
import AppErrorBoundary from "./libs/AppErrorBoundary";
import SubVendorLogin from "./page/subVendor/Login";
import DashboardHome from "./page/subVendor/DashboardHome";
import { onMessage } from "firebase/messaging";
import { messaging } from "./Firebase/Firebase";
import toast from "react-hot-toast";

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
const RoleManagement = lazy(() => import("./page/vendor/role/RoleManagement"))
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
// const IntroAnalysisApp = lazy(() => import("./page/REsult"));
const IntroAnalysisApp = lazy(() => import("./page/Result"));

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
const SubvendorResetPassword = lazy(() => import("./page/subVendor/SubvendorResetPassword"));
const ViewSubVendorDetails = lazy(() => import('./page/vendor/role/ViewSubVendor'))

const DashboardSubVendorLayout = lazy(() => import('./components/subvendor/DashboardLayout/DashboardLayout'))
const ProfileSection=lazy(() =>import('./page/subVendor/SubVendorProfile'))
/* =========================
   App Component
========================= */ //110011
function App() {

  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      toast.custom(
        (t) => (
          <div
            className={`bg-[#6090e2] text-white shadow-xl rounded-lg p-4 w-[260px]
          transform transition-all duration-500
          ${t.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          >
            <p className="font-semibold text-sm">
              {payload?.notification?.title}
            </p>
            <p className="text-xs mt-1 opacity-90">
              {payload?.notification?.body}
            </p>
          </div>
        ),
        {
          position: "bottom-right",
          // duration: 4000,
        }
      );
    });

    return () => unsubscribe();
  }, []);


  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ===== Public Routes ===== */}
            <Route
              path="/"
              element={
                localStorage.getItem("role")=="vendor" ? (
                  // If logged in, redirect based on role
                  (localStorage.getItem("role") === "admin" && isAuthenticated) ? (
                    <Navigate to="/admin/dashboard" replace />
                  ) : (
                    <Navigate to="/vendor/dashboard" replace />
                  )
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/res" element={<IntroAnalysis />} />
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

            <Route path="/employee/login" element={<SubVendorLogin />} />
            <Route path="/reset-password/subvendor" element={<SubvendorResetPassword />} />



            {/* ===== Admin Routes ===== */}

            <Route
              path="/admin/*"
              element={
                <AppErrorBoundary>
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                </AppErrorBoundary>

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
                <AppErrorBoundary>
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                </AppErrorBoundary>
              }
            >
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route
                path="user-management"
                element={<UserManagement />}
              />
              <Route path="role-management" element={<RoleManagement />} />
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
              <Route path="role-management/view" element={<ViewSubVendorDetails />} />
            </Route>

            {/* ===== Sub Vendor Routes ===== */}
            <Route
              path="/subvendor/*"
              element={
                <AppErrorBoundary>
                  <ProtectedRoute allowedRoles={["sub_vendor"]}>
                    <DashboardSubVendorLayout />
                  </ProtectedRoute>
                </AppErrorBoundary>
              }
            >
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route
                path="result-management"
                element={<ResultManagement />}
              />
              <Route
                path="result-management/view"
                element={<IntroAnalysis />}
              />
              <Route
                path="profile"
                element={<ProfileSection />}
              />

            </Route>


            {/* ===== Fallback Routes ===== */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

