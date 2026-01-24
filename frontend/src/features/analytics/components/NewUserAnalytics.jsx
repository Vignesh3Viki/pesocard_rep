import React from "react";
import Analytics from "@/assets/images/analytics.svg";
import AnalyticsCard from "./AnalyticsCard";
import EyeIcon from "@/assets/icons/eye.svg";
import PeopleIcon from "@/assets/icons/people.svg";
import ShareIcon from "@/assets/icons/share.svg";
import PulseIcon from "@/assets/icons/pulse.svg";

const NewUserAnalytics = () => {
  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      {/* Analytics Image */}
      <div className="flex items-start justify-center p-4 sm:p-6">
        <img
          src={Analytics}
          alt="Analytics Illustration"
          className="max-w-full h-auto"
        />
      </div>
      {/* Analytics Cards */}
      <div className="px-3 sm:px-6 pb-6 space-y-3 sm:space-y-4">
        <AnalyticsCard
          icon={EyeIcon}
          label="Profile Views"
          count="0"
          iconBgColor="bg-blue-50"
        />

        <AnalyticsCard
          icon={PeopleIcon}
          label="Profile Likes"
          count="0"
          iconBgColor="bg-purple-50"
        />

        <AnalyticsCard
          icon={ShareIcon}
          label="Unique Visitors"
          count="0"
          iconBgColor="bg-green-50"
        />
      </div>

      {/* Share Profile Button */}
      <div className="px-3 sm:px-6 pb-6 flex flex-col items-center justify-center gap-3 sm:gap-4">
        <button className="flex flex-row justify-center items-center px-6 sm:px-8 py-3 sm:py-4 gap-2 w-full sm:w-[330px] h-12 sm:h-14 bg-[#1447E6] rounded-full sm:rounded-[56px] font-poppins font-normal text-[13px] sm:text-[14.8px] leading-5 sm:leading-6 text-white hover:bg-[#0f3bc4] transition-colors duration-200 active:scale-95 transform">
          <img
            src={PulseIcon}
            alt="Pulse"
            className="w-5 h-5 flex-none"
            style={{
              filter: "brightness(0) saturate(100%) invert(100%)",
            }}
          />
          <span className="flex-none">Share Your Profile</span>
        </button>
        <p
          className="text-gray-400 text-[11px] sm:text-xs"
          style={{
            fontFamily: "Poppins",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "16px",
            letterSpacing: "0%",
          }}
        >
          💡 Tip: Share your profile link to start tracking analytics
        </p>
      </div>

      <div className="h-32"></div>
    </div>
  );
};

export default NewUserAnalytics;
