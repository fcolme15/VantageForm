import React from 'react'


const OrbitBalls = () => {
    return (
        <div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                <div className="w-8 h-8 bg-white/20 rounded-full" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
                <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
            </div>
      </div>
      );
  };
  
  export default OrbitBalls;
  