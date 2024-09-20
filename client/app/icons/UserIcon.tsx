<svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="50"
    height="50"
    viewBox="0 0 48 48"
></svg>;
interface IconProps {
    width?: string;
    height?: string;
    fill?: string;
}

const UserIcon: React.FC<IconProps> = ({
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
            viewBox="0 0 48 48"
        >
            <path d="M 24 4 C 18.494917 4 14 8.494921 14 14 C 14 19.505079 18.494917 24 24 24 C 29.505083 24 34 19.505079 34 14 C 34 8.494921 29.505083 4 24 4 z M 24 7 C 27.883764 7 31 10.116238 31 14 C 31 17.883762 27.883764 21 24 21 C 20.116236 21 17 17.883762 17 14 C 17 10.116238 20.116236 7 24 7 z M 12.5 28 C 10.032499 28 8 30.032499 8 32.5 L 8 33.699219 C 8 36.640082 9.8647133 39.277974 12.708984 41.091797 C 15.553256 42.90562 19.444841 44 24 44 C 28.555159 44 32.446744 42.90562 35.291016 41.091797 C 38.135287 39.277974 40 36.640082 40 33.699219 L 40 32.5 C 40 30.032499 37.967501 28 35.5 28 L 12.5 28 z M 12.5 31 L 35.5 31 C 36.346499 31 37 31.653501 37 32.5 L 37 33.699219 C 37 35.364355 35.927463 37.127823 33.677734 38.5625 C 31.428006 39.997177 28.068841 41 24 41 C 19.931159 41 16.571994 39.997177 14.322266 38.5625 C 12.072537 37.127823 11 35.364355 11 33.699219 L 11 32.5 C 11 31.653501 11.653501 31 12.5 31 z"></path>
            ;
        </svg>
    );
};

export default UserIcon;
