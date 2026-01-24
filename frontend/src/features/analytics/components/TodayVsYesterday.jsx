import React from "react";
import StatItem from "./StatItem";

const TodayVsYesterday = ({ data = {} }) => {
  // Transform API data to stats format
  const transformData = () => {
    if (!data || Object.keys(data).length === 0) {
      return [
        { id: 1, value: 0, label: "Views", diff: 0 },
        { id: 2, value: 0, label: "Shares", diff: 0 },
        { id: 3, value: 0, label: "Visits", diff: 0 },
      ];
    }

    return [
      {
        id: 1,
        value: data.views_diff || 0,
        label: "Views",
        diff: data.views_diff || 0,
      },
      {
        id: 2,
        value: data.shares_diff || 0,
        label: "Shares",
        diff: data.shares_diff || 0,
      },
      {
        id: 3,
        value: data.visits_diff || 0,
        label: "Visits",
        diff: data.visits_diff || 0,
      },
    ];
  };

  const statsData = transformData();

  return (
    <div className="w-full bg-gradient-to-br from-[#00BC7D] to-[#009966] rounded-2xl sm:rounded-3xl p-4 sm:p-5 gap-3 sm:gap-4 flex flex-col shadow-md sm:shadow-lg justify-center items-center">
      {/* Heading */}
      <div className="w-full">
        <h3 className="text-white font-poppins font-normal text-[13px] sm:text-[15.9px] leading-5 sm:leading-7">
          Today vs Yesterday
        </h3>
      </div>

      {/* Stats Container */}
      <div className="w-full flex flex-row justify-between items-start gap-2 sm:gap-4 px-2 sm:px-4">
        {statsData.map((stat) => (
          <StatItem
            key={stat.id}
            value={stat.value}
            label={stat.label}
            trend={stat.diff > 0 ? "up" : stat.diff < 0 ? "down" : "flat"}
          />
        ))}
      </div>
    </div>
  );
};

export default TodayVsYesterday;
