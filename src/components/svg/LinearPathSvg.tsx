
const LinearPathSvg = ({checked}: {
    checked: boolean,
}) => {
    return (
        <svg fill="none" viewBox="0 0 24 24" className={`size-6 duration-100 ${checked?"text-[#3859ff]":"text-black group-hover/toolItem:text-[#314cd9]"}`} aria-hidden="true" role="presentation" focusable="false"
             data-testid="svg-icon" xmlns="http://www.w3.org/2000/svg">
            <path xmlns="http://www.w3.org/2000/svg" strokeWidth="2" stroke="currentColor"
                  d="M13.4097 2.80282L19 18.1762V24C19 24.5523 18.5523 25 18 25H6C5.44771 25 5 24.5523 5 24V18.1762L10.5903 2.80282C11.069 1.48631 12.931 1.4863 13.4097 2.80282Z"></path>
            <path xmlns="http://www.w3.org/2000/svg" strokeWidth="2" stroke="currentColor"
                  d="M8.57141 9H15.4286"></path>
        </svg>
    )
}

export default LinearPathSvg;