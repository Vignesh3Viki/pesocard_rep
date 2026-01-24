import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Briefcase,
  Building2,
  Mail,
  MapPin,
  Phone,
  Globe,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import editProfileService from "../services/editProfileService";
import { getImageUrl } from "@/lib/imageUtils";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    second_name: "",
    job_position: "",
    qualification: "",
    company: "",
    bio: "",
    address: "",
    phone: "",
    email: "",
    website_url: "",
    linkedin_url: "",
  });

  const [files, setFiles] = useState({
    profile_photo: null,
    cover_photo: null,
  });

  const [previews, setPreviews] = useState({
    profile_photo: null,
    cover_photo: null,
  });

  const profilePhotoRef = useRef(null);
  const coverPhotoRef = useRef(null);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await editProfileService.getProfile();
        const userData = response.data.user;

        setFormData({
          first_name: userData.first_name || "",
          second_name: userData.second_name || "",
          job_position: userData.job_position || "",
          qualification: userData.qualification || "",
          company: userData.company || "",
          bio: userData.bio || "",
          email: userData.email || "",
          address: userData.address || "",
          phone: userData.phone || "",
          website_url: userData.website_url || "",
          linkedin_url: userData.linkedin_url || "",
        });

        // Set image previews from URLs
        if (userData.profile_photo_url) {
          setPreviews((prev) => ({
            ...prev,
            profile_photo: getImageUrl(userData.profile_photo_url),
          }));
        }

        if (userData.cover_photo_url) {
          setPreviews((prev) => ({
            ...prev,
            cover_photo: getImageUrl(userData.cover_photo_url),
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [fieldName]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = { ...formData };

      // Add files to form data if they exist
      if (files.profile_photo) {
        submitData.profile_photo = files.profile_photo;
      }
      if (files.cover_photo) {
        submitData.cover_photo = files.cover_photo;
      }

      const response = await editProfileService.updateProfile(submitData);

      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
        duration: 5000,
      });

      // Update previews if new files were uploaded
      if (response.data.user) {
        if (response.data.user.profile_photo_url) {
          setPreviews((prev) => ({
            ...prev,
            profile_photo: getImageUrl(response.data.user.profile_photo_url),
          }));
        }
        if (response.data.user.cover_photo_url) {
          setPreviews((prev) => ({
            ...prev,
            cover_photo: getImageUrl(response.data.user.cover_photo_url),
          }));
        }
      }

      // Clear file inputs
      setFiles({ profile_photo: null, cover_photo: null });

      // Redirect to my-card page after successful update
      setTimeout(() => {
        navigate("/my-card");
      }, 1000);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Update failed", {
        description: "Please check your information and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="max-w-md lg:max-w-5xl mx-auto flex items-center gap-4 sm:gap-6 md:gap-8">
          <button
            onClick={() => navigate("/my-card")}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
          </button>
          <div className="flex-1">
            <img
              src={PesocardLogo}
              alt="PESOCARD Logo"
              className="h-6 sm:h-8 md:h-10 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
        <div className="max-w-md lg:max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Two-column layout for large screens */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
              {/* Left Column */}
              <div className="space-y-6 md:space-y-8">
                {/* Card Images Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-normal text-gray-900">
                        Card Images
                      </h2>
                      <p className="text-xs md:text-sm text-gray-500">
                        Upload your photos
                      </p>
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div
                    onClick={() => coverPhotoRef.current?.click()}
                    className="h-36 md:h-44 lg:h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden"
                  >
                    <input
                      ref={coverPhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "cover_photo")}
                      className="hidden"
                    />
                    {previews.cover_photo ? (
                      <img
                        src={previews.cover_photo}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-10 h-12 md:w-12 md:h-14 mx-auto mb-2 flex items-center justify-center">
                          <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Upload Cover Image
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                          Recommended: 800x200px
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Profile Photo Section */}
                  <div
                    onClick={() => profilePhotoRef.current?.click()}
                    className="flex items-center gap-4 md:gap-5 cursor-pointer"
                  >
                    <input
                      ref={profilePhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "profile_photo")}
                      className="hidden"
                    />
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-lg flex items-center justify-center">
                      {previews.profile_photo ? (
                        <img
                          src={previews.profile_photo}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-2xl"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Upload className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-normal text-gray-700">
                        Profile Photo
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500">
                        Square image works best
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-purple-600"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M5.33 10C5.33 9.26667 6.6 8 8 8C9.4 8 10.67 9.26667 10.67 10"
                          stroke="currentColor"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="8"
                          cy="5.33"
                          r="2.67"
                          stroke="currentColor"
                          strokeWidth="1.33"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-normal text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-xs md:text-sm text-gray-500">
                        Your basic details
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className="h-9 md:h-11 px-3 md:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      name="second_name"
                      value={formData.second_name}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      className="h-9 md:h-11 px-3 md:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="Qualification"
                    className="w-full h-9 md:h-11 px-3 md:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 md:space-y-8">
                {/* Professional Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-normal text-gray-900">
                        Professional Details
                      </h2>
                      <p className="text-xs md:text-sm text-gray-500">
                        Your work information
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-gray-400 absolute left-3.5 md:left-4 top-2.5 md:top-3 pointer-events-none" />
                      <input
                        type="text"
                        name="job_position"
                        value={formData.job_position}
                        onChange={handleInputChange}
                        placeholder="Job Position"
                        className="w-full h-9 md:h-11 pl-11 md:pl-12 pr-3 md:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative">
                      <Building2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400 absolute left-3.5 md:left-4 top-2.5 md:top-3 pointer-events-none" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company"
                        className="w-full h-9 md:h-11 pl-11 md:pl-12 pr-3 md:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>

                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Bio"
                      rows={3}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-normal text-gray-900">
                        Contact Information
                      </h2>
                      <p className="text-xs md:text-sm text-gray-500">
                        How to reach you
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 absolute left-3.5 md:left-4 top-2.5 md:top-3 pointer-events-none" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="w-full h-9 md:h-11 pl-11 md:pl-12 pr-3 md:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-500 absolute left-3.5 md:left-4 top-2.5 md:top-3 pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                        className="w-full h-9 md:h-11 pl-11 md:pl-12 pr-3 md:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-500 absolute left-3.5 md:left-4 top-2.5 md:top-3 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true}
                        placeholder="Email"
                        className="w-full h-9 md:h-11 pl-11 md:pl-12 pr-3 md:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="relative">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-purple-500 absolute left-3.5 md:left-4 top-2.5 md:top-3 pointer-events-none" />
                      <input
                        type="url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="Website"
                        className="w-full h-9 md:h-11 pl-11 md:pl-12 pr-3 md:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative">
                      <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 absolute left-3.5 md:left-4 top-2.5 md:top-3 pointer-events-none" />
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleInputChange}
                        placeholder="LinkedIn"
                        className="w-full h-9 md:h-11 pl-11 md:pl-12 pr-3 md:pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 md:pt-4 lg:pt-6">
              <Button
                type="submit"
                className="w-full sm:w-80 md:w-96 lg:w-[400px] max-w-full mx-auto block flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 md:py-4 lg:py-5 rounded-[56px] text-sm md:text-base font-normal shadow-lg transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
