import React from "react";
import "./style.css";

// Define a type for the icon names
type IconType = "home" | "settings" | "products" | "user" | "sell";

interface IconProps {
    type: IconType;
}

const Icon: React.FC<IconProps> = ({ type }) => {
    const icons: Record<IconType, string> = {
        home: "🏠", // Home icon
        settings: "⚙️", // Settings icon
        products: "🛒", // Products icon
        user: "👤", // User icon
        sell: "💸", // Sell icon
    };

    return (
        <span style={{ fontSize: "20px" }} title={type}>
            {icons[type]}
        </span>
    );
};

export default Icon;
