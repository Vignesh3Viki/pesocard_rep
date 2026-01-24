import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import {
  MdEdit,
  MdQrCodeScanner,
  MdLocationOn,
  MdShare,
  MdQrCode2,
  MdClose,
  MdMoreVert,
  MdDownload,
} from "react-icons/md";
import SettingsIcon from "@/assets/Settings.svg";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";
import PageFooter from "@/components/PageFooter";
import { ContactIcons } from "@/components/ContactIcons";
import editProfileService from "../../edit-profile/services/editProfileService";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageUtils";
import axios from "axios";

const MyCardPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Get or create visitor ID (persists across sessions)
  const getVisitorId = () => {
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem("visitor_id", visitorId);
    }
    return visitorId;
  };

  // Track unique view (only counts each visitor once)
  const trackUniqueView = async () => {
    // if (!encryptedUserId) return;
    // const visitorId = getVisitorId();
    // try {
    //   await axios.post(`${API_BASE_URL}/analytics/view`, {
    //     cardId: encryptedUserId,
    //     visitorId,
    //   });
    // } catch (err) {
    //   console.error("Unique view tracking failed:", err);
    // }
  };

  const navigate = useNavigate();
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const cardMenuRef = useRef(null);
  const [encryptedUserId, setEncryptedUserId] = useState(null);
  const [profile, setProfile] = useState({
    user_id: null,
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
  const [analytics, setAnalytics] = useState({
    views: 0,
    shares: 0,
    save_rate_percentage: 0,
  });

  // Close card menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardMenuRef.current && !cardMenuRef.current.contains(event.target)) {
        setShowCardMenu(false);
      }
    };

    if (showCardMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCardMenu]);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const params = new URLSearchParams(window.location.search);
        const isDownload = params.get("download") === "vcf";

        // If no token and download is requested, skip auth requirement
        if (!token && isDownload) {
          setIsLoading(false);
          return;
        }

        const response = await editProfileService.getProfile();
        const userData = response.data.user;

        setEncryptedUserId(userData.encryptedUserId);

        setProfile({
          user_id: userData.id,
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
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Only show error if not downloading
        if (!window.location.search.includes("download=vcf")) {
          toast.error("Failed to load profile");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Track UNIQUE view when component loads (only once per visitor)
  useEffect(() => {
    if (!profile || profile.user_id === null) return;
    trackUniqueView();
    fetchAnalytics();
  }, [profile]);

  const fetchAnalytics = async () => {
    const authToken = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/analytics/metrics`, {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      })
      .then((res) => {
        const metrics = res.data.data.get_user_card_metrics;
        setAnalytics({
          views: metrics.total_views || 0,
          shares: metrics.total_shares || 0,
          save_rate_percentage: metrics.save_rate_percentage || 0,
        });
      })
      .catch((error) => console.error("Error fetching analytics:", error));
  };

  // Auto-download VCF when user scans QR code with download parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("download") === "vcf") {
      const timer = setTimeout(() => {
        handleSaveContact();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const handleEditClick = () => {
    navigate("/edit-profile");
  };

  const handleScanClick = () => {
    // Add QR code scanner functionality here
    toast.info("QR Scanner feature coming soon!");
    // You can integrate qr-scanner library: npm install qr-scanner
    // For now, navigate to scan page or show scanner UI
    // navigate('/scan');
  };

  const handleShareClick = async () => {
    try {
      const fullName = `${profile.first_name} ${profile.second_name}`;
      let shareUrl = "";
      try {
        const authToken = localStorage.getItem("token");
        const resp = await axios.post(
          `${API_BASE_URL}/analytics/share-link`,
          {},
          {
            headers: {
              Authorization: authToken ? `Bearer ${authToken}` : "",
            },
          },
        );
        const path = resp.data?.data?.path;
        const baseUrl = window.location.origin;
        shareUrl = `${baseUrl}${path}`;
      } catch (e) {
        console.warn("Failed to generate share token, using plain link.", e);
      } finally {
        fetchAnalytics();
      }

      const shareData = {
        title: "PesoCard Contact",
        text: `Check out my digital business card: ${fullName}`,
        url: shareUrl,
      };

      if (navigator.share) {
        // Native share API available (Works on mobile and some desktop browsers)
        try {
          await navigator.share(shareData);

          toast.success("Contact shared!");
        } catch (shareError) {
          // User cancelled share dialog - not an error
          if (shareError.name !== "AbortError") {
            console.error("Share error:", shareError);
            // Fallback to clipboard
            const text = `${fullName} - ${profile.email || "Contact me"}\n${shareUrl}`;
            await navigator.clipboard.writeText(text);
            toast.success("Link copied to clipboard!");
          }
        }
      } else {
        // Fallback: Copy to clipboard for browsers without native share API
        const text = `${fullName} - ${profile.email || "Contact me"}\n${shareUrl}`;
        await navigator.clipboard.writeText(text);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share contact");
    }
  };

  const handleQRClick = async () => {
    try {
      if (!showQR) {
        if (!encryptedUserId) {
          toast.error("User ID not available");
          return;
        }

        // Build QR URL pointing to the QR scan handler
        // The backend will decrypt the user ID, create a share record, generate a token, and redirect
        const baseUrl = process.env.REACT_APP_API_URL;
        const qrUrl = `${baseUrl}/analytics/qr/${encodeURIComponent(encryptedUserId)}`;

        // Generate QR code pointing to the QR scan endpoint
        const qrDataUrl = await QRCode.toDataURL(qrUrl, {
          errorCorrectionLevel: "H",
          type: "image/png",
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrCodeUrl(qrDataUrl);
      }
      setShowQR(!showQR);
    } catch (error) {
      console.error("QR generation error:", error);
      toast.error("Failed to generate QR code");
    } finally {
      fetchAnalytics();
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   toast.success("Logged out successfully");
  //   navigate("/");
  // };

  const handleSaveContact = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      // Call the backend API to download vCard with encrypted userId
      const response = await axios.get(`${API_URL}/auth/download-vcard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create blob and download
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
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact");
    }
  };
   const handleSaveQRImage = async () => {
    try {
      if (!qrCodeUrl) {
        toast.error("QR code not available");
        return;
      }

      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const fileName = `${profile.first_name || "user"}-${
        profile.second_name || "contact"
      }`
        .toLowerCase()
        .replace(/\s+/g, "-");

      link.href = url;
      link.download = `${fileName}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("QR code saved successfully!");
      setShowQR(false);
    } catch (error) {
      console.error("Error saving QR code:", error);
      toast.error("Failed to save QR code");
    }
  };

  const handleDeleteCard = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your card? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      console.log("Delete request - API_URL:", API_URL);
      console.log("Delete request - Token exists:", !!token);

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      if (!API_URL) {
        toast.error("API configuration error");
        console.error("REACT_APP_API_URL is not configured");
        return;
      }

      console.log(`Deleting profile at: ${API_URL}/auth/profile`);
      const response = await axios.delete(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Card deletion response:", response);
      toast.success("Card deleted successfully");

      setTimeout(() => {
        navigate("/edit-profile");
      }, 1500);
    } catch (error) {
      console.error("Error deleting card:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete card";
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
          <div className="absolute right-3 sm:right-6 lg:right-12">
            <button
              onClick={() => navigate("/settings")}
              className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 flex items-center justify-center rounded-[10px] hover:bg-gray-50 transition-colors"
              title="Settings"
            >
              <img
                src={SettingsIcon}
                alt="Settings"
                className="w-4 sm:w-5 h-4 sm:h-5"
              />
            </button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-20 lg:rounded-b-2xl">
          <div className="px-0 py-4 sm:py-2.5">
            {/* Action Buttons - Centered */}
            <div className="flex justify-center px-3 sm:px-4 lg:px-8 mb-3 sm:mb-4 lg:mb-6">
              <div className="flex gap-2 sm:gap-3 w-full lg:max-w-[400px]">
                <button
                  onClick={handleEditClick}
                  className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-3 p-2.5 sm:p-3 lg:p-[18px] border-2 border-[#F3F4F6] rounded-xl sm:rounded-2xl hover:border-[#FF6900] hover:bg-orange-50 active:scale-95 transition-all bg-white cursor-pointer"
                >
                  <div className="w-7 sm:w-8 lg:w-10 h-7 sm:h-8 lg:h-10 bg-[#FF6900] rounded-full flex items-center justify-center shadow-md">
                    <MdEdit className="w-3.5 sm:w-4 lg:w-5 h-3.5 sm:h-4 lg:h-5 text-white" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] lg:text-[12.1px] leading-[14px] sm:leading-[16px] lg:leading-[20px] text-[#364153] font-medium">
                    Edit
                  </span>
                </button>
                <button
                  onClick={handleScanClick}
                  className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-3 p-2.5 sm:p-3 lg:p-[18px] border-2 border-[#F3F4F6] rounded-xl sm:rounded-2xl hover:border-[#2B7FFF] hover:bg-blue-50 active:scale-95 transition-all bg-white cursor-pointer"
                >
                  <div className="w-7 sm:w-8 lg:w-10 h-7 sm:h-8 lg:h-10 bg-[#2B7FFF] rounded-full flex items-center justify-center shadow-md">
                    <MdQrCodeScanner className="w-3.5 sm:w-4 lg:w-5 h-3.5 sm:h-4 lg:h-5 text-white" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] lg:text-[12.8px] leading-[14px] sm:leading-[16px] lg:leading-[20px] text-[#364153] font-medium">
                    Scan
                  </span>
                </button>
              </div>
            </div>

            {/* My Card Section */}
            <div className="flex justify-center px-3 sm:px-4 lg:px-8">
              <div className="w-full lg:max-w-[400px] space-y-4 sm:space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between w-full">
                  <div className="space-y-0.5 sm:space-y-1">
                    <h2 className="text-[13px] sm:text-[14.3px] leading-[20px] sm:leading-[24px] text-[#101828]">
                      My Card
                    </h2>
                    <p className="text-[11px] sm:text-[12.1px] leading-[18px] sm:leading-[20px] text-[#6A7282]">
                      Active digital business card
                    </p>
                  </div>
                  <div className="relative" ref={cardMenuRef}>
                    <button
                      onClick={() => setShowCardMenu(!showCardMenu)}
                      className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-lg hover:bg-blue-100 transition-all duration-200 flex-shrink-0 group"
                    >
                      <MdMoreVert className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-[#2B7FFF] group-hover:text-[#1e5db8] transition-colors" />
                    </button>

                    {/* Card Menu Dropdown */}
                    {showCardMenu && (
                      <div className="absolute right-0 top-10 bg-white border border-[#E5E7EB] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] z-50 flex gap-2 p-2">
                        <button
                          onClick={() => {
                            handleSaveContact();
                            setShowCardMenu(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#10B981] hover:bg-green-50 transition-colors duration-150 rounded-lg"
                          title="Download"
                        >
                          <MdDownload className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteCard();
                            setShowCardMenu(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#DC2626] hover:bg-red-50 transition-colors duration-150 rounded-lg"
                          title="Delete Card"
                        >
                          <MdClose className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
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

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3 w-full">
                      <button
                        onClick={handleShareClick}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-[#101828] text-white rounded-[12px] sm:rounded-[14px] hover:bg-gray-800 transition-colors text-[11px] sm:text-[12.9px] whitespace-nowrap"
                        title="Share your digital card"
                      >
                        <MdShare className="w-3 sm:w-4 h-3 sm:h-4 text-white flex-shrink-0" />
                        <span className="leading-[14px] sm:leading-[20px]">
                          Share
                        </span>
                      </button>
                      <button
                        onClick={handleQRClick}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-[#F3F4F6] text-[#101828] rounded-[12px] sm:rounded-[14px] hover:bg-gray-200 transition-colors text-[11px] sm:text-[13.3px] whitespace-nowrap"
                        title="Generate QR code and download contact"
                      >
                        <MdQrCode2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#101828] flex-shrink-0" />
                        <span className="leading-[14px] sm:leading-[20px]">
                          QR
                        </span>
                      </button>
                      <button
                        onClick={handleSaveContact}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-[#10B981] text-white rounded-[12px] sm:rounded-[14px] hover:bg-emerald-600 transition-colors text-[11px] sm:text-[12.9px] whitespace-nowrap"
                        title="Download contact as vCard"
                      >
                        <MdDownload className="w-3 sm:w-4 h-3 sm:h-4 text-white flex-shrink-0" />
                        <span className="leading-[14px] sm:leading-[20px]">
                          Save
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                {showQR && qrCodeUrl && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col items-center space-y-4 max-w-sm w-full shadow-2xl animate-in scale-in duration-300">
                      {/* Close Button */}
                      <button
                        onClick={() => setShowQR(false)}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        title="Close"
                      >
                        <MdClose className="w-6 h-6 text-gray-600" />
                      </button>

                      {/* QR Code Image */}
                      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm transform transition-all duration-500 hover:shadow-lg mt-6">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-300 hover:scale-105"
                        />
                      </div>

                      {/* Description Text */}
                      <p className="text-sm text-[#6A7282] text-center font-medium">
                        Scan to save contact
                      </p>

                      {/* Action Button */}
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={handleSaveQRImage}
                          className="flex-1 py-3 bg-[#10B981] text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                          title="Save QR code image"
                        >
                          <MdDownload className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => setShowQR(false)}
                          className="flex-1 py-3 bg-[#101828] text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Performance */}
                <div className="bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 px-3 sm:px-4 pb-3 sm:pb-4 space-y-2.5 sm:space-y-3">
                  <h3 className="text-[10px] sm:text-[10.5px] leading-[14px] sm:leading-[16px] text-[#4A5565]">
                    Card Performance
                  </h3>
                  <div className="flex items-center justify-around gap-3 sm:gap-4">
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#101828]">
                        {Number(analytics.views || 0).toLocaleString()}
                      </span>
                      <span className="text-[9.5px] sm:text-[11px] leading-[14px] sm:leading-[16px] text-[#6A7282]">
                        Views
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#101828]">
                        {Number(analytics.shares || 0).toLocaleString()}
                      </span>
                      <span className="text-[9.5px] sm:text-[11px] leading-[14px] sm:leading-[16px] text-[#6A7282]">
                        Shares
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#101828]">
                        {analytics.save_rate_percentage || 0}%
                      </span>
                      <span className="text-[9.5px] sm:text-[11px] leading-[14px] sm:leading-[16px] text-[#6A7282]">
                        Save Rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PageFooter />
        </div>
      </div>
    </div>
  );
};

export default MyCardPage;
