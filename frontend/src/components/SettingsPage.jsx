import React from "react";
import { useNavigate } from "react-router-dom";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";
import PageFooter from "@/components/PageFooter";
import SettingsMenu from "@/components/SettingsMenu";
import { toast } from "sonner";

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex justify-center w-full lg:bg-gray-50">
      <div className="flex flex-col w-full lg:max-w-[432px]">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 shadow-sm lg:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/my-card")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Back"
            >
              ←
            </button>
            <span className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900">
              Settings
            </span>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-20 lg:rounded-b-2xl">
          <div className="px-4 sm:px-6 lg:px-8 py-2">
            {/* Promo Card */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-550 to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white mb-8 sm:mb-10 lg:mb-12 mt-0 space-y-4 sm:space-y-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <img
                    src={PesocardLogo}
                    alt="PESOCARD Logo"
                    className="h-8 sm:h-10 lg:h-12 w-auto"
                  />
                  <p className="text-xs sm:text-sm lg:text-sm leading-relaxed text-blue-50">
                    Get the most out of PesoCard — everything is free, no premium needed!
                  </p>
                </div>
                <span className="text-2xl sm:text-3xl lg:text-3xl flex-shrink-0">⭐</span>
              </div>
              <button
                onClick={() => navigate("/my-card")}
                className="w-full bg-white text-blue-600 font-semibold py-2.5 sm:py-3 lg:py-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors text-sm sm:text-base lg:text-base"
              >
                learn more
              </button>
            </div>

            {/* Settings Menu Component */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm lg:shadow-md">
              <SettingsMenu onLogout={handleLogout} />
            </div>
          </div>

          <PageFooter />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
