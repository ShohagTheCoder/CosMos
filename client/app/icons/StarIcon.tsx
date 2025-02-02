import React from "react";

interface IconProps {
    width?: string;
    height?: string;
    fill?: string;
}

const StarIcon: React.FC<IconProps> = ({
    width = "24",
    height = "24",
    fill = "currentColor",
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width={width}
            height={height}
            fill={fill}
            viewBox="0 0 122.88 117.19"
        >
            <path d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z" />
        </svg>
    );
};

export default StarIcon;
