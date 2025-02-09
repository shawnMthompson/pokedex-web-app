"use client";

import { FaArrowUpLong } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function UpButton() {
  const [isVisible, setIsVisible] = useState(false);

  // When the page is scrolled down, toggle visibility...
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    // Set to a fixed position (Bottom Right)
    <div className="fixed bottom-4 right-4 lg:bottom-24 lg:right-24">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-cardBase text-white p-3 rounded-full shadow-lg focus:outline-none cursor-pointer border-2 border-cardShadow"
        >
          <FaArrowUpLong />
        </button>
      )}
    </div>
  );
}
