import React from "react";

export function Passport(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M12 13v3" />
      <path d="M8 19h8" />
    </svg>
  );
}
