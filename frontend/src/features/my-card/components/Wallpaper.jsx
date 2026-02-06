import React from "react";
import QRCode from "react-qr-code";
import { getImageUrl } from "@/lib/imageUtils";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";

const Wallpaper = React.forwardRef(({ profile, qrCodeUrl }, ref) => {
  // Fixed MOBILE wallpaper size (9:16)
  const size = {
    width: 1080,
    height: 1920,
  };

  return (
    <div
      ref={ref}
      style={{
        width: size.width,
        height: size.height,
      }}
      className="relative flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] via-[#020617] to-black overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),transparent_55%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12 px-20">
        {/* Profile Image */}
        <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white-500 shadow-xl">
          {profile?.profile_photo_url ? (
            <img
              src={getImageUrl(profile.profile_photo_url)}
              alt="Profile"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white text-6xl font-bold text-gray-500">
              {profile?.first_name?.charAt(0)}
              {profile?.second_name?.charAt(0)}
            </div>
          )}
        </div>

        {/* Name */}
        <h2 className="text-6xl font-bold text-white text-center">
          {profile?.first_name} {profile?.second_name}
        </h2>

        {/* Designation */}
        {profile?.job_position && (
          <p className="text-2xl text-pink-400 text-center">
            {profile.job_position}
          </p>
        )}

        {/* QR Code */}
        <div className="mt-8 w-64 h-64 bg-white p-4 rounded-3xl shadow-lg flex items-center justify-center">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
          ) : (
            <QRCode value={window.location.origin} size={224} />
          )}
        </div>

        {/* Website text */}
      </div>

      {/* Footer branding */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2">
        <img src={PesocardLogo} alt="PESOCARD" className="h-14 opacity-100" />
      </div>
    </div>
  );
});

export default Wallpaper;
