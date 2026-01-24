import React from "react";
import { Button } from "../../../components/ui/button";

const FilterButton = ({ label, isActive, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className={`
        px-3 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-9 rounded-full font-poppins font-normal text-xs sm:text-sm
        transition-all duration-200 flex items-center justify-center
        ${
          isActive
            ? "bg-[#101828] text-white border-0 hover:bg-[#101828]"
            : "bg-white text-[#4A5565] border border-[#E5E7EB] hover:text-blue-600 hover:border-blue-600"
        }
      `}
      variant={isActive ? "default" : "outline"}
    >
      {label}
    </Button>
  );
};

export default FilterButton;
