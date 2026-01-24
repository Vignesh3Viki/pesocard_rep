import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";
import { MdMenu, MdClose } from "react-icons/md";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="mx-auto flex justify-between items-center w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-16 mb-0 h-16 sm:h-20 lg:h-auto py-3 lg:py-6 relative z-50">
      <div className="flex items-center gap-[8px]">
        <img
          src={PesocardLogo}
          alt="PesoCard"
          className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain transition-all duration-300"
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs lg:text-sm xl:text-base font-medium">
        <a href="/" className="hover:text-white/80 transition-colors">
          Home
        </a>
        <a href="/" className="hover:text-white/80 transition-colors">
          About
        </a>
        <a href="/" className="hover:text-white/80 transition-colors">
          What we
        </a>
        <a href="/" className="hover:text-white/80 transition-colors">
          Services
        </a>
        <a href="/" className="hover:text-white/80 transition-colors">
          Testimonials
        </a>
        <Button className="bg-white text-indigo-600 hover:bg-slate-100 rounded-full px-4 lg:px-6 py-2 text-xs lg:text-sm shadow-xl hover:shadow-2xl transition-all">
          Contact us
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-white/80 transition-colors p-1"
        >
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#6366F1] shadow-2xl py-4 sm:py-6 px-4 sm:px-6 flex flex-col gap-3 sm:gap-4 lg:hidden border-t border-white/10 animate-in slide-in-from-top-5">
          <a
            href="/"
            className="text-white font-medium text-sm hover:text-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/"
            className="text-white font-medium text-sm hover:text-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </a>
          <a
            href="/"
            className="text-white font-medium text-sm hover:text-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            What we
          </a>
          <a
            href="/"
            className="text-white font-medium text-sm hover:text-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </a>
          <a
            href="/"
            className="text-white font-medium text-sm hover:text-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Testimonials
          </a>
          <Button className="bg-white text-indigo-600 hover:bg-slate-100 w-full rounded-full text-sm shadow-lg">
            Contact us
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Header;
