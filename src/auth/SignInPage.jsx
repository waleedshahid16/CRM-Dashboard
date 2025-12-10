import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, Lock, Eye, EyeOff, Users } from "lucide-react";

// Validation Schema for Sign In
const signInSchema = yup
  .object({
    email: yup
      .string()
      .required("Email is required")
      .email("Enter a valid email address"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Sign In Data:", data);
      alert("Signed in successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleSignIn = () => {
    alert("Google Sign In clicked!");
  };

  const goToRegister = () => {
    alert("Navigate to Register");
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Background Image for Mobile/Tablet - Behind Form */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="w-full max-w-md bg-[#f8faf9] lg:bg-transparent rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none p-6 sm:p-8 lg:p-0">
          {/* Logo/Brand */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2f362f] rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[#2f362f]">
                ClientHub
              </span>
            </div>
            <p className="text-[#2f362f]/80 text-xs sm:text-sm ml-0.5 sm:ml-1">
              Your Business Growth Partner
            </p>
          </div>

          {/* Welcome Text */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f362f] mb-1 sm:mb-2">
              WELCOME BACK
            </h1>
            <p className="text-sm sm:text-base text-[#2f362f]/80">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-2.5 sm:space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#2f362f]" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#788978] focus:border-transparent transition-all ${
                    errors.email ? "border-red-500" : "border-[#BCC8BC]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] sm:text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#2f362f]" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••••"
                  className={`w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#788978] focus:border-transparent transition-all ${
                    errors.password ? "border-red-500" : "border-[#BCC8BC]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2f362f] hover:text-[#788978]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] sm:text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#BCC8BC] rounded focus:ring-2 focus:ring-[#788978] text-[#2f362f]"
                />
                <span className="text-xs sm:text-sm text-[#2f362f]">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-xs sm:text-sm font-semibold text-[#2f362f] hover:text-[#788978] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full bg-[#2f362f] text-white py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#BCC8BC]"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-[#f8faf9] text-[#2f362f]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-[#BCC8BC] rounded-md font-semibold text-[#2f362f] hover:bg-[#FEFDFC] transition-all"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-[#2f362f]">
            Don't have an account?{" "}
            <button
              onClick={goToRegister}
              className="font-bold text-[#2f362f] hover:text-[#788978] transition-colors"
            >
              Sign up for free!
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2f362f]">
        <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400"></div>
      </div>
    </div>
  );
};

export default SignInPage;
