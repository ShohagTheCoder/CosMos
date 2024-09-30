import React from "react";
// import { Tooltip } from "react-tooltip"; // Optional for handling popups if you want a custom one
import "./style.css";

interface SidebarItemProps {
    label: string;
    icon: React.ReactNode;
    link: string;
    isActive: boolean;
    isExpanded?: boolean;
}

function SidebarItem({
    label,
    icon,
    link,
    isActive,
    isExpanded = false,
}: SidebarItemProps) {
    return (
        <div className="relative group flex items-center">
            <a
                href={link}
                className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                    isActive
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-600 text-gray-200"
                } transition-all duration-200`}
            >
                {/* Icon */}
                <span className="w-6 h-6">{icon}</span>

                {/* Label (Visible only when expanded) */}
                {isExpanded && <span className="ml-2 text-sm">{label}</span>}
            </a>
        </div>
    );
}

export default SidebarItem;
