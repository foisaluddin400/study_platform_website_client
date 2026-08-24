"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  statusIndicator?: "online" | "busy" | "away" | "offline";
}

export const getResolvedImageUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const BACKEND_BASE =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
    "http://localhost:5000";

  return `${BACKEND_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

export function Avatar({
  src,
  name,
  size = "md",
  className,
  statusIndicator,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const indicatorSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
  };

  const indicatorColors = {
    online: "bg-emerald-500",
    busy: "bg-rose-500",
    away: "bg-amber-500",
    offline: "bg-slate-400",
  };

  const resolvedSrc = getResolvedImageUrl(src);
  const showImage = Boolean(resolvedSrc && !hasError);

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-semibold select-none transition-all",
          showImage
            ? "bg-slate-100"
            : "bg-slate-100 border border-slate-200/80 text-slate-400 shadow-2xs",
          sizeClasses[size],
          className
        )}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedSrc}
            alt={name || "User Avatar"}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <User className={cn("text-slate-400 shrink-0", iconSizes[size])} />
        )}
      </div>

      {statusIndicator && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-white",
            indicatorSizes[size],
            indicatorColors[statusIndicator]
          )}
        />
      )}
    </div>
  );
}
