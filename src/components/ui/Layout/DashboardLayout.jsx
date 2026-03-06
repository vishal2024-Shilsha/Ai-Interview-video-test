import { useState,useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { requestPermission } from "../../../redux/services/firebase";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role=localStorage.getItem('role')
  if(!localStorage.getItem('token')){
    if(role==="admin"){
    window.location.href = '/admin-login';
    }else{
    window.location.href = '/';
    }
    localStorage.clear()
    return;
  }

  useEffect(() => {
    if(role !== "admin"){
    requestPermission();
    }
  }, []);


  return (
    <div className="flex h-screen bg-[#ffff]">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={role} // 👈 pass role to Sidebar
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} role={role} /> {/* 👈 optional role */}
        <div className="flex-1 p-4 md:p-0 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

