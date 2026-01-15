import React from "react";
import { buttonClass } from "../utils/buttonClass";
import { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isActive?: boolean;
  icon?: LucideIcon;
  children?: React.ReactNode;
  label?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  icon: Icon,
  children,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${buttonClass(isActive)} flex items-center justify-center p-2`}
      type="button"
      aria-label={label}
      title={label}
    >
      {Icon ? <Icon className="h-4 w-4" /> : children}
    </button>
  );
};

export default ToolbarButton;
