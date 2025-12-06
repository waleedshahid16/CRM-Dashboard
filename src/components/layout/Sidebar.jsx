import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  Settings,
  FileText,
  BarChart3,
  Building2,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Handshake,
  CheckSquare,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: Building2, label: "Companies", path: "/companies" },
    { icon: Handshake, label: "Deals", path: "/deals" },
    { icon: CheckSquare, label: "Tasks", path: "/tasks" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const bottomMenuItems = [
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#2f362f] border-r border-[#2f362f] transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "w-0 lg:w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#2f362f]">
            {isOpen && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br bg-white rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-white">ClientHub</span>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5 text-white" />
              ) : (
                <ChevronRight className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Main Menu */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#788978] text-white"
                        : "text-white hover:bg-[#788978]"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {isOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Bottom Menu */}
          <div className="border-t border-[#2f362f] px-3 py-4">
            <div className="space-y-1">
              {bottomMenuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#788978] text-white"
                        : "text-white hover:bg-[#788978]"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {isOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
