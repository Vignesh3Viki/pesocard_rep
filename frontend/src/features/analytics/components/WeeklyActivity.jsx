import React from "react";

const WeeklyActivity = ({ data = [] }) => {
  // Map day numbers (0-6) to day names
  const dayMap = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  // Transform API data to chart format
  const transformData = () => {
    // Initialize all 7 days with 0 values
    const weekData = {
      0: { day: "Sun", value: 0 },
      1: { day: "Mon", value: 0 },
      2: { day: "Tue", value: 0 },
      3: { day: "Wed", value: 0 },
      4: { day: "Thu", value: 0 },
      5: { day: "Fri", value: 0 },
      6: { day: "Sat", value: 0 },
    };

    // Fill in data from API
    if (data && data.length > 0) {
      data.forEach((item) => {
        const dayNum = parseInt(item.day);
        weekData[dayNum].value = item.count || 0;
      });
    }

    // Convert to array in correct order (Sun to Sat)
    const dataArray = Object.values(weekData);

    // Find max value for percentage calculation
    const maxValue = Math.max(...dataArray.map((item) => item.value || 0));

    return dataArray.map((item) => ({
      day: item.day,
      value: item.value || 0,
      percentage: maxValue > 0 ? (item.value / maxValue) * 100 : 0,
      isMax: item.value === maxValue && maxValue > 0,
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
