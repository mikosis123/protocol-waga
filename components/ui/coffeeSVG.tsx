import React from "react";

export const CoffeeSvg: React.FC = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer bean */}
      <path
        d="M12 2C15.866 2 20 6.477 20 12C20 17.523 15.866 22 12 22C8.13401 22 4 17.523 4 12C4 6.477 8.13401 2 12 2Z"
        fill="#6D4C41"
      />
      {/* Crack line */}
      <path
        d="M11.5 4C12.5 6 14 9.5 14 12.5C14 15.5 12.5 18 11.5 20"
        stroke="#3E2723"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
