import React from "react";

const AnalyticsCard = ({ icon, label, count, iconBgColor = "bg-blue-100" }) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-4 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Icon Container */}
        <div
          className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-2xl ${iconBgColor} flex items-center justify-center flex-none`}
        >
          {<img src={icon} alt={`${label} Icon`} className="w-5 sm:w-6 h-5 sm:h-6" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="text-gray-400 mb-1 text-xs sm:text-sm"
            style={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "0%",
            }}
          >
            {label}
          </p>
          {/* Progress Bar Container */}
          <div className="flex flex-row items-center gap-2">
            <div className="flex-1 min-w-0 h-2 bg-gray-100 rounded-full"></div>
            <p
              className="text-gray-400 text-[10px] sm:text-xs flex-none"
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "16px",
                letterSpacing: "0%",
              }}
            >
              {count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;