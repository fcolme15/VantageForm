'use client'
import React from 'react'
import Section from "@/components/Section";
import OrbitBalls from '@/assets/svg/OrbitBalls'
import barChart from "@/assets/StatsBarChart.png"
import { ScrollParallax } from "react-just-parallax";
import Image from 'next/image';
import Button from './Button';

function About() {

  return (
    <Section
      className="bg-gradient-to-b from-n-7 to-n-8 relative overflow-hidden"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="about"
    >
      <div className="container md:pb-10 relative z-10">
        {/* Floating Background Orb Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top left gradient orb with parallax */}
          <ScrollParallax strength={0.3}>
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-xl animate-pulse" />
          </ScrollParallax>
          
          {/* Top right gradient orb */}
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-400/30 to-teal-500/30 rounded-full blur-lg animate-pulse" 
               style={{ animationDelay: '1s' }} />
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center min-h-[70vh] py-16">
          
          {/* Left Side */}
          <div className="lg:col-span-2 relative">
            <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-n-7 to-n-6 border border-n-6">
              
              <div className="absolute inset-4 z-10">
                <div className="relative h-full bg-black rounded-xl border border-n-5 overflow-hidden">
                  
                  {/* Stats Image in Card*/}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                  <ScrollParallax strength={0.1}>
                    <div className="relative w-full  h-full">
                      <Image
                        src={barChart}
                        alt="Bar Chart"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </ScrollParallax>
                    
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Stats Cards*/}
            <div className="absolute -right-4 top-8 z-50">
              <ScrollParallax strength={-0.2}>
                <div className="bg-n-6 border border-n-5 rounded-lg p-3 shadow-lg">
                  <div className="text-xs text-n-3 mb-1">Prediction Accuracy</div>
                  <div className="text-lg font-bold text-green-400">94.2%</div>
                </div>
              </ScrollParallax>
            </div>
            
            <div className="absolute -left-4 bottom-16 z-50">
              <ScrollParallax strength={0.3}>
                <div className="bg-n-6 border border-n-5 rounded-lg p-3 shadow-lg">
                  <div className="text-xs text-n-3 mb-1">Models Trained</div>
                  <div className="text-lg font-bold text-blue-400">100+</div>
                </div>
              </ScrollParallax>
            </div>
          </div>
          
          {/* Right Side*/}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-n-6 border border-n-5 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-n-3">AI-Powered Analytics</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-n-1 to-n-3 bg-clip-text text-transparent">
                Predicting the Future of Sports
              </h2>
            </div>
            
            {/* Main Description */}
            <div className="space-y-6">
              <p className="text-lg text-n-2 leading-relaxed">
                VantageForm harnesses the power of advanced machine learning and deep learning models to revolutionize sports analytics. Our platform analyzes thousands of data points to deliver unprecedented accuracy in player performance predictions.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-n-7 border border-n-6 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white/20 rounded" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Deep Learning Models</h3>
                  <p className="text-n-3 text-sm">Neural networks trained on thousands of historical data points for maximum accuracy.</p>
                </div>
                
                <div className="bg-n-7 border border-n-6 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white/20 rounded-full" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-time Analysis</h3>
                  <p className="text-n-3 text-sm">Uses latest data processed on request through our API's.</p>
                </div>
              </div>
              
              <p className="text-n-3">
                Created by passionate sports enthusiast and software engineer, VantageForm bridges the gap between complex data science and accessible sports insights. Whether you're a fantasy player, analyst, or simply curious about the future of sports, our platform provides the vantage view you need.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button href="/dashboard" white className={"shadow-lg "} onClick={undefined} px={undefined} >
                Explore Predictions
              </Button>
            </div>
          </div>
        </div>
      </div>
      
    </Section>
  )
}

export default About