import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";

const PageHeader = ({
  title,
  subtitle = "Track your performance",
  showBackButton = true,
  showSettings = true,
  onSettingsClick = null,
  icon: Icon = null,
  badgeCount = null,
  logo = null,
}) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:py-4 flex items-center justify-between z-40">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        )}
        {logo ? (
          <img
            src={logo}
            alt="Logo"
            className="h-6 sm:h-8 md:h-10 w-auto"
          />
        ) : (
          <div>
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5 text-gray-800" />}
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              {badgeCount !== null && (
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {badgeCount}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>

      {showSettings && (
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
        >
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default PageHeader;
