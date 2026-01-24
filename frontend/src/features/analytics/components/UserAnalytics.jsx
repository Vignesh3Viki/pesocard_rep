import React, { useState } from "react";
import FilterButton from "./FilterButton";
import AnalyticsOverviewCard from "./AnalyticsOverviewCard";
import WeeklyActivity from "./WeeklyActivity";
import CardPerformance from "../components/CardPerformance";
import TopLocations from "./TopLocations";
import RecentActivity from "./RecentActivity";
import TodayVsYesterday from "./TodayVsYesterday";
import { TrendingUp } from "lucide-react";

import EyeIcon from "@/assets/icons/eye.svg";
import PeopleIcon from "@/assets/icons/people.svg";
import ShareIcon from "@/assets/icons/share.svg";

const UserAnalytics = ({ data = {} }) => {
  const [activeFilter, setActiveFilter] = useState("today");

  const filterOptions = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
  ];

  // Extract data from API response
  const rates = data?.rates || {
    save_rate_percentage: 0,
    share_rate_percentage: 0,
    visit_rate_percentage: 0,
  };
  const weeklyActivityData = data?.weekly_activity || [];

  // Get filtered data based on active filter
  const getFilteredData = () => {
    switch (activeFilter) {
      case "week":
        return data?.this_week || { views: 0, shares: 0, visits: 0 };
      case "month":
        return data?.this_month || { views: 0, shares: 0, visits: 0 };
      case "today":
      default:
        return data?.today || { views: 0, shares: 0, visits: 0 };
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar px-3 sm:px-4 md:px-6">
      
      {/* Filter Buttons */}
      <div className="flex gap-2 sm:gap-3 py-3 sm:py-4 md:py-6 justify-start flex-wrap">
        {filterOptions.map((option) => (
          <FilterButton
            key={option.id}
            label={option.label}
            isActive={activeFilter === option.id}
            onClick={() => setActiveFilter(option.id)}
          />
        ))}
      </div>

      {/* Analytics Overview Cards */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4">
        <AnalyticsOverviewCard
          icon={EyeIcon}
          title={filteredData.views.toLocaleString()}
          subtitle="Profile Views"
          percentageChange={`${rates.save_rate_percentage || 0}%`}
          trendIcon={TrendingUp}
          iconBgColor="#EFF6FF"
        />

        <AnalyticsOverviewCard
          icon={PeopleIcon}
          title={filteredData.visits.toLocaleString()}
          subtitle="Profile Visits"
          percentageChange={`${rates.visit_rate_percentage || 0}%`}
          trendIcon={TrendingUp}
          iconBgColor="#FAF5FF"
        />

        <AnalyticsOverviewCard
          icon={ShareIcon}
          title={filteredData.shares.toLocaleString()}
          subtitle="Card Shares"
          percentageChange={`${rates.share_rate_percentage || 0}%`}
          trendIcon={TrendingUp}
          iconBgColor="#F0FDF4"
        />
      </div>

      {/* Weekly Activity */}
      <div className="mt-4 sm:mt-6">
        <WeeklyActivity data={weeklyActivityData} />
      </div>

      {/* Card Performance */}
      <div className="mt-4 sm:mt-6">
        <CardPerformance rates={rates} />
      </div>

      {/* Top Locations */}
      <div className="mt-4 sm:mt-6">
        <TopLocations data={data?.country_users || []} />
      </div>

      {/* Recent Activity */}
      <div className="mt-4 sm:mt-6">
        <RecentActivity />
      </div>

      {/* Today vs Yesterday */}
      <div className="mt-4 sm:mt-6 pb-6">
        <TodayVsYesterday data={data?.today_vs_yesterday} />
      </div>
{/* Code to fix scroll */}
      <div className="h-32"></div>
    </div>
  );
};

export default UserAnalytics;
