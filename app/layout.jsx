"use client";

import Aos from "aos";
import { useEffect } from "react";
import { PT_Sans,Inter } from 'next/font/google'

import "aos/dist/aos.css";
import "@/styles/index.scss";
import ScrollToTop from "@/components/common/ScrollTop";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

const myFont = PT_Sans({ weight: "700", subsets: ["cyrillic"],style: ['normal'] });
const myFont2 = Inter({ weight: "700", subsets: ["latin"] });

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
