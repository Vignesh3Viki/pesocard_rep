import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff, MdArrowForward } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";
import signupService from "../services/signupService";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await signupService.signup({
        email: formData.email,
        password: formData.password,
      });

      // Show success toast
      toast.success("Account created successfully!", {
        description: "Welcome! You can now access your account.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Navigate to my-card after a short delay
      setTimeout(() => {
        navigate('/my-card');
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed", {
        description: "Please check your information and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 md:py-12 px-4 sm:px-6">
      {/* Header Logo */}
      <div className="flex items-center justify-center mb-6 md:mb-8">
        <img
          src={PesocardLogo}
          alt="PESOCARD Logo"
          className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
        />
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-[390px] sm:max-w-md">
        {/* Form Content */}
        <div className="w-full flex flex-col items-center gap-10">
          <div className="w-full flex flex-col gap-6">
            {/* Title Section */}
            <div className="w-full flex flex-col items-start gap-2 sm:gap-3">
              <h2
                className="text-[#32343D] font-bold text-2xl sm:text-[28px] leading-[1.3]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Hey, Hello 👋
              </h2>
              <p
                className="text-[#32343D] text-start text-sm sm:text-base leading-[1.6]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Enter your credentials to access your account
              </p>
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
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-[#8B8C9F] text-sm sm:text-base placeholder:text-[#8B8C9F] placeholder:opacity-50 h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
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
                    className="flex-1 bg-transparent border-none outline-none text-[#8B8C9F] text-sm sm:text-base placeholder:text-[#8B8C9F] placeholder:opacity-50 h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
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
              </div>

              {/* Confirm Password Field */}
              <div className="w-full flex flex-col gap-2.5">
                <div className="w-full flex items-center gap-2.5">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-[#8B8C9F] text-sm sm:text-base placeholder:text-[#8B8C9F] placeholder:opacity-50 h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="w-6 h-6 flex items-center justify-center text-[#8B8C9F] hover:text-[#32343D] transition-colors disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </button>
                </div>
                <div className="w-full h-[0.5px] bg-[#E3E3EA]"></div>
              </div>
            </form>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-[320px] h-12 sm:h-14 bg-[#1447E6] rounded-[56px] flex items-center justify-center gap-2 sm:gap-3.5 hover:bg-[#1447E6]/90 transition-colors text-white font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {isLoading ? "Creating account..." : "Create an account"}
            {!isLoading && (
              <MdArrowForward size={20} className="text-white sm:w-6 sm:h-6" />
            )}
          </Button>

          {/* Sign In Link */}
          <p
            className="text-[#32343D] text-sm sm:text-base text-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Already have an account?{" "}
            <span 
              className="font-semibold cursor-pointer hover:underline text-[#1447E6]"
              onClick={() => navigate("/login")}
            >
              SIGN IN
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
