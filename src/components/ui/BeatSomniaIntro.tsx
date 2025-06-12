import React from "react";

const BeatSomniaIntro = () => (
  <div className="w-full flex flex-col items-center justify-center py-16 fadein-intro">
    <div style={{ display: "flex", alignItems: "center", gap: "0rem" }}>
      {/* Rotated moon (facing right) */}
      <svg
        width="112"
        height="112"
        viewBox="0 0 144 144"
        fill="none"
        style={{ display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Moon, mirrored horizontally using transform */}
        <g transform="scale(-1,1) translate(-144,0)">
          <path
            d="M114 72c0-29.823-24.177-54-54-54-7.2 0-14.06 1.397-20.315 3.917C62.366 30.988 78 49.626 78 72c0 22.374-15.634 41.012-38.315 50.083C45.94 126.603 52.8 128 60 128c29.823 0 54-24.177 54-54Z"
            fill="url(#moonGradient)"
          />
        </g>
        <defs>
          <linearGradient id="moonGradient" x1="40" y1="18" x2="130" y2="126" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B2B6FF"/>
            <stop offset="1" stopColor="#6B5DF6"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Checkmark on right, now closer */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path
          d="M12 30L24 42L44 18"
          stroke="#FFD166"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <h1 className="mt-6 text-5xl md:text-6xl font-bold text-white text-center beatsomnia-logo-text">
      BeatSomnia
    </h1>
  </div>
);

export default BeatSomniaIntro;