import React from "react";
import "./style.css";

interface SidebarSubMenuItemProp {
    link: string;
    label: string;
}

interface SidebarItemProps {
    label: string;
    icon: React.ReactNode;
    link?: string | undefined;
    isActive: boolean;
    isExpanded?: boolean;
    submenu?: SidebarSubMenuItemProp[] | false;
}

function SidebarItem({
    label,
    icon,
    link,
    isActive,
    isExpanded = false,
    submenu = false,
}: SidebarItemProps) {
    return (
        <div className="relative overflow-visible sidebar-menu-item">
            {link ? (
                <a
                    href={link}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                        isActive
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-600 text-gray-200"
                    } transition-all duration-200`}
                >
                    {/* Icon */}
                    <span className="w-6 h-6 text-black dark:text-white">
                        {icon}
                    </span>
                </a>
            ) : (
                <p
                    className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                        isActive
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-600 text-gray-200"
                    } transition-all duration-200`}
                >
                    {/* Icon */}
                    <span className="w-6 h-6 text-black dark:text-white">
                        {icon}
                    </span>
                </p>
            )}
            {/* Adjusted z-index for visibility */}
            {submenu ? (
                <div className="absolute ps-3 left-full hidden sidebar-submenu-item top-0 z-10">
                    <div className="py-2 min-w-[160px] bg-gray-900 border-2 border-gray-600 border-dashed">
                        <div className="w-full flex flex-col">
                            {submenu.map((item) => (
                                <a
                                    href={item.link}
                                    key={item.link}
                                    className="py-2 px-4 hover:bg-blue-800 w-full"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default SidebarItem;
