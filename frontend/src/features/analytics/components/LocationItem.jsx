import React from "react";

const LocationItem = ({ location, value, percentage }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Location Header */}
      <div className="w-full flex flex-row justify-between items-center">
        <div>
          <p className="text-[11px] sm:text-[12.8px] font-poppins font-normal leading-4 sm:leading-5 text-[#364153]">
            {location}
          </p>
        </div>
        <div>
          <p className="text-[12px] sm:text-[14px] font-poppins font-normal leading-4 sm:leading-5 text-[#101828]">
            {value}
          </p>
        </div>
      </div>

      {/* Progress Bar Background */}
      <div className="w-full h-2 bg-[#F3F4F6] rounded-full relative overflow-hidden">
        {/* Progress Bar Gradient */}
        <div
          className="h-full bg-gradient-to-r from-[#2B7FFF] to-[#AD46FF] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LocationItem;
