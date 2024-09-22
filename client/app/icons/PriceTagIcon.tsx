interface IconProps {
    width?: string;
    height?: string;
    fill?: string;
}

const PriceTagIcon: React.FC<IconProps> = ({
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
            viewBox="0 0 122.88 104.13"
        >
            <path d="M53.09,2.89h.68l.35,0a5.46,5.46,0,0,1,3.69,1.76c13.85,14.72,28,30,41.44,45.06a11.94,11.94,0,0,1,1.54,2.05l.12.21a12.56,12.56,0,0,1,1,2.25,12.84,12.84,0,0,1,.3,7.55,13.17,13.17,0,0,1-4,6.48L62,100.57l-.3.29a13.28,13.28,0,0,1-1.91,1.44l-.18.1a11.78,11.78,0,0,1-2.16,1l-.16.06A12.83,12.83,0,0,1,55,104a13.2,13.2,0,0,1-2.6.09,13.72,13.72,0,0,1-2.56-.38,12.51,12.51,0,0,1-2.4-.9h0a13.57,13.57,0,0,1-2.16-1.34l-.1-.08a13.59,13.59,0,0,1-1.79-1.7L4.48,56.08l-.17-.21A5.52,5.52,0,0,1,3.1,52l.07-.91L0,5.78c0-.22,0-.44,0-.65V5A5.58,5.58,0,0,1,1.61,1.62,5.51,5.51,0,0,1,5.15,0h.73L52.11,3l.44,0,.54,0ZM36.33,40.66l-2.6-2.61a1,1,0,0,1,0-1.42l3-3a1,1,0,0,1,1.42,0l2.72,2.72.14-.09a13.71,13.71,0,0,1,3.15-1.49,11.87,11.87,0,0,1,6.61-.2l.07,0A12.17,12.17,0,0,1,54,35.93a15.46,15.46,0,0,1,2.95,2.34,1,1,0,0,1,0,1.43l-6.49,6.48a1,1,0,0,1-1.42,0,7.75,7.75,0,0,0-1.63-1.3l0,0a2.31,2.31,0,0,0-1.07-.34h-.06a2.46,2.46,0,0,0-.91.17,2.55,2.55,0,0,0-.8.55,2.77,2.77,0,0,0-.46.58,1.54,1.54,0,0,0-.19.48v.05a1.55,1.55,0,0,0,0,.48,1.43,1.43,0,0,0,.13.49,3.56,3.56,0,0,0,.31.58,3.62,3.62,0,0,0,.45.53,3.77,3.77,0,0,0,.56.47,2.29,2.29,0,0,0,.53.25h0a2.06,2.06,0,0,0,.59.11h.06a4.93,4.93,0,0,0,.74-.05A8.26,8.26,0,0,0,48.34,49c.42-.11.88-.26,1.37-.43,1.18-.46,2.28-.85,3.3-1.18s2.12-.65,3.13-.91l.06,0a14.86,14.86,0,0,1,3-.46,12.51,12.51,0,0,1,2.94.2,9.34,9.34,0,0,1,2.92,1.11,13.59,13.59,0,0,1,2.74,2.15,12.85,12.85,0,0,1,2.07,2.68,10.39,10.39,0,0,1,1.11,3,10.75,10.75,0,0,1,.15,3.1,11.71,11.71,0,0,1-.76,3.1,15.51,15.51,0,0,1-1.59,3l-.31.44,3,3a1,1,0,0,1,0,1.42l-3,3c-.39.39-1.6-.18-2-.57L64,69.14c-.56.4-1.13.78-1.72,1.12a14.8,14.8,0,0,1-5,1.75H57.3a11,11,0,0,1-2.69,0,12.69,12.69,0,0,1-2.76-.61l-.05,0A12.26,12.26,0,0,1,49.05,70a17.79,17.79,0,0,1-2.68-2.23,1,1,0,0,1,0-1.43l6.48-6.48a1,1,0,0,1,1.43,0,11.31,11.31,0,0,0,1,.85,5.29,5.29,0,0,0,.86.53l0,0a4.67,4.67,0,0,0,.76.28,2.68,2.68,0,0,0,.66.09,2.51,2.51,0,0,0,.64-.07,2.59,2.59,0,0,0,.57-.2l.06,0a3,3,0,0,0,.54-.33,4.41,4.41,0,0,0,.54-.47,2.5,2.5,0,0,0,.75-1.15,1.86,1.86,0,0,0,0-.52v-.06a1.36,1.36,0,0,0-.11-.43,2.4,2.4,0,0,0-.27-.53,3,3,0,0,0-.41-.49,6.06,6.06,0,0,0-.77-.66l0,0a3.12,3.12,0,0,0-.63-.32l-.07,0a2.21,2.21,0,0,0-.57-.11,3.47,3.47,0,0,0-.77,0h0a6.84,6.84,0,0,0-1,.24c-.39.12-.81.27-1.28.46-1.16.47-2.27.88-3.34,1.25l-.06,0c-1.06.37-2.08.69-3,.95a14.34,14.34,0,0,1-3,.52,11.8,11.8,0,0,1-2.92-.2h-.06a9,9,0,0,1-2.84-1.12,13.52,13.52,0,0,1-2.73-2.17,10.57,10.57,0,0,1-3.24-8.68,12.38,12.38,0,0,1,.71-3.13,15,15,0,0,1,1.56-3c.17-.26.35-.51.53-.75ZM83,100.11a2.7,2.7,0,1,1-3.6-4L115.8,63.55h0A4.75,4.75,0,0,0,117,62a5.15,5.15,0,0,0,.22-3.68,4.83,4.83,0,0,0-1-1.63l0,0-41.36-45a2.7,2.7,0,0,1,4-3.66l41.38,45a1.09,1.09,0,0,1,.1.11,10.38,10.38,0,0,1,2,3.44,10.36,10.36,0,0,1-.46,7.83,10.29,10.29,0,0,1-2.45,3.17h0L83,100.11ZM25.23,15.49a8.34,8.34,0,0,1,3.25.71,8.5,8.5,0,0,1,2.72,1.92h0A8.47,8.47,0,0,1,33,20.91a8.66,8.66,0,0,1,.62,3.31c0,.1,0,.2,0,.3a8.62,8.62,0,0,1-.71,3h0a8.5,8.5,0,0,1-2,2.71l-.16.14a8.78,8.78,0,0,1-2.68,1.67,8.41,8.41,0,0,1-3.21.55h0a8.21,8.21,0,0,1-3.28-.66A8.79,8.79,0,0,1,17,27.18a8.35,8.35,0,0,1-.56-3.29,8.51,8.51,0,0,1,.71-3.3A8.84,8.84,0,0,1,22,16a8.28,8.28,0,0,1,3.27-.55Zm28.31-7c-.27,0-.49,0-.75,0a2.59,2.59,0,0,1-.74,0l-46.41-3L8.8,50.83a2.9,2.9,0,0,1,0,.51l-.08,1L47.59,96a8,8,0,0,0,1,1l.06.05a7.12,7.12,0,0,0,1.22.75h0a7.38,7.38,0,0,0,1.33.48,8.34,8.34,0,0,0,1.51.23,7.53,7.53,0,0,0,1.51,0,7.33,7.33,0,0,0,1.25-.29l.11,0a6.11,6.11,0,0,0,1.13-.53l.12-.07A8,8,0,0,0,58,96.7l.11-.11h0C69.82,85.53,82.93,75.19,94.51,64a7.49,7.49,0,0,0,2.29-3.68,7.25,7.25,0,0,0-.73-5.51l-.1-.16a6.75,6.75,0,0,0-.79-1.07L53.73,8.54Z" />
        </svg>
    );
};

export default PriceTagIcon;
