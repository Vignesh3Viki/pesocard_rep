import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useShareToken } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import { MdLocationOn, MdDownload } from "react-icons/md";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";
import { ContactIcons } from "@/components/ContactIcons";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageUtils";
import axios from "axios";
import { API_URL } from "../../../config";

const PublicCardView = () => {
  const { id: generatedToken } = useParams();
  const hasTrackedView = useRef(false);
  const countryNameRef = useRef(null);

  // Get or create visitor ID (persists across sessions)
  const getVisitorId = () => {
    let visitorId = localStorage.getItem("pesocard_visitor_id");
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem("pesocard_visitor_id", visitorId);
    }
    return visitorId;
  };

  // Get visiting source from referrer
  const getVisitingSource = () => {
    const referrer = document.referrer;
    if (!referrer) return "direct";

    try {
      const url = new URL(referrer);
      const hostname = url.hostname.toLowerCase();

      if (hostname.includes("linkedin")) return "linkedin";
      if (hostname.includes("facebook")) return "facebook";
      if (hostname.includes("instagram")) return "instagram";
      if (hostname.includes("twitter") || hostname.includes("x.com"))
        return "twitter";
      if (hostname.includes("website") || hostname.includes("pesocard"))
        return "website";

      return "other";
    } catch {
      return "direct";
    }
  };

  // Track social/website link click
  const trackLinkClick = async (source) => {
    if (!generatedToken) return;

    try {
      const visitorId = getVisitorId();

      await axios.post(
        `${API_URL}/analytics/profile-visit`,
        {
          visitor_id: visitorId,
          visiting_source: source,
        },
        {
          headers: {
            Authorization: `Bearer ${generatedToken}`,
          },
        },
      );

      console.log("Link click tracked:", visitorId, "Source:", source);
    } catch (err) {
      console.error(
        "Link click tracking failed",
        err?.response?.data || err.message,
      );
    }
  };

  // Track view function
  const trackView = async () => {
    if (!generatedToken) return;

    try {
      const visitorId = getVisitorId();
      let countryName = "Unknown";

      try {
        const response = await axios.get("https://ipapi.co/json/", {
          timeout: 5000,
        });
        countryName = response.data?.country_name || "Unknown";
      } catch (err) {
        console.error("Failed to fetch country from IP:", err);
      }

      await axios.post(
        `${API_URL}/analytics/view`,
        {
          visitor_id: visitorId,
          country_name: countryName,
        },
        {
          headers: {
            Authorization: `Bearer ${generatedToken}`,
          },
        },
      );

      console.log("View tracked:", visitorId, "Country:", countryName);
    } catch (err) {
      console.error("View tracking failed", err?.response?.data || err.message);
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState({
    first_name: "",
    second_name: "",
    job_position: "",
    company: "",
    bio: "",
    address: "",
    phone: "",
    website_url: "",
    linkedin_url: "",
    profile_photo_url: null,
    cover_photo_url: null,
    email: "",
    qualification: "",
  });

  // Fetch public profile data
  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setIsLoading(true);

        if (!generatedToken) {
          toast.error("Invalid profile link");
          setIsLoading(false);
          return;
        }

        const currentApiUrl = API_URL;

        if (!currentApiUrl) {
          console.error("API_URL not configured");
          toast.error("Configuration error");
          setIsLoading(false);
          return;
        }

        // Fetch profile data from card endpoint
        const response = await axios.get(`${currentApiUrl}/card/details`, {
          headers: {
            Authorization: `Bearer ${generatedToken}`,
          },
        });

        console.log("Public profile response:", response.data);

        // Backend returns { success: true, data: {...user} }
        const userData = response.data?.data?.user;

        if (!userData) {
          console.error("No user data in response:", response.data);
          toast.error("Failed to load profile");
          setIsLoading(false);
          return;
        }

        setProfile({
          user_id: userData.user_id,
          first_name: userData.first_name || "",
          second_name: userData.second_name || "",
          job_position: userData.job_position || "",
          company: userData.company || "",
          bio: userData.bio || "",
          address: userData.address || "",
          phone: userData.phone || "",
          website_url: userData.website_url || "",
          linkedin_url: userData.linkedin_url || "",
          profile_photo_url: userData.profile_photo_url || null,
          cover_photo_url: userData.cover_photo_url || null,
          email: userData.email || "",
          qualification: userData.qualification || "",
        });

        // Track profile visit after profile is loaded
        const visitorId = getVisitorId();
        const visitingSource = getVisitingSource();
        await axios
          .post(
            `${API_URL}/analytics/profile-visit`,
            {
              visitor_id: visitorId,
              visiting_source: visitingSource,
            },
            {
              headers: {
                Authorization: `Bearer ${generatedToken}`,
              },
            },
          )
          .catch((err) =>
            console.error(
              "Profile visit tracking failed",
              err?.response?.data || err.message,
            ),
          );
      } catch (error) {
        console.error("Error fetching public profile:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error message:", error.message);
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load profile";
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicProfile();
  }, [generatedToken]);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackView();
  }, [generatedToken]);

  const handleDownloadContact = async () => {
    try {
      if (!generatedToken) {
        toast.error("User ID not available");
        return;
      }

      const currentApiUrl = API_URL;

      const response = await axios.get(`${currentApiUrl}/auth/download-vcard`, {
        headers: {
          Authorization: `Bearer ${generatedToken}`,
        },
      });

      const blob = new Blob([response.data], {
        type: "text/vcard;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const fileName = `${profile.first_name || "user"}-${
        profile.second_name || "contact"
      }`
        .toLowerCase()
        .replace(/\s+/g, "-");

      link.href = url;
      link.download = `${fileName}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Contact saved successfully!");

      // Track save with Bearer token
      try {
        await axios.post(
          `${API_URL}/analytics/save`,
          {
            visitor_id: getVisitorId(),
          },
          {
            headers: {
              Authorization: `Bearer ${generatedToken}`,
            },
          },
        );
      } catch (err) {
        console.error("Failed to track save", err);
      }
    } catch (error) {
      console.error("Error downloading contact:", error);
      toast.error("Failed to save contact");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center w-full lg:bg-gray-50">
      <div className="flex flex-col w-full lg:max-w-[432px]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center relative lg:rounded-t-2xl">
          <div className="flex items-center gap-1.5 border-b border-gray-200 pb-3 sm:pb-4 w-full lg:max-w-[432px] justify-center">
            {/* Logo */}
            <img
              src={PesocardLogo}
              alt="PESOCARD Logo"
              className="h-8 sm:h-10 lg:h-12"
            />
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-20 lg:rounded-b-2xl">
          <div className="px-0 py-4 sm:py-2.5">
            {/* My Card Section */}
            <div className="flex justify-center px-3 sm:px-4 lg:px-8">
              <div className="w-full lg:max-w-[400px] space-y-4 sm:space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between w-full">
                  <div className="space-y-0.5 sm:space-y-1">
                    <h2 className="text-[13px] sm:text-[14.3px] leading-[20px] sm:leading-[24px] text-[#101828]">
                      Digital Card
                    </h2>
                    <p className="text-[11px] sm:text-[12.1px] leading-[18px] sm:leading-[20px] text-[#6A7282]">
                      {profile.first_name}'s business card
                    </p>
                  </div>
                </div>

                {/* Business Card */}
                <div className="w-full shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[20px] border-[0.5px] border-[#99A1AF] overflow-hidden -mt-[55px]">
                  {/* Card Header with Gradient/Cover Photo */}
                  <div className="relative h-32 bg-gradient-to-r from-[#4F39F6] via-[#9810FA] to-[#E60076]">
                    {profile.cover_photo_url ? (
                      <img
                        src={getImageUrl(profile.cover_photo_url)}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-10">
                          <svg
                            className="w-full h-full"
                            viewBox="0 0 364 128"
                            fill="none"
                          >
                            <circle cx="344" cy="48" r="80" fill="white" />
                            <circle cx="64" cy="128" r="64" fill="white" />
                          </svg>
                        </div>
                        <div className="absolute top-4 left-5 bg-white/20 backdrop-blur-[12px] border border-white/30 rounded-full px-[13px] py-[10px_12px]">
                          <span className="text-white text-[10.9px] leading-[16px]">
                            {profile.company || "Company"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="px-5 pb-5 space-y-5 -mt-[55px]">
                    {/* Profile Section */}
                    <div className="flex items-end gap-4">
                      {/* Profile Photo */}
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-2xl border-4 border-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden z-10">
                        {profile.profile_photo_url ? (
                          <img
                            src={getImageUrl(profile.profile_photo_url)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl text-gray-400">
                            {profile.first_name?.charAt(0)}
                            {profile.second_name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="pb-1 space-y-0.5">
                        <h3 className="text-[14.4px] leading-[24px] text-white">
                          {profile.first_name} {profile.second_name}
                        </h3>
                        <p className="text-[12.6px] leading-[20px] text-[#4A5565]">
                          {profile.job_position}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    {profile.address && (
                      <div className="flex items-center gap-2 pb-[21px] border-b border-[#F3F4F6]">
                        <MdLocationOn className="w-4 h-4 text-[#6A7282]" />
                        <span className="text-[12.9px] leading-[20px] text-[#6A7282]">
                          {profile.address}
                        </span>
                      </div>
                    )}

                    {/* Contact Links */}
                    <div className="space-y-3">
                      {profile.email && (
                        <a
                          href={`mailto:${profile.email}`}
                          className="w-full flex items-center gap-3 p-3 bg-[#EFF6FF] rounded-[14px] hover:bg-blue-100 transition-colors"
                        >
                          <img
                            src={ContactIcons.email}
                            alt="Email"
                            className="w-5 h-5"
                          />
                          <div className="flex-1 text-left space-y-0.5">
                            <p className="text-[11.1px] leading-[16px] text-[#6A7282]">
                              Email
                            </p>
                            <p className="text-[12.3px] leading-[20px] text-[#101828]">
                              {profile.email}
                            </p>
                          </div>
                        </a>
                      )}

                      {profile.phone && (
                        <a
                          href={`tel:${profile.phone}`}
                          className="w-full flex items-center gap-3 p-3 bg-[#F0FDF4] rounded-[14px] hover:bg-green-100 transition-colors"
                        >
                          <img
                            src={ContactIcons.phone}
                            alt="Phone"
                            className="w-5 h-5"
                          />
                          <div className="flex-1 text-left space-y-0.5">
                            <p className="text-[11.1px] leading-[16px] text-[#6A7282]">
                              Phone
                            </p>
                            <p className="text-[13.1px] leading-[20px] text-[#101828]">
                              {profile.phone}
                            </p>
                          </div>
                        </a>
                      )}

                      {profile.website_url && (
                        <a
                          href={profile.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackLinkClick("website")}
                          className="w-full flex items-center gap-3 p-3 bg-[#FAF5FF] rounded-[14px] hover:bg-purple-100 transition-colors"
                        >
                          <img
                            src={ContactIcons.website}
                            alt="Website"
                            className="w-5 h-5"
                          />
                          <div className="flex-1 text-left space-y-0.5">
                            <p className="text-[10.5px] leading-[16px] text-[#6A7282]">
                              Website
                            </p>
                            <p className="text-[12.3px] leading-[20px] text-[#101828]">
                              {profile.website_url}
                            </p>
                          </div>
                        </a>
                      )}

                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackLinkClick("linkedin")}
                          className="w-full flex items-center gap-3 p-3 bg-[#EFF6FF] rounded-[14px] hover:bg-blue-100 transition-colors"
                        >
                          <img
                            src={ContactIcons.linkedin}
                            alt="LinkedIn"
                            className="w-5 h-5"
                          />
                          <div className="flex-1 text-left space-y-0.5">
                            <p className="text-[11.1px] leading-[16px] text-[#6A7282]">
                              LinkedIn
                            </p>
                            <p className="text-[12.5px] leading-[20px] text-[#101828]">
                              {profile.linkedin_url}
                            </p>
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={handleDownloadContact}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#10B981] text-white rounded-[14px] hover:bg-emerald-600 transition-colors text-[12.9px] font-medium"
                      title="Download contact as vCard"
                    >
                      <MdDownload className="w-4 h-4 text-white" />
                      <span>Save Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCardView;
