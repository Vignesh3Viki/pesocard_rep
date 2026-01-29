import React from "react";
import PerformanceCard from "./PerformanceCard";

const CardPerformance = ({ rates = {} }) => {
  const performanceData = [
    {
      id: 1,
      percentage: `${rates.view_rate_percentage || 0}%`,
      label: "View Rate",
      gradient: "from-[#2B7FFF] to-[#155DFC]",
    },
    {
      id: 2,
      percentage: `${rates.share_rate_percentage || 0}%`,
      label: "Share Rate",
      gradient: "from-[#22C55E] to-[#16A34A]",
    },
    {
      id: 3,
      percentage: `${rates.visit_rate_percentage || 0}%`,
      label: "Visit Rate",
      gradient: "from-[#AD46FF] to-[#9810FA]",
    },
  ];

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-start gap-2 sm:gap-3 md:gap-4">
        {performanceData.map((card) => (
          <PerformanceCard
            key={card.id}
            percentage={card.percentage}
            label={card.label}
            gradient={card.gradient}
          />
        ))}
      </div>
    </div>
  );
};

export default CardPerformance;
