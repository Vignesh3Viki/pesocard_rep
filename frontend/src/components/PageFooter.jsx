import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Users } from "lucide-react";

const PageFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
   <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white px-4 py-3 flex justify-center max-w-[430px] w-full rounded-t-2xl">

      <div className="flex justify-around w-full md:max-w-[430px] border-t border-gray-200 pt-4">
        <button
          onClick={() => navigate("/my-card")}
          className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
            isActive("/my-card") || isActive("/card")
              ? "text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h18v6H3V3zm0 8h18v6H3v-6zm0 8h18v2H3v-2z" />
          </svg>
          <span className="text-xs">Card</span>
        </button>

        <button
          onClick={() => navigate("/contacts")}
          className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
            isActive("/contacts") || isActive("/add-contact")
              ? "text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs">Contacts</span>
        </button>

        <button
          onClick={() => navigate("/analytics")}
          className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
            isActive("/analytics") || isActive("/analytics/tracking")
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h2v8H3v-8zm4-8h2v16H7V5zm4-2h2v18h-2V3zm4 4h2v14h-2V7zm4-2h2v16h-2V5z" />
          </svg>
          <span className="text-xs">Analytics</span>
        </button>
      </div>
    </div>
  );
};

export default PageFooter;
