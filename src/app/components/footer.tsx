"use client";

import Link from "next/link";
import { Instagram, Mail, Phone, Facebook } from "lucide-react";

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm0 5h1v-1H9v1zm3-3h1v-1h-1v1zm3-3h1v-1h-1v1zm0 5h1v-1h-1v1z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 py-8 mt-auto pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About */}
        <div className="space-y-4 text-center md:text-left">
          <h4 className="text-xl font-bold">ABOUT US</h4>
          <p className="text-gray-300 leading-relaxed">
            Born from the vision of a creator whose spirit still guides us, Niche Club blends cosmic energy with street-certified style.
          </p>
        </div>

        {/* Social Media */}
        <div className="space-y-4 text-center md:text-left">
          <h4 className="text-xl font-bold">SOCIAL MEDIA</h4>
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <Link
              href="https://www.instagram.com/nicheclub.us"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Instagram size={16} />
              Instagram
            </Link>
            <Link
              href="https://www.facebook.com/share/1Fj3kzvoEx/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Facebook size={16} />
              Facebook
            </Link>
            <Link
              href="https://wa.me/19347991588"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <WhatsAppIcon />
              WhatsApp
            </Link>
          </div>
        </div>

        {/* Support & Links */}
        <div className="space-y-4 text-center md:text-left">
          <h4 className="text-xl font-bold">SUPPORT</h4>
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <Link 
              href="tel:+19347991588" 
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Phone size={16} />
              +1 934-799-1588
            </Link>
            <Link 
              href="mailto:contact@nicheclub.us" 
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Mail size={16} />
              contact@nicheclub.us
            </Link>
          </div>

          <h4 className="text-xl font-bold pt-4">POLICIES</h4>
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <Link href="/privacypolicy" className="block text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookiepolicy" className="block text-blue-400 hover:text-blue-300 transition-colors">
              Cookie Policy
            </Link>
            <Link href="/returnexchange" className="block text-blue-400 hover:text-blue-300 transition-colors">
              Return & Exchange
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
        © {new Date().getFullYear()} Niche Club. All rights reserved <br /> Created By Neuromotiontech.com.
      </div>
    </footer>
  );
}