import React, { forwardRef } from 'react';
import { getImageUrl } from '@/lib/imageUtils';
import PesocardLogo from '@/assets/images/pesocard-logo.svg';

export const Wallpaper = forwardRef(
  (
    {
      profile,
      qrCodeUrl,
      isDesktop = true,
    },
    ref
  ) => {
    const desktopSize = { width: 1080, height: 1080 };
    const mobileSize = { width: 540, height: 720 };
    const size = isDesktop ? desktopSize : mobileSize;

    return (
      <div
        ref={ref}
        className="rounded-[32px] p-10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #120C1D 0%, #171429 25%, #261B32 50%, #322239 75%, #141221 100%)',
          width: `${size.width}px`,
          height: `${size.height}px`,
          maxWidth: 'none',
          aspectRatio: 'auto',
          border: '1px solid #8040BF26',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Decorative Corner Borders */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-slate-700 rounded-tl-lg" style={{ borderColor: '#8040BF40' }}></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-slate-700 rounded-tr-lg" style={{ borderColor: '#8040BF40' }}></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-slate-700 rounded-bl-lg" style={{ borderColor: '#8040BF40' }}></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-slate-700 rounded-br-lg" style={{ borderColor: '#8040BF40' }}></div>

        {/* Main Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-12">
          {/* Top Section - Avatar and QR aligned */}
          <div className="flex items-center justify-center gap-12 mb-8">
            {/* Left - Avatar with Glow */}
            <div className="flex flex-col items-center justify-center">
              {/* Glowing Ring Container */}
              <div className="relative w-56 h-56">
                {/* Outer Glow Ring - Pink/Magenta */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 blur-xl opacity-60"></div>

                {/* Avatar Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 p-1 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center overflow-hidden">
                    {profile?.profile_photo_url ? (
                      <img
                        src={getImageUrl(profile.profile_photo_url)}
                        alt={`${profile.first_name} ${profile.second_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-7xl font-bold text-gray-600">
                        {profile?.first_name?.charAt(0)}
                        {profile?.second_name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - QR Code */}
            {qrCodeUrl && (
              <div className="flex flex-col items-center justify-center flex-shrink-0">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-lg border-2 border-slate-700 flex items-center justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section - User Info */}
          <div className="text-center space-y-3">
            <h2 className="text-5xl font-bold text-white leading-tight">
              {profile?.first_name} {profile?.second_name}
            </h2>
            {profile?.job_position && (
              <p className="text-2xl font-semibold text-pink-400 uppercase tracking-wide">
                {profile.job_position}
              </p>
            )}
            {profile?.company && (
              <p className="text-lg text-slate-300 mt-2">{profile.company}</p>
            )}
          </div>
        </div>

        {/* PESOCARD Branding at Bottom */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2">
          <img src={PesocardLogo} alt="PESOCARD" className="h-5 opacity-70" />
          <span className="text-slate-500 text-sm font-medium"></span>
        </div>
      </div>
    );
  }
);

Wallpaper.displayName = 'Wallpaper';

export default Wallpaper;

