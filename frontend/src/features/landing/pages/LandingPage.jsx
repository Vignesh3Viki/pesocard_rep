import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  QrCode,
  Share2,
  Smartphone,
  Printer,
  HardDriveDownload,
  RefreshCw,
  ShieldCheck,
  Globe,
  BarChart3,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  TrendingUp,
  CreditCard,
  Users,
  Play,
  ArrowRight,
} from "lucide-react";
import phoneMockup from "@/assets/phone_mockup_v2.png";
import teamMember1 from "@/assets/images/team-member-1.png";
import teamMember2 from "@/assets/images/team-member-2.png";
import Header from "../components/Header";
import NfcProfileMockup from "../components/NfcProfileMockup";

export const LandingPage = () => {
  return (
    <div className="font-dm-sans min-h-screen flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#6366F1] via-[#6366F1E5] to-[#9810FA] text-white">
        <Header />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="min-h-auto md:min-h-[760px] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-0 py-12 md:py-20">
            <div className="max-w-full lg:max-w-[560px] space-y-6 text-center lg:text-left lg:pr-8 xl:pr-40">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs justify-center lg:justify-start">
                ⭐ Trusted by 50k+ professionals
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.15] font-bold">
                Instant connections made simple with PesoCard's QR digital
                business card
              </h1>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Make every connection count. With PESOCARD, your QR-enabled
                digital card instantly shares your business profile, contact
                details, social links, and portfolio with any smartphone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <Button className="bg-white text-indigo-600 px-6">
                  Home page
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative w-full lg:w-auto flex justify-center">
              <img src={phoneMockup} alt="Phone" className="w-64 sm:w-72 md:w-80 lg:w-[380px]" />
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Alternative Section */}
      <section className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              QR Code Alternative
            </h2>
            <p className="text-slate-500 max-w-[588px] mx-auto text-xs sm:text-sm md:text-base">
              Don't have NFC? No problem! Generate and share your QR code
              instantly.Anyone can scan it with their phone camera to access
              your digital business card.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="max-w-[1008px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              {/* Large Card 1 */}
              <Card className="bg-gradient-to-b from-[#155DFC] to-[#0D3796] text-white border-none shadow-xl h-auto md:h-[241.69px] rounded-[12.75px] p-6 md:p-7 flex flex-col items-start gap-4">
                <div className="w-[42px] h-[42px] bg-white/20 rounded-[8px] flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-[18px] font-bold leading-tight">
                    Generate Your QR Code
                  </h3>
                  <p className="text-[13px] text-blue-100 leading-relaxed">
                    Create a personalized QR code that links directly to your
                    digital profile. Perfect for print materials, email
                    signatures, or social media.
                  </p>
                </div>
              </Card>

              {/* Large Card 2 */}
              <Card className="bg-gradient-to-b from-[#155DFC] to-[#0D3796] text-white border-none shadow-xl h-auto md:h-[241.69px] rounded-[12.75px] p-6 md:p-7 flex flex-col items-start gap-4">
                <div className="w-[42px] h-[42px] bg-white/20 rounded-[8px] flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-[18px] font-bold leading-tight">
                    Easy to Share
                  </h3>
                  <p className="text-[13px] text-blue-100 leading-relaxed">
                    Share your QR code anywhere - add it to business cards,
                    presentations, or display it at events. Works on any
                    smartphone camera.
                  </p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  title: "Universal Compatibility",
                  icon: <Smartphone className="w-5 h-5" />,
                  desc: "Works on all smartphones",
                },
                {
                  title: "Print Friendly",
                  icon: <Printer className="w-5 h-5" />,
                  desc: "Perfect for flyers & posters",
                },
                {
                  title: "No App Required",
                  icon: <HardDriveDownload className="w-5 h-5" />,
                  desc: "Scan with camera app",
                },
                {
                  title: "Always Updated",
                  icon: <RefreshCw className="w-5 h-5" />,
                  desc: "Link stays current",
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="bg-[#0D3796] text-white border-none shadow-xl h-auto md:h-[178px] rounded-[12px] p-4 md:p-6 flex flex-col items-start gap-4 hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-[42px] h-[42px] bg-white/20 rounded-[8px] flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div className="text-left space-y-1">
                    <h3 className="font-bold text-[16px] leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[12px] text-blue-100">{feature.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 md:py-16 lg:py-[70px] bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1008px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Bern
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              PesoCard helps businesses and individuals move beyond paper cards
              with secure NFC technology and smart digital networking tools.
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Top Row: 2 Large Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Card className="bg-gradient-to-b from-[#06B6D4] to-[#00B8DB] text-white border-none shadow-lg p-6 md:p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">
                    Instant Tap-to-Share Technology
                  </h3>
                  <p className="text-sm md:text-base text-cyan-50 leading-relaxed opacity-90">
                    Connect instantly with just one tap. PesoCard's NFC-enabled
                    business card transfers your contact details, profile, and
                    links directly to any smartphone — no app or QR code needed.
                  </p>
                </div>
              </Card>

              <Card className="bg-gradient-to-b from-[#AD46FF] to-[#9810FA] text-white border-none shadow-lg p-6 md:p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">
                    Smart Analytics & Performance Insights
                  </h3>
                  <p className="text-sm md:text-base text-purple-50 leading-relaxed opacity-90">
                    Know exactly how your network interacts with your card. Get
                    real-time data on taps, views, and clicks to measure
                    engagement and follow up faster with high-value leads.
                  </p>
                </div>
              </Card>
            </div>

            {/* Middle Row: 4 Medium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-gradient-to-b from-[#00C950] to-[#00A63E] text-white border-none shadow-md p-4 md:p-6 h-full">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base md:text-lg font-bold mb-2">Growth Analytics</h4>
                <p className="text-xs md:text-sm opacity-90">
                  Track taps, views, and link clicks in real time.
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-[#2B7FFF] to-[#155DFC] text-white border-none shadow-md p-4 md:p-6 h-full">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base md:text-lg font-bold mb-2">Bank-level Security</h4>
                <p className="text-xs md:text-sm opacity-90">
                  Your data is encrypted and protected.
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-[#F6339A] to-[#E60076] text-white border-none shadow-md p-4 md:p-6 h-full">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base md:text-lg font-bold mb-2">Mobile First</h4>
                <p className="text-xs md:text-sm opacity-90">
                  Looks perfect on any device.
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-[#615FFF] to-[#4F39F6] text-white border-none shadow-md p-4 md:p-6 h-full">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base md:text-lg font-bold mb-2">Global Reach</h4>
                <p className="text-xs md:text-sm opacity-90">
                  Compatible with phones worldwide.
                </p>
              </Card>
            </div>

            {/* Bottom Row: 3 White Cards (Centered) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4 md:pt-8">
              <Card className="bg-white border text-center p-6 md:p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <Play className="w-6 h-6" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-slate-800 mb-2">
                    Interactive Demos
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    Explore live NFC digital card demos and experience instant
                    tap-to-connect sharing.
                  </p>
                </div>
              </Card>

              <Card className="bg-white border text-center p-6 md:p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-slate-800 mb-2">
                    Payment Integration
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    Link secure payments or bookings directly through your
                    digital business card.
                  </p>
                </div>
              </Card>

              <Card className="bg-white border text-center p-6 md:p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-slate-800 mb-2">
                    Team Collaboration
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    Manage team profiles and track performance with shared smart
                    analytics.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* NFC Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-16 py-12 md:py-16 lg:py-20 bg-[#F8FAFC] overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-slate-900 leading-[1.2]">
                Powerful NFC Profile, Built for Professionals
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                PesoCard lets you design a custom digital business card that
                truly represents your brand. Add your photo, role, bio, social
                links, and even files all accessible with a single tap.
              </p>
              <ul className="space-y-3 md:space-y-4 pt-2 flex flex-col items-center lg:items-start">
                {[
                  "Smart auto-categorization",
                  "Custom folder creation",
                  "Instant search and filtering",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700 font-medium text-sm md:text-base"
                  >
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-4 bg-[#6366F1] hover:bg-indigo-700 text-white px-6 md:px-8 py-3 md:py-6 rounded-lg text-sm md:text-base font-medium transition-all shadow-lg shadow-indigo-200">
                Learn More <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
              <NfcProfileMockup />
            </div>
          </div>
        </div>
        <div className="py-12 md:py-16 lg:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-14 items-stretch">
          {/* Left Card - Engagement Overview */}
          <div className="lg:w-1/2 flex items-center">
            <div className="w-full bg-cyan-100 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
              <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h4 className="text-sm md:text-base lg:text-[16px] font-bold text-slate-900">
                    Engagement Overview
                  </h4>
                  <p className="text-xs md:text-sm text-slate-400">Last 30 days</p>
                </div>

                {/* Stats Grid */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xs md:text-sm text-slate-600">Card Views</p>
                    <p className="text-base md:text-lg lg:text-[18px] font-bold text-slate-900">
                      1,247
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs md:text-sm text-slate-600">Contact Saves</p>
                    <p className="text-base md:text-lg lg:text-[18px] font-bold text-slate-900">89</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs md:text-sm text-slate-600">Link Clicks</p>
                    <p className="text-base md:text-lg lg:text-[18px] font-bold text-slate-900">156</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Analytics Highlight */}
          <div className="lg:w-1/2 flex flex-col justify-center space-y-5 md:space-y-7 text-center lg:text-left">
            <div className="space-y-3 md:space-y-[21px]">
              <h2 className="text-2xl md:text-3xl lg:text-[31.5px] font-bold text-slate-950 leading-[1.27]">
                Analytics Highlight:
              </h2>
              <p className="text-xs md:text-sm lg:text-[14.9px] text-[#155DFC] leading-relaxed">
                See how people interact with your digital card from taps and
                clicks to saved contacts.
              </p>
            </div>
            <div className="flex gap-4 md:gap-[21px] pt-2 md:pt-[10px] justify-center lg:justify-start">
              <div className="flex-1">
                <div className="text-lg md:text-2xl lg:text-[18.4px] font-bold text-[#6366F1]">
                  300%
                </div>
                <div className="text-xs md:text-sm text-slate-500 mt-1 md:mt-[6px]">
                  Higher engagement
                </div>
              </div>
              <div className="flex-1">
                <div className="text-lg md:text-2xl lg:text-[19.5px] font-bold text-[#06B6D4]">
                  95%
                </div>
                <div className="text-xs md:text-sm text-slate-500 mt-1 md:mt-[6px]">
                  Cost reduction
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Who Are We? Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
            {/* Left Column - Company Info */}
            <div className="lg:w-1/2 space-y-4 md:space-y-6 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[31.5px] font-bold text-slate-900 leading-[1.11]">
                Who Are We?
              </h2>
              <p className="text-xs md:text-sm lg:text-[14.9px] text-slate-500 leading-[1.71]">
                We're a small team of designers and engineers on a mission to
                modernize professional networking. PesoCard started with one
                simple idea: networking should be effortless, memorable and
                measurable.
              </p>
              <p className="text-xs md:text-sm lg:text-[14.9px] text-slate-500 leading-[1.71]">
                We believe that first impressions matter, and your digital
                identity should move as fast as you do. Our mission is to help
                individuals and businesses share contact information instantly,
                eliminate outdated paper cards, and embrace a sustainable,
                contactless networking experience.
              </p>
              {/* Team Member Photos */}
              <div className="flex items-center gap-2 pt-2 md:pt-4 justify-center lg:justify-start">
                <div className="relative w-[35px] h-[35px]">
                  <img
                    src={teamMember1}
                    alt="Team member"
                    className="w-full h-full rounded-full border-2 border-white"
                  />
                </div>
                <div className="relative w-[35px] h-[35px]">
                  <img
                    src={teamMember2}
                    alt="Team member"
                    className="w-full h-full rounded-full border-2 border-white"
                  />
                </div>
                <div className="w-[35px] h-[35px] rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center">
                  <span className="text-[11.7px] font-bold text-white">+5</span>
                </div>
              </div>
              <div className="space-y-1 pt-2 md:pt-2">
                <h4 className="text-xs md:text-sm lg:text-[13.8px] font-bold text-slate-900">
                  Our Leadership Team
                </h4>
                <p className="text-xs md:text-sm lg:text-[11.5px] text-slate-500">
                  Former executives from Google, Apple, Microsoft
                </p>
              </div>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-6 py-2 rounded-[6.75px] text-xs md:text-sm lg:text-[11.7px] font-normal transition-colors inline-flex items-center gap-2">
                Learn About Our Story
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column - Team Cards */}
            <div className="lg:w-1/2 flex flex-col md:flex-row gap-3 md:gap-[14px]">
              {/* Left Sub-column */}
              <div className="md:flex-1 flex flex-col gap-3 md:gap-[14px]">
                {/* Sarah Chen Card */}
                <div className="bg-white rounded-2xl md:rounded-[12.75px] shadow-lg p-4 md:p-6 space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={teamMember1}
                      alt="Sarah Chen"
                      className="w-8 md:w-[35px] h-8 md:h-[35px] rounded-full flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-xs md:text-sm lg:text-[12.1px] font-bold text-slate-900">
                        Sarah Chen
                      </h4>
                      <p className="text-[10px] md:text-[10.3px] text-slate-500">
                        CEO & Founder
                      </p>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm lg:text-[11.3px] text-slate-600 italic">
                    "This platform has completely transformed how we network at
                    events."
                  </p>
                  <div className="flex gap-1 text-indigo-600 text-xs md:text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs md:text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 gap-3 md:gap-[14px]">
                  <div className="bg-gradient-to-b from-indigo-600 to-purple-600 text-white rounded-2xl md:rounded-[12.75px] p-4 md:p-5">
                    <div className="text-base md:text-lg lg:text-[18px] font-bold">50,000+</div>
                    <div className="text-xs md:text-sm lg:text-[13.3px] opacity-90 mt-1">
                      Active professionals using our platform
                    </div>
                  </div>
                </div>

                {/* Mike Rodriguez Card */}
                <div className="bg-white rounded-2xl md:rounded-[12.75px] shadow-lg p-4 md:p-6 space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={teamMember2}
                      alt="Mike Rodriguez"
                      className="w-8 md:w-[35px] h-8 md:h-[35px] rounded-full flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-xs md:text-sm lg:text-[12.1px] font-bold text-slate-900">
                        Mike Rodriguez
                      </h4>
                      <p className="text-[10px] md:text-[10.5px] text-slate-500">VP Sales</p>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm lg:text-[11.3px] text-slate-600 italic">
                    "The analytics insights have been game-changing for our
                    sales team."
                  </p>
                  <div className="flex gap-1 text-indigo-600 text-xs md:text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs md:text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sub-column */}
              <div className="md:flex-1 flex flex-col gap-3 md:gap-[14px] md:pt-[28px]">
                <div className="bg-gradient-to-b from-cyan-500 to-cyan-600 text-white rounded-2xl md:rounded-[12.75px] p-4 md:p-5">
                  <div className="text-base md:text-2xl lg:text-[20px] font-bold">99.9%</div>
                  <div className="text-xs md:text-sm lg:text-[13.1px] opacity-90 mt-1">
                    Uptime reliability
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-8 xl:px-[200px] bg-white">
        <div className="flex flex-col gap-8 md:gap-14">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 md:gap-5 px-4 sm:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal text-slate-900 text-center">
              Get in Touch
            </h2>
            <p className="text-xs md:text-sm lg:text-[13.7px] text-slate-500 text-center max-w-[600px] leading-relaxed">
              Have questions about PesoCard? We're here to help. Send us a
              message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Form and Contact Info */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-14 justify-center">
            {/* Contact Form */}
            <div className="w-full lg:w-auto bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-[42px] lg:min-w-[488px]">
              <h3 className="text-xl md:text-2xl lg:text-[24px] font-normal text-slate-950 mb-4 md:mb-7">
                Send us a Message
              </h3>
              <form className="space-y-4 md:space-y-[21px]">
                {/* Full Name */}
                <div className="space-y-1 md:space-y-[7px]">
                  <label className="text-xs md:text-sm font-normal text-slate-800">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 md:px-[17px] py-3 md:py-4 rounded-xl md:rounded-[10px] border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm md:text-[14.6px] text-slate-900 placeholder:text-slate-400"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1 md:space-y-[7px]">
                  <label className="text-xs md:text-sm font-normal text-slate-800">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 md:px-[17px] py-3 md:py-4 rounded-xl md:rounded-[10px] border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm md:text-[14px] text-slate-900 placeholder:text-slate-400"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1 md:space-y-[7px]">
                  <label className="text-xs md:text-sm font-normal text-slate-800">
                    Subject *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 md:px-[17px] py-3 md:py-4 rounded-xl md:rounded-[10px] border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm md:text-[14.4px] text-slate-900 placeholder:text-slate-400"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1 md:space-y-[7px] pb-0 md:pb-2">
                  <label className="text-xs md:text-sm font-normal text-slate-800">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 md:px-[17px] py-3 md:py-[13px] rounded-xl md:rounded-[10px] border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-sm md:text-[14.3px] text-slate-900 placeholder:text-slate-400"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                {/* Button */}
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 md:py-[13.5px] rounded-xl md:rounded-[10px] text-sm md:text-[14.6px] font-normal transition-all shadow-md">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info Cards */}
            <div className="w-full lg:w-auto lg:min-w-[380px] flex flex-col gap-4 md:gap-6">
              {/* Phone Card */}
              <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-[16px] shadow-md p-4 md:p-7">
                <div className="flex items-start gap-3 md:gap-3.5">
                  <div className="w-12 md:w-14 h-12 md:h-14 rounded-lg md:rounded-[14px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 md:w-6 h-5 md:h-6 text-blue-700" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-sm md:text-base lg:text-[17px] font-normal text-slate-900 mb-1 md:mb-2">
                      Phone
                    </h4>
                    <p className="text-xs md:text-sm lg:text-[13.3px] text-slate-600 mb-1 md:mb-1.5">
                      +1 (555) 123-4567
                    </p>
                    <p className="text-xs md:text-sm lg:text-[12.7px] text-slate-500">
                      Mon-Fri, 9AM-6PM EST
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-[16px] shadow-md p-4 md:p-7">
                <div className="flex items-start gap-3 md:gap-3.5">
                  <div className="w-12 md:w-14 h-12 md:h-14 rounded-lg md:rounded-[14px] bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 md:w-6 h-5 md:h-6 text-cyan-700" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-sm md:text-base lg:text-[17px] font-normal text-slate-900 mb-1 md:mb-2">
                      Email
                    </h4>
                    <p className="text-xs md:text-sm lg:text-[12.9px] text-slate-600 mb-1 md:mb-1.5">
                      hello@pesocard.com
                    </p>
                    <p className="text-xs md:text-sm lg:text-[13px] text-slate-600">
                      support@pesocard.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Card */}
              <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-[16px] shadow-md p-4 md:p-7">
                <div className="flex items-start gap-3 md:gap-3.5">
                  <div className="w-12 md:w-14 h-12 md:h-14 rounded-lg md:rounded-[14px] bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 md:w-6 h-5 md:h-6 text-purple-700" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-sm md:text-base lg:text-[17px] font-normal text-slate-900 mb-1 md:mb-2">
                      Office
                    </h4>
                    <p className="text-xs md:text-sm lg:text-[13.3px] text-slate-600 leading-relaxed">
                      123 Business Avenue
                      <br />
                      Suite 100
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </div>

              {/* Follow Us Card */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl md:rounded-2xl lg:rounded-[16px] shadow-md p-4 md:p-7">
                <h4 className="text-sm md:text-base lg:text-[17px] font-normal text-white mb-2 md:mb-3.5">
                  Follow Us
                </h4>
                <div className="flex gap-2 md:gap-3">
                  <button className="w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-[10px] bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white">
                    <Twitter className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                  <button className="w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-[10px] bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white">
                    <Linkedin className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                  <button className="w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-[10px] bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white">
                    <Facebook className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                  <button className="w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-[10px] bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white">
                    <Instagram className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-96 py-12 md:py-16 lg:py-20 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
              {/* Heading */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                Get Started Today!
              </h2>

              {/* Description */}
              <p className="text-xs md:text-sm lg:text-base text-white/90 leading-relaxed">
                Join thousands of professionals who've already transformed their
                networking. Create your digital business card in under 60
                seconds.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4">
                <Button className="bg-white text-indigo-600 hover:bg-slate-50 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-all shadow-lg text-sm md:text-base">
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-white/20">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <div className="text-xs md:text-sm text-white/80 flex items-center gap-2 justify-center">
                    <span className="text-base md:text-lg">✓</span> Free trial plan
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <div className="text-xs md:text-sm text-white/80 flex items-center gap-2 justify-center">
                    <span className="text-base md:text-lg">✓</span> No credit card required
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <div className="text-xs md:text-sm text-white/80 flex items-center gap-2 justify-center">
                    <span className="text-base md:text-lg">✓</span> Done in 60 seconds
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="space-y-2 md:space-y-3 pt-2">
                <div className="flex justify-center gap-1 text-yellow-300 text-lg md:text-xl">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-white/90 font-medium">
                  4.9k from 2,000+ reviews
                </p>
                <p className="text-xs md:text-sm text-white/70">
                  50,000+ professionals trust us with their digital cards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-6 md:pt-10 pb-4 md:pb-8 text-center text-slate-400 text-xs md:text-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} PesoCard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
