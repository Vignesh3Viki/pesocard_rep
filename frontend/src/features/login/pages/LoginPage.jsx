import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff, MdArrowForward } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import authService from "@/services/authService";
import loginIllustration from "@/assets/images/login-illustration.svg";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Show success toast
      toast.success("Logged in successfully!", {
        description: "Welcome back!",
        duration: 5000,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
      });

      // Navigate to my-card after a short delay
      setTimeout(() => {
        navigate("/my-card");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Logo */}
      <div className="flex items-center justify-center mb-6 md:mb-8">
        <img
          src={PesocardLogo}
          alt="PESOCARD Logo"
          className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
        />
      </div>

      {/* Main Form Container - landscape for desktop */}
      <div className="w-full max-w-[390px] sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col lg:flex-row gap-8 md:gap-10 items-center justify-center">
        {/* Illustration - left on desktop, top on mobile */}
        <div className="flex-1 flex justify-center items-center mb-4 sm:mb-6 lg:mb-0">
          <img
            src={loginIllustration}
            alt="login illustration"
            className="w-full max-w-[350px] md:max-w-[400px] lg:max-w-[450px] h-auto"
          />
        </div>

        {/* Form Content - right on desktop, below on mobile */}
        <div className="flex-1 w-full flex flex-col items-center gap-10">
          <div className="w-full flex flex-col gap-6">
            {/* Title Section */}
            <div className="w-full flex flex-col items-center gap-2 sm:gap-3">
              <h2 className="text-[#32343D] font-bold text-2xl sm:text-[28px] md:text-3xl leading-[1.3] text-center font-inter">
                Connect With Us!
              </h2>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-6 sm:gap-[30px]"
            >
              {/* Email Field */}
              <div className="w-full flex flex-col gap-2.5">
                <div className="w-full flex items-center gap-2.5">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-[#8B8C9F] text-sm sm:text-base md:text-lg placeholder:text-[#8B8C9F] placeholder:opacity-50 h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-inter"
                  />
                </div>
                <div className="w-full h-[0.5px] bg-[#E3E3EA]"></div>
              </div>

              {/* Password Field */}
              <div className="w-full flex flex-col gap-2.5">
                <div className="w-full flex items-center gap-2.5">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-[#8B8C9F] text-sm sm:text-base md:text-lg placeholder:text-[#8B8C9F] placeholder:opacity-50 h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-inter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="w-6 h-6 flex items-center justify-center text-[#8B8C9F] hover:text-[#32343D] transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </button>
                </div>
                <div className="w-full h-[0.5px] bg-[#E3E3EA]"></div>
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Forgot password feature coming soon");
                  }}
                  className="text-right text-[12px] sm:text-[14px] md:text-base text-[#6078F8] hover:underline transition-colors"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-[320px] md:w-[350px] h-12 sm:h-14 md:h-16 bg-[#1447E6] rounded-[56px] flex items-center justify-center gap-2 sm:gap-3.5 hover:bg-[#1447E6]/90 transition-colors text-white font-bold text-sm sm:text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed font-inter"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            {!isLoading && (
              <MdArrowForward size={24} className="text-white sm:w-6 sm:h-6" />
            )}
          </Button>

          {/* Sign Up Link */}
          <p
            className="text-[#32343D] text-sm sm:text-base md:text-lg text-center font-inter"
          >
            Don't have an account?{" "}
            <span
              className="font-semibold cursor-pointer hover:underline text-[#1447E6]"
              onClick={() => navigate("/signup")}
            >
              SIGN UP
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
