"use client";

import Aos from "aos";
import { useEffect } from "react";
import { PT_Sans } from 'next/font/google'

import "aos/dist/aos.css";
import "@/styles/index.scss";
import ScrollToTop from "@/components/common/ScrollTop";


const myFont = PT_Sans({ weight: "700", subsets: ["cyrillic"] });

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

export default function RootLayout({ children }) {
  useEffect(() => {
    Aos.init({
      duration: 1200,
    });
  }, []);
  return (
    <html lang="en" className={myFont.className}>
      <body>
        <div className="main-page-wrapper">
          {children}
          <ScrollToTop />
        </div>
      </body>
    </html>
    
  );
}
