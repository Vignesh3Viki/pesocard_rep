import React, { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import PageFooter from "@/components/PageFooter";
import SettingsPage from "@/components/SettingsPage";
import UserAnalytics from "../components/UserAnalytics";
import NewUserAnalytics from "../components/NewUserAnalytics";
import analyticsService from "../services/analyticsService";
import { toast } from "sonner";

const AnalyticsPage = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsService.getProfileAnalytics();

        // Check if user has any activity
        const hasActivity =
          data?.profile_views > 0 ||
          data?.profile_visits > 0 ||
          data?.today?.views > 0 ||
          data?.today?.shares > 0 ||
          data?.today?.visits > 0;

        setAnalyticsData(data);
        setIsNewUser(!hasActivity);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to load analytics");
        setIsNewUser(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <>
      {showSettings ? (
        <SettingsPage onBack={() => setShowSettings(false)} />
      ) : (
        <div
          className={`min-h-screen bg-gray-50 flex justify-center w-full ${isNewUser ? "bg-white" : ""}`}
        >
          <div className="flex flex-col w-full lg:max-w-[432px] h-screen lg:rounded-2xl lg:shadow-lg">
            {/* Analytics Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 bg-[#FFFFFF] sticky top-0 z-10 border-b border-[#F3F4F6]">
              <div className="flex items-start justify-between">
                <div>
                  <h1
                    className="text-gray-900 mb-1 text-base sm:text-lg"
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    Analytics
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Track your performance
                  </p>
                </div>

                <div className="flex items-center justify-center w-9 h-9">
                  <button
                    onClick={handleSettingsClick}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    title="Analytics Settings"
                  >
                    <Settings className="w-5 h-5 text-gray-600 hover:text-gray-900" />
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Loading analytics...</p>
              </div>
            ) : isNewUser ? (
              <NewUserAnalytics />
            ) : (
              <UserAnalytics data={analyticsData} />
            )}

            {/* Footer */}
            <PageFooter />
          </div>
        </div>
      )}
    </>
  );
};

export default AnalyticsPage;
