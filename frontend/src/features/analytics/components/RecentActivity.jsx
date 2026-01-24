import React from "react";
import ActivityItem from "./ActivityItem";
import EyeIcon from "@/assets/icons/eye.svg";
import PeopleIcon from "@/assets/icons/people.svg";
import ShareIcon from "@/assets/icons/share.svg";

const RecentActivity = ({ data = [], onViewAll }) => {
  // Default data if not provided
  const activityData =
    data.length > 0
      ? data
      : [
          {
            id: 1,
            icon: EyeIcon,
            iconBgColor: "#EFF6FF",
            title: "Profile View",
            subtitle: "John Smith • 2 mins ago",
          },
          {
            id: 2,
            icon: PeopleIcon,
            iconBgColor: "#FAF5FF",
            title: "Profile Visit",
            subtitle: "Mike Chen • 1 hour ago",
          },
          {
            id: 3,
            icon: ShareIcon,
            iconBgColor: "#F0FDF4",
            title: "Profile share",
            subtitle: "Michelle real • 1 hour ago",
          },
        ];

  return (
    <div className="w-full bg-white border border-[#F3F4F6] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-[21px] gap-4 flex flex-col shadow-md sm:shadow-lg">
      {/* Header */}
      <div className="w-full flex flex-row justify-between items-start">
        <div>
          <h3 className="text-[14.4px] font-poppins font-normal leading-6 text-[#101828]">
            Recent Activity
          </h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-[13.1px] font-poppins font-normal leading-5 text-[#155DFC] hover:underline"
        >
          View All
        </button>
      </div>

      {/* Activities Container */}
      <div className="w-full flex flex-col gap-3">
        {activityData.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ActivityItem
              icon={activity.icon}
              iconBgColor={activity.iconBgColor}
              title={activity.title}
              subtitle={activity.subtitle}
            />
            {index < activityData.length - 1 && (
              <div className="w-full h-px bg-gray-100"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
