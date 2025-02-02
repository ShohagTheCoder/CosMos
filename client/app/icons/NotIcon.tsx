interface IconProps {
    width?: string;
    height?: string;
    fill?: string;
}

const NotIcon: React.FC<IconProps> = ({
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
            enable-background="new 0 0 122.88 122.88"
            viewBox="0 0 122.88 122.88"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M61.44,0c33.926,0,61.44,27.514,61.44,61.44c0,33.926-27.514,61.439-61.44,61.439 C27.513,122.88,0,95.366,0,61.44C0,27.514,27.513,0,61.44,0L61.44,0z M98.505,37.049L37.051,98.503 c6.999,4.617,15.379,7.307,24.389,7.307c24.5,0,44.369-19.869,44.369-44.369C105.809,52.431,103.119,44.05,98.505,37.049 L98.505,37.049L98.505,37.049z M24.378,85.829l61.453-61.454c-6.997-4.615-15.381-7.304-24.391-7.304 c-24.5,0-44.369,19.87-44.369,44.369C17.072,70.449,19.761,78.83,24.378,85.829L24.378,85.829L24.378,85.829z"
            />
        </svg>
    );
};

export default NotIcon;
