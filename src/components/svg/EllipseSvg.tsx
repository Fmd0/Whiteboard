

const EllipseSvg = ({checked}: {
    checked: boolean,
}) => {
    return (

        <svg className={`size-6 duration-100 ${checked ? "text-[#3859ff]" : "text-black group-hover/toolItem:text-[#314cd9]"}`}
             stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
             strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12c0 -3.314 4.03 -6 9 -6s9 2.686 9 6s-4.03 6 -9 6s-9 -2.686 -9 -6z"></path>
        </svg>
    )
}

export default EllipseSvg;