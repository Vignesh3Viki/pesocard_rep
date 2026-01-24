import React from "react";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="max-w-md lg:max-w-5xl mx-auto flex items-center">
          <img
            src={PesocardLogo}
            alt="PESOCARD Logo"
            className="h-6 sm:h-8 md:h-10 w-auto"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
            Instant connections made simple with PesoCard's QR digital business card
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            PesoCard is revolutionizing how professionals connect and share their information instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
