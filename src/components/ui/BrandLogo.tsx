import React from "react";
import { Animated3dLogo } from "./Animated3dLogo";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  showStatus?: boolean;
  showWordmark?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const BrandLogo = ({
  size = "md",
  showStatus = true,
  showWordmark = true,
  className = "",
  onClick,
}: BrandLogoProps) => {
  return (
    <Animated3dLogo
      size={size}
      showStatus={showStatus}
      showWordmark={showWordmark}
      className={className}
      onClick={onClick}
    />
  );
};

export default BrandLogo;
