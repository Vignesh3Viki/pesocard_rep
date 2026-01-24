import React from "react";

const NfcProfileMockup = () => {
  return (
    <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-xs md:max-w-md lg:max-w-none mx-auto lg:mx-0 border border-indigo-100">
      {/* Background card shape */}
      {/* <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-3xl"></div> */}

      <div className="relative space-y-3 md:space-y-4">
        {/* Item 1 */}
        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4">
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-lg bg-indigo-100 shrink-0"></div>
          <div className="space-y-1.5 md:space-y-2 w-full">
            <div className="h-2 md:h-2.5 bg-slate-100 rounded w-1/3"></div>
            <div className="h-1.5 md:h-2 bg-slate-50 rounded w-1/2"></div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4">
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-lg bg-cyan-100 shrink-0"></div>
          <div className="space-y-1.5 md:space-y-2 w-full">
            <div className="h-2 md:h-2.5 bg-slate-100 rounded w-1/3"></div>
            <div className="h-1.5 md:h-2 bg-slate-50 rounded w-1/2"></div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4">
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-lg bg-purple-100 shrink-0"></div>
          <div className="space-y-1.5 md:space-y-2 w-full">
            <div className="h-2 md:h-2.5 bg-slate-100 rounded w-1/3"></div>
            <div className="h-1.5 md:h-2 bg-slate-50 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfcProfileMockup;
