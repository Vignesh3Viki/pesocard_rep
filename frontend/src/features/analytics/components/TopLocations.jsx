import React from "react";
import LocationItem from "./LocationItem";

const TopLocations = ({ data = [] }) => {
  // Transform country_users data to location format and sort by users descending
  const transformData = () => {
    if (!data || data.length === 0) {
      return [];
    }

    return data
      .map((item) => ({
        id: item.country,
        location: item.country,
        value: item.users,
      }))
      .sort((a, b) => b.value - a.value);
  };

  const locationData = transformData();

  // Calculate max value for percentage calculation
  const maxValue =
    locationData.length > 0 ? Math.max(...locationData.map((item) => item.value)) : 1;

  return (
    <div className="w-full bg-white border border-[#F3F4F6] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-[21px] gap-4 flex flex-col shadow-md sm:shadow-lg">
      {/* Heading */}
      <div className="w-full">
        <h3 className="text-[14.3px] font-poppins font-normal leading-6 text-[#101828]">
          Top Locations
        </h3>
      </div>

      {/* Locations Container with scroll if more than 4 items */}
      <div
        className={`w-full flex flex-col gap-3 ${
          locationData.length > 4 ? "max-h-72 overflow-y-auto hide-scrollbar" : ""
        }`}
      >
        {locationData.length > 0 ? (
          locationData.map((item) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <LocationItem
                key={item.id}
                location={item.location}
                value={item.value}
                percentage={percentage}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">
            No location data available
          </p>
        )}
      </div>
    </div>
  );
};

export default TopLocations;
