// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { Code2, Users, LayoutDashboard, X, LogOut } from "lucide-react";
// import logo from "../../../assets/logo_white2.png";
// import { Gem } from 'lucide-react';


// const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         navigate("/"); 
//     };


    
//     return (
//         <aside
//             className={`fixed md:static top-0 left-0 h-full z-40 bg-[#286a94] text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
//                 } md:translate-x-0 transition-transform duration-300 w-64 flex flex-col justify-between`}
//         >
//             <div>
//                 {/* Logo */}
//                 <div className="flex items-center justify-between p-4 border-b border-b-[#96b7cc]">
//                     <img
//                         className="w-9/12 mx-auto h-8 object-contain"
//                         src={logo}
//                         alt="Ebench logo"
//                     />
//                     <button
//                         onClick={() => setSidebarOpen(false)}
//                         className="md:hidden text-white"
//                     >
//                         <X className="h-5 w-5" />
//                     </button>
//                 </div>

//                 {/* Navigation */}
//                 <nav className="mt-6 flex flex-col gap-1">
//                     <NavLink
//                         to="/admin"
//                         end
//                         className={({ isActive }) =>
//                             `flex items-center px-4 py-2 ${isActive ? "bg-[#6398b9]" : "hover:bg-[#387aa3]"
//                             }`
//                         }
//                     >
//                         <LayoutDashboard className="h-5 w-5 mr-3" />
//                         <span>Dashboard</span>
//                     </NavLink>

//                     <NavLink
//                         to="/admin/code-generation"
//                         className={({ isActive }) =>
//                             `flex items-center px-4 py-2 ${isActive ? "bg-[#6398b9]" : "hover:bg-[#387aa3]"
//                             }`
//                         }
//                     >
//                         <Code2 className="h-5 w-5 mr-3" />
//                         <span>Code Generation</span>
//                     </NavLink>

//                     <NavLink
//                         to="/admin/subscription"
//                         className={({ isActive }) =>
//                             `flex items-center px-4 py-2 ${isActive ? "bg-[#6398b9]" : "hover:bg-[#387aa3]"
//                             }`
//                         }
//                     >
//                         <Gem className="h-5 w-5 mr-3" />
//                         <span>Subscription Management</span>
//                     </NavLink>
//                 </nav>

//             </div>

//             {/* Logout */}
//             <div className="border-t border-[#96b7cc] p-4">
//                 <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-[#387aa3] transition"
//                 >
//                     <LogOut className="h-5 w-5" />
//                     <span>Logout</span>
//                 </button>
//             </div>
//         </aside>
//     );
// };

// export default Sidebar;


import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Code2, Users, LayoutDashboard, X, LogOut, Package, ShoppingBag, Crown } from "lucide-react";
import logo from "../../../assets/logo_white2.png";
import { Gem } from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, role = "admin" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear()
    navigate("/"); 
  };

  // ✅ Sidebar Menus for both roles
  const adminMenu = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    {to:"/admin/vendor-management" , label:"Vendor Management" ,icon:Gem},
    { to: "/admin/code-generation", label: "Code Generation", icon: Code2 },
    { to: "/admin/subscription", label: "Subscription Management", icon: Gem },
  ];

  const vendorMenu = [
    { to: "/vendor", label: "Dashboard", icon: LayoutDashboard },
    { to: "/vendor/user-management", label: "User Management", icon: Users },
    { to: "/vendor/subscription", label: "Subscription", icon: Crown },
  ];

  const menuItems = role === "vendor" ? vendorMenu : adminMenu;

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full z-40 bg-[#286a94] text-white transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 w-64 flex flex-col justify-between`}
    >
      <div>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-b-[#96b7cc]">
          <img className="w-9/12 mx-auto h-8 object-contain" src={logo} alt="Ebench logo" />
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Navigation */}
        <nav className="mt-6 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 ${
                    isActive ? "bg-[#6398b9]" : "hover:bg-[#387aa3]"
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-[#387aa3] transition"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
