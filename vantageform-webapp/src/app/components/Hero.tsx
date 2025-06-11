'use client'

import Image from "next/image";
import { useRef } from "react";

import grassPitch from "@/assets/grassPitch.jpg"; 
import Button from "@/components/Button";
import Section from "@/components/Section";
import dynamic from "next/dynamic";
import CurvedUnderline from "@/assets/svg/CurvedUnderline";

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
        <div className="relative max-w-[62rem] mx-auto text-center mb-1 md:mb-10 lg:mb-[1.25rem]">
          <h1 className="h1 mb-6 text-white">
            Predict Performance. <br /> Gain the Edge. <br />
            <span className="relative inline-block mt-2">
              VantageForm.
              <CurvedUnderline stroke="white" />
            </span>

          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-color-1 lg:mb-8">
            Unlock the future of sports analytics with AI-powered projections. VantageForm lets you simulate player performance using advanced models and real data.
          </p>
          <Button href="/pricing" white className={"z-1"} onClick={undefined} px={undefined}>
            Get started
          </Button>
        </div>

        <div className="relative w-full h-[100vh] z-2 sm:-mt-64 md:-mt-30 lg:-mt-40 overflow-visible">
          <div className="absolute inset-0 overflow-visible">
            <Scene/>
          </div>
        </div>


      </div>
    </Section>
  );
};

export default Hero;
