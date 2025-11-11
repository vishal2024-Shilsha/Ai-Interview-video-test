import React from "react";
import { Menu, UserCircle, ChevronDown } from "lucide-react";

const Header = ({ setSidebarOpen, role = "admin", userName = "" }) => {
  // Display name based on role
  const displayName = userName || (role === "vendor" ? "Vendor" : "Admin");

  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
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
          {role === "vendor" ? "Vendor Portal" : "Ebench Admin"}
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-gray-600 font-medium">{displayName}</span>
        <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1 transition">
          <UserCircle className="h-8 w-8 text-gray-600" />
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
