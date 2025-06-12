import React from 'react'


const SoccerFormation433 = () => {
    return (
        <div>
            {/* Visual Section */}
            <div className="relative z-20 h-[16rem] bg-neutral-800 rounded-xl overflow-hidden mx-4 mb-4">
                {/* Team Formation Visualization */}
                <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center relative">
                {/* Soccer Field Lines */}
                <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 300 200">
                    <rect x="0" y="0" width="300" height="200" fill="none" stroke="#fff" strokeWidth="2"/>
                    <line x1="150" y1="0" x2="150" y2="200" stroke="#fff" strokeWidth="1"/>
                    <circle cx="150" cy="100" r="40" fill="none" stroke="#fff" strokeWidth="1"/>
                    </svg>
                </div>
            
                {/* Player Dots - 1-4-3-3 Formation */}
                <div className="relative z-10 w-full h-full p-4">
                    {/* Goalkeeper */}
                    <div className="absolute w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ left: '10%', top: '50%' }} />
                    
                    {/* Defense (4 players) */}
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ left: '25%', top: '20%' }} />
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ left: '25%', top: '40%' }} />
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ left: '25%', top: '60%' }} />
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ left: '25%', top: '80%' }} />
                    
                    {/* Midfield (3 players) */}
                    <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ left: '50%', top: '30%' }} />
                    <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ left: '50%', top: '50%' }} />
                    <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ left: '50%', top: '70%' }} />
                    
                    {/* Attack (3 players) */}
                    <div className="absolute w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ left: '75%', top: '30%' }} />
                    <div className="absolute w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ left: '75%', top: '50%' }} />
                    <div className="absolute w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ left: '75%', top: '70%' }} />
                </div>
            </div>

                {/* Floating Analysis Badge */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
                    <span className="text-white text-sm font-semibold">Formation: 4-3-3</span>
                </div>
            </div>
      </div>
      );
  };
  
  export default SoccerFormation433;
  
