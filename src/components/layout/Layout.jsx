import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { selectSidebarOpen, setSidebarOpen } from "../../store/slices/uiSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);

  const handleSetSidebar = (value) => {
    dispatch(setSidebarOpen(value));
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={handleSetSidebar} />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={handleSetSidebar} />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
