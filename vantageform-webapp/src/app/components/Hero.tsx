'use client'

import Image from "next/image";
import { useRef } from "react";

import grassPitch from "@/assets/grassPitch.jpg"; 
import grassStadium from "@/assets/grassStadium1.jpg"; 
import curve from "@/assets/hero/curve.png"; 
import Button from "@/components/Button";
import Section from "@/components/Section";
import { BackgroundCircles, BottomLine, Gradient } from "@/components/design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import Generating from "@/components/Generating";
import Notification from "@/components/Notification";
import CompanyLogos from "@/components/CompanyLogos";
import dynamic from "next/dynamic";
import SceneWrapper from "./SceneWrapper";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem] bg-n-8 relative overflow-visible"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="absolute top-0 left-0 w-full h-full z-1">
        <Image
          src={grassPitch}
          alt="stadium background"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      <div className="container relative z-10" ref={parallaxRef}>
        <div className="relative max-w-[62rem] mx-auto text-center mb-[1rem] md:mb-10 lg:mb-[1.25rem]">
          <h1 className="h1 mb-6 text-white">
            Predict Performance. <br /> Gain the Edge. <br />
            <span className="block relative">
              VantageForm.
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Unlock the future of sports analytics with AI-powered projections. VantageForm lets you simulate player performance using advanced models and real data.
          </p>
          <Button href="/pricing" white className={undefined} onClick={undefined} px={undefined}>
            Get started
          </Button>
        </div>

        <div className="relative w-full h-[100vh] z-0 -mt-40 overflow-visible">
          <div className="absolute inset-0 overflow-visible">
            <SceneWrapper/>
          </div>
        </div>




      </div>
    </Section>
  );
};

export default Hero;
