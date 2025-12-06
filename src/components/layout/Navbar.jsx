import React from "react";
import { Search, Bell, Settings, Menu } from "lucide-react";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <nav className="border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          

          <button className="relative p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-slate-600" />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-slate-700">Waleed Shahid</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
              W
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
