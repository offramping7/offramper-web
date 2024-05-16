"use client";

import Aos from "aos";
import { useEffect } from "react";

import "aos/dist/aos.css";
import "@/styles/index.scss";
import ScrollToTop from "@/components/common/ScrollTop";


// const myFont = PT_Sans({ weight: "700", subsets: ["cyrillic"],style: ['normal'] });
// const myFont2 = Inter({ weight: "700", subsets: ["latin"] });
// import localFont from "next/font/local";
// const customFont = localFont({ src: "../public/fonts/ptsans/PTSans-Regular.ttf" });

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
    <html lang="en">
      <body>
        <div className="main-page-wrapper">
          {children}
          <ScrollToTop />
        </div>
      </body>
    </html>
    
  );
}
