import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, Menu, LogIn, UserPlus, LogOut, User } from "lucide-react";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Add any additional logout logic here (e.g., clearing auth state)
    console.log("User logged out");
    navigate("/signin"); // Redirect to sign-in page
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <nav className="border-b border-[#BCC8BC] sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-2.5 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-4 h-4 text-[#2f362f]" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button className="relative p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[#2f362f]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center gap-3 pl-3 border-l border-[#BCC8BC] focus:outline-none"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-[#2f362f]">
                  Waleed Shahid
                </p>
                <p className="text-xs text-[#2f362f]">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#2f362f] flex items-center justify-center text-white font-semibold shadow-lg hover:opacity-90 transition-opacity">
                W
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                {/* Profile */}
                <div className="px-2.5 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Waleed Shahid</p>
                  <p className="text-xs text-gray-500">waleed@example.com</p>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={handleSignIn}
                    className="w-full text-left px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                  
                  <button
                    onClick={handleSignUp}
                    className="w-full text-left px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
