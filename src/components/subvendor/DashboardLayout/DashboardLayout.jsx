// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import DashboardHome from "../../../page/subVendor/DashboardHome";
// import UserManagement from "../../../page/vendor/user/UserManagement";
// // import Profile from "./Profile";

// const DashboardLayout = () => {
//   const [activeMenu, setActiveMenu] = useState("dashboard");

//   const renderContent = () => {
//     switch (activeMenu) {
//       case "dashboard":
//         return <DashboardHome />;
//       case "users":
//         return <UserManagement />;
//       case "profile":
//         // return <Profile />;
//       default:
//         return <DashboardHome />;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#f4f7fb]">
//       <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

//       <div className="flex-1 flex flex-col">
//         <Header />
//         <main className="p-8 overflow-y-auto">{renderContent()}</main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


import  { useState,useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { requestPermission } from "../../../redux/services/firebase";


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-[#f5f7fb]">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">

        {/* Header FIXED */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-16">
          {/* <DashboardContent /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
