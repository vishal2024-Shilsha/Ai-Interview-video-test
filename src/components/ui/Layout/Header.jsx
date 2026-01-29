import { useState, useRef, useEffect } from "react";
import { Menu, UserCircle, ChevronDown } from "lucide-react";
import profileImg from '../../../assets/userImg.jpg';
import { useNavigate } from "react-router-dom";

const Header = ({ setSidebarOpen, role = "admin", userName = "" }) => {
  const displayName = userName || (role === "vendor" ? "Vendor" : "Admin");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  let info = null

  const user = localStorage.getItem('user')

  if (user) {
    info = JSON.parse(user)
  }

  return (
    <header className="bg-white shadow px-4 py-1 border-b border-[#ece8e8] flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-700">
          {role === "vendor" ? (
            <>
              Hello {info?.name}
            </>
          ) : (
            "Ebench Admin"
          )}
        </h2>
      </div>

      {/* Right Section */}
      <div ref={dropdownRef} className="relative">
        <div
          className="relative flex items-center gap-3 cursor-pointer bg-gray-100 rounded-lg px-3 py-2 transition"
          onClick={() => setOpen(prev => !prev)}

        >
          {/* Profile Photo */}
          <img
            src={profileImg} // replace with real image
            alt="Profile"
            className="h-9 w-9 rounded-full object-cover"
          />

          {/* Name & Email */}
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-700">
              {info?.name}
            </span>
            <span className="text-xs text-gray-500">
              {info?.email}
            </span>
          </div>

          {/* Dropdown Icon */}
          <ChevronDown className="h-4 w-4 text-gray-500" />

        </div>
        {open && role == "vendor" && (
          <div className="absolute right-1 z-50 mt-2 w-44 bg-white border border-gray-100 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="py-1 text-sm text-gray-700">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => [navigate('/vendor/profile'), setOpen(false)]}
              >
                Profile
              </li>
              {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Settings
              </li> */}
              {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Logout
              </li> */}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
