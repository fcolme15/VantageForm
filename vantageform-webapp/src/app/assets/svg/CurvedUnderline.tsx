const CurvedUnderline = ({ stroke = "white", className = "" }) => (
  <svg
    className={`absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[100%] w-[120%] h-[12px] ${className}`}
    viewBox="0 0 100 20"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 20 Q50 0 100 20"
      stroke={stroke}
      strokeWidth="4"
      fill="transparent"
    />
  </svg>
);

export default CurvedUnderline;
