import React from "react";
import { Animated3dLogo } from "./Animated3dLogo";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  showStatus?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const BrandLogo = ({
  size = "md",
  showStatus = true,
  className = "",
  onClick,
}: BrandLogoProps) => {
  return (
    <Animated3dLogo
      size={size}
      showStatus={showStatus}
      className={className}
      onClick={onClick}
    />
  );
};

export default BrandLogo;
