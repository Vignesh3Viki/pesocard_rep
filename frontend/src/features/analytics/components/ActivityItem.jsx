import React from "react";

const ActivityItem = ({ icon, iconBgColor, title, subtitle }) => {
  return (
    <div className="w-full flex flex-row items-center p-2 sm:p-3 gap-2 sm:gap-3 rounded-lg sm:rounded-2xl hover:bg-gray-50 transition-colors">
      {/* Icon Background */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center`}
        style={{ backgroundColor: iconBgColor }}
      >
        <img src={icon} alt={title} className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-0">
        <div className="w-full">
          <p className="text-[13px] font-poppins font-normal leading-5 text-[#101828]">
            {title}
          </p>
        </div>
        <div className="w-full">
          <p className="text-[10.7px] font-poppins font-normal leading-4 text-[#6A7282]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Trailing Icon */}
    </div>
  );
};

export default ActivityItem;
