import React from "react";

const PerformanceCard = ({ percentage, label, gradient }) => {
  return (
    <div
      className={`flex-1 min-w-[100px] sm:min-w-[115px] h-20 sm:h-24 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col items-start gap-1 bg-gradient-to-br ${gradient}`}
    >
      {/* Percentage Value */}
      <div className="w-full flex-1 flex items-center justify-center">
        <p className="text-white font-poppins font-normal text-2xl sm:text-[30px] leading-8 sm:leading-9 text-center">
          {percentage}
        </p>
      </div>

      {/* Label */}
      <div className="w-full h-4 flex items-center justify-center opacity-90">
        <p className="text-white font-poppins font-normal text-[9px] sm:text-[10.9px] leading-3 sm:leading-4 text-center">
          {label}
        </p>
      </div>
    </div>
  );
};

export default PerformanceCard;
