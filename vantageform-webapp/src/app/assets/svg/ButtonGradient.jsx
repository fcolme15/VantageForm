const ButtonGradient = () => {
  return (
    <svg className="block" width={0} height={0}>
      <defs>
        <linearGradient id="btn-left" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />       {/* white */}
          <stop offset="100%" stopColor="#D1D1D1" />     {/* light gray */}
        </linearGradient>
        <linearGradient id="btn-top" x1="100%" x2="0%" y1="50%" y2="50%">
          <stop offset="0%" stopColor="#F5F5F5" />       {/* near-white gray */}
          <stop offset="100%" stopColor="#CCCCCC" />     {/* medium gray */}
        </linearGradient>
        <linearGradient id="btn-bottom" x1="100%" x2="0%" y1="50%" y2="50%">
          <stop offset="0%" stopColor="#EEEEEE" />       {/* very light gray */}
          <stop offset="100%" stopColor="#BFBFBF" />     {/* balanced gray */}
        </linearGradient>
        <linearGradient
          id="btn-right"
          x1="14.635%"
          x2="14.635%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#E8E8E8" />       {/* soft gray */}
          <stop offset="100%" stopColor="#A0A0A0" />     {/* darker gray */}
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ButtonGradient;
