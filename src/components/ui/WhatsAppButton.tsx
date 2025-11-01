"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { COMPANY_INFO } from "../../lib/navigation";

// Custom CSS for WhatsApp pulse animation (lebih subtle)
const pulseStyle = `
  @keyframes whatsapp-pulse {
    0% { transform: scale(1); opacity: 0.18; }
    50% { transform: scale(1.25); opacity: 0.06; }
    100% { transform: scale(1); opacity: 0.18; }
  }
`;

export function WhatsAppButton() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pulseStyle }} />
      <div className="fixed bottom-6 right-4 z-50 transition-all duration-300">
      <Link 
        href={COMPANY_INFO.whatsapp}
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative"
      >
        {/* Pulse Animation Background (aktif saat hover, lebih lambat dan halus) */}
        <div 
          className="absolute inset-0 bg-green-400 rounded-full opacity-15 group-hover:opacity-25 transition-opacity duration-500"
          style={{
            animation: 'whatsapp-pulse 3.5s ease-in-out infinite',
            animationPlayState: 'paused'
          }}
        ></div>
        
        {/* Main Button */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transform transition-all duration-300 cursor-pointer flex items-center gap-2"
             onMouseEnter={(e) => {
               const el = (e.currentTarget.parentElement as HTMLElement)?.querySelector('div');
               if (el) (el as HTMLElement).style.animationPlayState = 'running';
             }}
             onMouseLeave={(e) => {
               const el = (e.currentTarget.parentElement as HTMLElement)?.querySelector('div');
               if (el) (el as HTMLElement).style.animationPlayState = 'paused';
             }}
        >
          <Image 
            src="/images/whatsapp.svg" 
            alt="WhatsApp" 
            width={20} 
            height={20} 
            className="w-5 h-5 brightness-0 invert"
          />
          <span className="text-sm font-medium whitespace-nowrap">Chat via WhatsApp</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none max-w-[140px] text-center">
          Respon Lebih Cepat
          <div className="absolute top-full right-3 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900"></div>
        </div>
      </Link>
      </div>
    </>
  )
}
