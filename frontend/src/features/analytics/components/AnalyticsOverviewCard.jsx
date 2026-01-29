import React from "react";

const AnalyticsOverviewCard = ({
  icon,
  iconBgColor,
  title,
  subtitle,
  percentageChange,
  trendIcon: TrendIcon,
}) => {
  // Determine color and trend direction based on percentage value
  const percentValue = parseFloat(percentageChange);
  const isPositiveTrend = percentValue >= 0;
  const trendColor = isPositiveTrend ? "#00C950" : "#EF4444";
  const textColor = isPositiveTrend ? "text-[#00C950]" : "text-[#EF4444]";

  return (
    <div className="w-full bg-white border border-[#F3F4F6] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-[17px] gap-2 flex flex-col shadow-md">
      {/* Icon Background */}
      <div
        className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon && <img src={icon} alt="icon" className="w-5 sm:w-6 h-5 sm:h-6" />}
      </div>

      {/* Title */}
      <div className="w-full">
        <p className="text-lg sm:text-2xl lg:text-[23.3px] font-poppins font-normal leading-7 sm:leading-8 text-[#101828]">
          {title}
        </p>
      </div>

      {/* Subtitle */}
      <div className="w-full">
        <p className="text-[10px] sm:text-[11.1px] lg:text-xs font-poppins font-normal leading-3 sm:leading-4 text-[#6A7282]">
          {subtitle}
        </p>
      </div>

      {/* Percentage Change */}
      <div className="w-full flex flex-row items-center gap-1">
        {TrendIcon && (
          <TrendIcon
            style={{ color: trendColor }}
            className={`w-3 h-3 ${isPositiveTrend ? "" : "transform rotate-180"}`}
          />
        )}
        <p className={`text-[9px] sm:text-xs font-poppins font-normal leading-3 sm:leading-4 ${textColor}`}>
          {percentageChange}%
        </p>
      </div>
    </div>
  );
};

export default AnalyticsOverviewCard;
