import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  LogOut
} from "lucide-react";
import { useSubVendorLogoutMutation } from "../../../redux/services/subvendorApi";
import toast from "react-hot-toast";
import Loader from "../../../libs/Loader";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [subVendorLogout, { isLoading }] = useSubVendorLogoutMutation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/subvendor/dashboard",
    },
    {
      title: "Candidate Management",
      icon: Users,
      path: "/subvendor/user-management",
    },
    {
      title: "Result Management",
      icon: Users,
      path: "/subvendor/result-management",
    },
    {
      title: "Profile",
      icon: UserCircle,
      path: "/subvendor/profile",
    },
  ];

  const handleLogout = async () => {
    try {
      const result = await subVendorLogout()
      // debugger;

      if (result?.data?.status) {
        toast.success("Employee Logout Sucessfully.")
        localStorage.clear()
        setTimeout(() => {
          navigate("/employee/login")
        }, 1000)
      }
      if (result?.error) {
        return toast.error(result?.error?.data?.detail ?? "Somthing went wrong !")
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong");
    }
  };


  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#fdfdfdd5] border-r-white z-50
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 bg-[#2965b4]">
          <h1 className="text-xl font-bold text-white">eCampus</h1>
        </div>

        {/* Menu */}
        <div className="flex flex-col bg-[#e4e6ea] justify-between h-[calc(100%-64px)]">

          <nav className="p-4 space-y-2">

            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                    transition-all duration-200 text-sm font-medium
                    ${isActive
                      ? "bg-[#5b3cc4] text-white shadow"
                      : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  <Icon size={20} />
                  {item.title}
                </div>
              );
            })}
          </nav>

          {/* Logout bottom */}
          <div className="p-4 ">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition text-sm font-medium"
            >
              {
                isLoading ? <>
                   Logging
                  <span>
                    <Loader size={20} innerSize={10} />
                  </span>
                </> : <> <LogOut className="h-5 w-5" />
                  <span>Logout</span></>
              }

            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
