import React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
const AccountIcon = require("@/assets/icons/account.svg").default || require("@/assets/icons/account.svg");
const FaqIcon = require("@/assets/icons/faq.svg").default || require("@/assets/icons/faq.svg");
const FeedbackIcon = require("@/assets/icons/feedback.svg").default || require("@/assets/icons/feedback.svg");
const AboutIcon = require("@/assets/icons/about.svg").default || require("@/assets/icons/about.svg");

const SettingsMenu = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const menuItemClass = "w-full flex items-center justify-between px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6 hover:bg-gray-50 lg:hover:bg-blue-50 transition-colors rounded-lg lg:rounded-xl";
  const sectionTitleClass = "text-xs sm:text-sm lg:text-base font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4 lg:mb-5 pl-4 sm:pl-5 lg:pl-6";
  const textClass = "text-sm sm:text-base lg:text-lg text-gray-900 font-medium";

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Account Section */}
      <div>
        <h3 className={sectionTitleClass}>ACCOUNT</h3>
        <button
          onClick={() => handleNavigate("/edit-profile")}
          className={menuItemClass}
        >
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1">
            <img src={AccountIcon} alt="Account" className="w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12" />
            <span className={textClass}>Account</span>
          </div>
          <MdArrowForward className="w-5 sm:w-6 lg:w-6 h-5 sm:h-6 lg:h-6 text-gray-400 flex-shrink-0" />
        </button>
      </div>

      {/* Support Section */}
      <div>
        <h3 className={sectionTitleClass}>SUPPORT</h3>
        <div className="space-y-2 sm:space-y-3 lg:space-y-0">
          <button
            onClick={() => window.open("https://pesocard.com/faq", "_blank")}
            className={menuItemClass}
          >
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1">
              <img src={FaqIcon} alt="FAQ" className="w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12" />
              <span className={textClass}>Frequently Asked Questions</span>
            </div>
            <MdArrowForward className="w-5 sm:w-6 lg:w-6 h-5 sm:h-6 lg:h-6 text-gray-400 flex-shrink-0" />
          </button>
          <button
            onClick={() => toast.info("Feedback form would open here")}
            className={menuItemClass}
          >
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1">
              <img src={FeedbackIcon} alt="Feedback" className="w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12" />
              <span className={textClass}>Send Feedback</span>
            </div>
            <MdArrowForward className="w-5 sm:w-6 lg:w-6 h-5 sm:h-6 lg:h-6 text-gray-400 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* About Section */}
      <div>
        <h3 className={sectionTitleClass}>ABOUT</h3>
        <button
          onClick={() => window.open("https://pesocard.com/about", "_blank")}
          className={menuItemClass}
        >
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1">
            <img src={AboutIcon} alt="About" className="w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12" />
            <span className={textClass}>About pesocard</span>
          </div>
          <MdArrowForward className="w-5 sm:w-6 lg:w-6 h-5 sm:h-6 lg:h-6 text-gray-400 flex-shrink-0" />
        </button>
      </div>

      {/* Social Media Section */}
      <div className="pt-6 sm:pt-8 lg:pt-10 border-t border-gray-200">
        <p className="text-center text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 lg:mb-8 font-medium">
          Follow us @pesocard
        </p>
        <div className="flex items-center justify-center gap-4 sm:gap-5 lg:gap-6">
          <button
            onClick={() =>
              window.open("https://facebook.com/pesocard", "_blank")
            }
            className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-blue-50 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors hover:scale-110 transform duration-200"
            title="Facebook"
          >
            <FaFacebook className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-blue-600" />
          </button>
          <button
            onClick={() =>
              window.open("https://twitter.com/pesocard", "_blank")
            }
            className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors hover:scale-110 transform duration-200"
            title="Twitter/X"
          >
            <FaXTwitter className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-6 sm:pt-8 lg:pt-10 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-red-50 text-red-600 font-semibold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl lg:rounded-2xl hover:bg-red-100 transition-colors active:scale-95 transform duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsMenu;
