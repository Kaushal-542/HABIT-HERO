import React from "react";

// components/DottedWaveLine.js
const DottedWaveLine = ({ color = "#3b82f6", height = 40, dashArray = "5,10" }) => {
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 500 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,50 C150,0 350,100 500,50"
        fill="none"
        stroke={color}
        // strokeWidth="3"
        // strokeDasharray={dashArray}
        strokeWidth="4"
        strokeDasharray="15,20"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default DottedWaveLine;

