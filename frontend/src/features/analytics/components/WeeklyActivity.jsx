import React from "react";

const WeeklyActivity = ({ data = [] }) => {
  // Transform API data to chart format
  const transformData = () => {
    if (data.length === 0) {
      return [
        { day: "Mon", value: 0, percentage: 0 },
        { day: "Tue", value: 0, percentage: 0 },
        { day: "Wed", value: 0, percentage: 0 },
        { day: "Thu", value: 0, percentage: 0 },
        { day: "Fri", value: 0, percentage: 0 },
        { day: "Sat", value: 0, percentage: 0 },
        { day: "Sun", value: 0, percentage: 0 },
      ];
    }

    // Find max value for percentage calculation
    const maxValue = Math.max(...data.map((item) => item.views || 0));
    
    return data.map((item) => ({
      day: item.day,
      value: item.views || 0,
      percentage: maxValue > 0 ? (item.views / maxValue) * 100 : 0,
      isMax: item.views === maxValue && maxValue > 0,
    }));
  };

  const activityData = transformData();

  return (
    <div className="w-full bg-white border border-[#F3F4F6] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-[21px] gap-4 flex flex-col shadow-md sm:shadow-lg">
      {/* Heading */}
      <div className="w-full">
        <h3 className="text-[14.4px] font-poppins font-normal leading-6 text-[#101828]">
          Weekly Activity
        </h3>
      </div>

      {/* Activity Container */}
      <div className="w-full flex flex-col gap-2">
        {activityData.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-row items-center gap-3 h-8"
          >
            {/* Day Label */}
            <div className="w-8">
              <p className="text-[10.9px] font-poppins font-normal leading-4 text-[#6A7282]">
                {item.day}
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="flex-1 flex items-center relative h-8">
              <div
                className="bg-gradient-to-r from-[#2B7FFF] to-[#51A2FF] rounded-full h-8 flex items-center justify-end pr-2 relative"
                style={{ width: `${item.percentage}%` }}
              >
                {/* Badge for maximum value */}
                {item.isMax && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-[#2B7FFF] rounded-full px-2 py-1 shadow-lg flex items-center justify-center">
                    <p className="text-[11.1px] font-poppins font-normal leading-4 text-white">
                      {item.value}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Value Label */}
            <div className="w-10 text-right">
              <p className="text-[12.5px] font-poppins font-normal leading-5 text-[#101828]">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyActivity;
