import background from "@/assets/backgroundStadium.jpg";
import premierLeagueBall from "@/assets/premierLeagueBall.png";
import baseball from "@/assets/baseball.png";
import nflFootballSide from "@/assets/nflFootballSide.png";
import championsLeagueBall from "@/assets/championsLeagueBall.png";
import basketBall from "@/assets/basketBall.png";
import Image from "next/image";
import React from "react";

export const Rings = React.memo(() => {
    return (
        <div className="absolute top-1/2 left-1/2 w-[51.375rem] aspect-square border border-neutral-800/13 rounded-full -translate-x-1/2 -translate-y-1/2">
        <div className="absolute top-1/2 left-1/2 w-[36.125rem] aspect-square border border-neutral-800/13 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-[23.125rem] aspect-square border border-neutral-800/13 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
    );
});
  
export const SideLines = React.memo(() => {
    return (
        <>
        <div className="absolute top-0 left-5 w-0.25 h-full bg-neutral-800"></div>
        <div className="absolute top-0 right-5 w-0.25 h-full bg-neutral-800"></div>
        </>
    );
});

export const BackgroundCircles = React.memo(() => {
    return (
        <>
        <div className="absolute top-[4.4rem] left-16 w-3 h-3 bg-gradient-to-b from-[#DD734F] to-[#1A1A32] rounded-full"></div>
        <div className="absolute top-[12.6rem] right-16 w-3 h-3 bg-gradient-to-b from-[#B9AEDF] to-[#1A1A32] rounded-full"></div>
        <div className="absolute top-[26.8rem] left-12 w-6 h-6 bg-gradient-to-b from-[#88E5BE] to-[#1A1A32] rounded-full"></div>
        </>
    );
});

export const BackgroundBalls = React.memo(() => {
  return (
      <>
          <div className="absolute top-[4rem] left-18 w-6 h-6 opacity-[.6]">
              <Image
                  src={championsLeagueBall}
                  alt="Premier League Ball"
                  width={36}
                  height={36}
                  priority
              />
          </div>
          <div className="absolute top-[6rem] right-25 w-6 h-6 opacity-[.6]">
              <Image
                  src={basketBall}
                  alt="NBA Basketball"
                  width={36}
                  height={36}
                  priority
              />
          </div>
          <div className="absolute top-[25.5rem] left-12 w-10 h-10 opacity-[.6]">
              <Image
                  src={nflFootballSide}
                  alt="NFL Football Ball"
                  width={36}
                  height={36}
                  priority
              />
          </div>
          <div className="absolute top-[20rem] right-13 w-6 h-6 opacity-[.6]">
              <Image
                  src={premierLeagueBall}
                  alt="Premier League Ball"
                  width={36}
                  height={36}
                  priority
              />
          </div>
          <div className="absolute top-[36rem] right-22 w-6 h-6 opacity-[.6]">
              <Image
                  src={baseball}
                  alt="BaseBall"
                  width={36}
                  height={36}
                  priority
              />
          </div>
      </>
  );
});

export const HamburgerMenu = () => {
    return (
      <div className="absolute inset-0 pointer-events-none lg:hidden z-30">
        {/* Solid background layer to block main page content */}
        <div className="absolute inset-0 bg-n-8"></div>
        
        {/* Your background image on top of the solid background */}
        <div className="absolute inset-0 opacity-30">
          <Image
            className="w-full h-full object-cover"
            src={background}
            width={688}
            height={953}
            alt=""
          />
        </div>
        <Rings />
        <SideLines />
        <BackgroundBalls />
      </div>
    );
  };