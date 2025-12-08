import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { selectSidebarOpen, setSidebarOpen } from "../../store/slices/uiSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      dispatch(setSidebarOpen(isDesktop));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const handleSetSidebar = (value) => {
    dispatch(setSidebarOpen(value));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => handleSetSidebar(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} setIsOpen={handleSetSidebar} />

      {/* Main content area - with proper margin for sidebar */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={handleSetSidebar} />
        <main className="flex-1 p-2 sm:p-4 lg:p-6 max-w-[2000px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

