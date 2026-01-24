import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatItem = ({ value, label, trend = "up" }) => {
  const getTrendIcon = () => {
    if (trend === "up") {
      return <TrendingUp className="w-3 h-3 text-white" />;
    } else if (trend === "down") {
      return <TrendingDown className="w-3 h-3 text-white" />;
    } else {
      return <Minus className="w-3 h-3 text-white" />;
    }
  };

  const getFormattedValue = () => {
    if (value > 0) {
      return `+${value}`;
    } else if (value < 0) {
      return `${value}`;
    } else {
      return `${value}`;
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Value */}
      <div>
        <p className="text-white font-poppins font-normal text-lg sm:text-2xl leading-6 sm:leading-8">
          {getFormattedValue()}
        </p>
      </div>

      {/* Label */}
      <div className="opacity-90">
        <p className="text-white font-poppins font-normal text-[9px] sm:text-[10.9px] leading-3 sm:leading-4">
          {label}
        </p>
      </div>

      {/* Trend Icon */}
      <div className="flex flex-row items-center gap-1 pt-1">
        {getTrendIcon()}
      </div>
    </div>
  );
};

export default StatItem;
