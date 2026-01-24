import React from "react";

const EngagementOverviewMockup = () => {
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl w-full max-w-sm md:max-w-lg mx-auto border border-cyan-100">
      <div className="flex justify-between items-center mb-6 md:mb-8 gap-3">
        <h3 className="font-bold text-slate-900 text-base md:text-lg">
          Engagement Overview
        </h3>
        <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
          Last 30 Days
        </span>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Row 1 */}
        <div className="flex justify-between items-center pb-4 md:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            </div>
            <span className="text-slate-600 font-medium text-xs md:text-sm">
              Card Views
            </span>
          </div>
          <span className="font-bold text-slate-900 text-sm md:text-base">1,747</span>
        </div>

        {/* Row 2 */}
        <div className="flex justify-between items-center pb-4 md:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            </div>
            <span className="text-slate-600 font-medium text-xs md:text-sm">
              Contact Saves
            </span>
          </div>
          <span className="font-bold text-slate-900 text-sm md:text-base">89</span>
        </div>

        {/* Row 3 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
            <span className="text-slate-600 font-medium text-xs md:text-sm">
              Link Clicks
            </span>
          </div>
          <span className="font-bold text-slate-900 text-sm md:text-base">156</span>
        </div>
      </div>
    </div>
  );
};

export default EngagementOverviewMockup;
