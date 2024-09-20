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

const SellIcon: React.FC<IconProps> = ({
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
            <path d="M 20.5 4 C 18.032499 4 16 6.0324991 16 8.5 L 16 17.5 C 16 19.967501 18.032499 22 20.5 22 L 33.5 22 C 35.967501 22 38 19.967501 38 17.5 L 38 8.5 C 38 6.0324991 35.967501 4 33.5 4 L 20.5 4 z M 20.5 7 L 33.5 7 C 34.346499 7 35 7.6535009 35 8.5 L 35 17.5 C 35 18.346499 34.346499 19 33.5 19 L 20.5 19 C 19.653501 19 19 18.346499 19 17.5 L 19 8.5 C 19 7.6535009 19.653501 7 20.5 7 z M 24.5 10 A 1.50015 1.50015 0 1 0 24.5 13 L 29.5 13 A 1.50015 1.50015 0 1 0 29.5 10 L 24.5 10 z M 41.613281 22.017578 C 40.493208 22.027378 39.429017 22.472076 38.484375 23.173828 A 1.50015 1.50015 0 0 0 38.482422 23.173828 C 37.471119 23.92627 34.418828 26.207124 31.777344 28.179688 C 31.204622 26.351508 29.505924 25 27.5 25 L 23.107422 25 C 20.296203 25 18.983693 24.772225 17.857422 24.533203 C 16.731151 24.294181 15.646328 24 13.826172 24 C 9.9413941 24 7.0123317 26.492986 5.09375 28.791016 C 3.1751683 31.089045 2.1347656 33.384766 2.1347656 33.384766 A 1.5002787 1.5002787 0 1 0 4.8652344 34.628906 C 4.8652344 34.628906 5.7643161 32.669814 7.3964844 30.714844 C 9.0286527 28.759873 11.25995 27 13.826172 27 C 15.347016 27 16.004646 27.205819 17.234375 27.466797 C 18.464104 27.727775 20.123641 28 23.107422 28 L 27.5 28 C 28.346499 28 29 28.653501 29 29.5 C 29 29.969499 28.794195 30.374296 28.470703 30.646484 C 28.470416 30.646699 28.429688 30.677734 28.429688 30.677734 A 1.5001988 1.5001988 0 0 0 28.345703 30.748047 A 1.5001988 1.5001988 0 0 0 28.34375 30.75 C 28.105295 30.908613 27.816466 31 27.5 31 L 20.5 31 A 1.50015 1.50015 0 1 0 20.5 34 L 27.5 34 C 28.440637 34 29.315307 33.701451 30.041016 33.199219 C 30.042186 33.198409 30.043753 33.198076 30.044922 33.197266 A 1.5001988 1.5001988 0 0 0 30.224609 33.082031 C 30.224609 33.082031 38.773565 26.697983 40.273438 25.582031 C 40.837795 25.162783 41.307495 25.020488 41.638672 25.017578 C 41.969848 25.014678 42.217841 25.096748 42.560547 25.439453 C 43.151944 26.030851 43.148387 26.933645 42.572266 27.533203 C 37.217133 32.036197 33.848465 35.036886 31.623047 36.794922 C 29.369928 38.574877 28.424996 39 27.5 39 C 23.84682 39 19.799731 38 15.5 38 C 13 38 11.242781 39.343609 10.300781 40.599609 C 9.3587815 41.855609 9.0449219 43.136719 9.0449219 43.136719 A 1.50015 1.50015 0 1 0 11.955078 43.863281 C 11.955078 43.863281 12.141219 43.144391 12.699219 42.400391 C 13.257219 41.656391 14 41 15.5 41 C 19.306269 41 23.33518 42 27.5 42 C 29.402004 42 31.084837 41.044435 33.482422 39.150391 C 35.850215 37.279881 39.175564 34.309406 44.5 29.832031 A 1.50015 1.50015 0 0 0 44.681641 29.681641 C 44.688541 29.674741 44.690436 29.665143 44.697266 29.658203 L 44.701172 29.662109 L 44.753906 29.607422 A 1.50015 1.50015 0 0 0 45.083984 29.074219 C 46.329745 27.321594 46.247957 24.882723 44.681641 23.316406 C 43.852346 22.487112 42.733355 22.007738 41.613281 22.017578 z"></path>
        </svg>
    );
};

export default SellIcon;