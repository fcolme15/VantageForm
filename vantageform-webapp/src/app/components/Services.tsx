import React from 'react';
import Section from "@/components/Section";
import Image from 'next/image';
import { Brain, TrendingUp, Users, BarChart3, Target, Activity, Zap } from 'lucide-react';
import statsBackground from "@/assets/blueStats.jpg"
import barcaStadium from "@/assets/barcaStadium.jpg"
import bearsSolo from "@/assets/bearsSolo.png"
import SoccerFormation433 from '@/assets/svg/SoccerFormation433'

const Services = () => {
  return (
    <Section
      className="bg-gradient-to-b from-n-8 to-n-7 py-24 relative overflow-hidden"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="about"
    >
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            AI-Powered <span className="text-green-400">Player Analytics</span>
          </h2>
          <p className="text-neutral-300 text-xl max-w-3xl mx-auto">
            Unlock the future of sports with machine learning models that predict player performance with unprecedented accuracy
          </p>
        </div>

        <div className="relative">
          {/* Main Large Feature Card */}
          <div className="relative z-10 flex items-center h-[39rem] mb-8 p-8 border border-neutral-100/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem] bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-sm">
            {/* Background Image */}
            <Image
              src={statsBackground}
              alt="Analytics Background"
              fill
              className="object-cover opacity-[.5]"
              priority
            />
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-700/40 backdrop-blur-sm z-10"></div>

            {/* Background Image/Visual */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto z-20">
              <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center">
                <div className="relative">
                  {/* AI Neural Network Visualization */}
                  <div className="grid grid-cols-4 gap-8 opacity-20">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-white rounded-full animate-pulse"
                        style={{
                          animationDelay: `${i * 100}ms`,
                          animationDuration: '2s'
                        }}
                      />
                    ))}
                  </div>
                  {/* Connecting Lines */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 400">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <line
                          key={i}
                          x1={Math.random() * 400}
                          y1={Math.random() * 400}
                          x2={Math.random() * 400}
                          y2={Math.random() * 400}
                          stroke="url(#lineGradient)"
                          strokeWidth="1"
                          className="animate-pulse"
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-30 max-w-[20rem] ml-auto">
              <div className="flex items-center mb-6">
                <Brain className="w-12 h-12 text-blue-400 mr-4" />
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                  AI Powered
                </span>
              </div>
              <h4 className="text-4xl font-bold text-white mb-2">
                AI-Powered Performance Prediction
              </h4>
              <p className="text-blue-300 text-lg italic mb-6">
                Smarter stats. Sharper insights.
              </p>
              <p className="text-neutral-300 text-lg mb-4">
                VantageForm uses advanced machine learning to project individual player performance based on historical trends and real-time data.
              </p>
              
              {/* Feature List */}
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start py-3 border-t border-neutral-600">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <span className="text-white font-semibold">Live API-Driven Updates</span>
                  </div>
                </li>
                <li className="flex items-start py-3 border-t border-neutral-600">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <span className="text-white font-semibold">Several Metrics Analyzed Per Player</span>
                  </div>
                </li>
                <li className="flex items-start py-3 border-t border-neutral-600">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <span className="text-white font-semibold">Football, Basketball, Baseball & More</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Floating Stats */}
            <div className="hidden md:block absolute left-8 bottom-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 lg:left-1/2 lg:-translate-x-1/2 z-30">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-semibold">Processing live data...</span>
                </div>
                <div className="text-neutral-300 text-sm italic">Trained on 100+ player profiles and 1000+ data points.</div>
              </div>
            </div>
          </div>

          {/* Bottom Two Cards Grid */}
          <div className="relative z-10 grid gap-8 lg:grid-cols-2">
            {/* Advanced Analytics Card */}
            <div className="relative min-h-[39rem] border border-neutral-100/10 rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-700 to-neutral-600">
              {/* Background Image */}
              <Image
                src={bearsSolo}
                alt="Analytics Background"
                fill
                className="object-cover"
              />
              {/* Background Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700/60 to-neutral-600/60 z-10"></div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 z-20">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <BarChart3 className="w-64 h-64 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-neutral-800/0 to-neutral-800/95 lg:p-12 z-30">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="w-10 h-10 text-green-400 mr-3" />
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                      Analytics Suite
                    </span>
                  </div>
                  <h4 className="text-3xl font-bold text-white mb-2">
                    Analytics Suite
                  </h4>
                  <p className="text-green-300 text-lg italic mb-4">
                    Dive deeper into performance.
                  </p>
                  <p className="text-neutral-300 text-lg mb-6">
                    Track a player&apos;s development over time with breakdowns of key stats, performance trends, and contextual comparisons.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">200+</div>
                    <div className="text-neutral-400 text-sm">Metrics Tracked</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div className="text-neutral-400 text-sm">Player Profiles</div>
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-neutral-600/50 text-neutral-200 px-3 py-1 rounded-full text-sm">Heat Maps</span>
                  <span className="bg-neutral-600/50 text-neutral-200 px-3 py-1 rounded-full text-sm">Trend Analysis</span>
                  <span className="bg-neutral-600/50 text-neutral-200 px-3 py-1 rounded-full text-sm">Comparisons</span>
                </div>
              </div>
            </div>

            {/* Team Intelligence Card */}
            <div className="relative p-6 bg-neutral-700 rounded-3xl overflow-hidden lg:min-h-[39rem]">
              {/* Background Image */}
              <Image
                src={barcaStadium}
                alt="Team Intelligence Background"
                fill
                className="object-cover opacity-[.5]"
              />
              {/* Background Overlay */}
              <div className="absolute inset-0 bg-neutral-700/70 z-10"></div>

              {/* Header */}
              <div className="relative z-20 py-8 px-4 xl:px-6">
                <div className="flex items-center mb-6">
                  <Users className="w-10 h-10 text-purple-400 mr-3" />
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                    Team Intelligence
                  </span>
                </div>
                <h4 className="text-3xl font-bold text-white mb-2">
                  Player Insights
                </h4>
                <p className="text-purple-300 text-lg italic mb-4">
                  Precision-built Models.
                </p>
                <p className="text-neutral-300 text-lg mb-8">
                  Uncover projected stat lines, modeled outcomes, and player-specific breakdowns powered by AI. Every result updates with the latest available data.
                </p>

                {/* Service Icons */}
                <div className="flex items-center justify-between mb-8">
                  {[
                    { icon: Users, active: false },
                    { icon: Target, active: false },
                    { icon: TrendingUp, active: true },
                    { icon: Activity, active: false },
                    { icon: Zap, active: false }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        item.active
                          ? "w-14 h-14 p-0.5 bg-gradient-to-br from-purple-500 to-pink-500"
                          : "w-12 h-12 bg-neutral-600 hover:bg-neutral-500"
                      }`}
                    >
                      <div className={item.active ? "flex items-center justify-center w-full h-full bg-neutral-700 rounded-xl" : ""}>
                        <item.icon className={`w-6 h-6 ${item.active ? 'text-purple-400' : 'text-neutral-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <SoccerFormation433/>
                      
              {/* Bottom Stats */}
              <div className="relative z-20 px-4 pb-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-neutral-600/50 rounded-lg p-3">
                    <div className="text-xl font-bold text-white">Team Form </div>
                    <div className="text-neutral-400 text-xs">Used in Projection</div>
                  </div>
                  <div className="bg-neutral-600/50 rounded-lg p-3">
                    <div className="text-xl font-bold text-white">Latest Data</div>
                    <div className="text-neutral-400 text-xs">Optimal Lineups</div>
                  </div>
                  <div className="bg-neutral-600/50 rounded-lg p-3">
                    <div className="text-xl font-bold text-white">24/7</div>
                    <div className="text-neutral-400 text-xs">Injury Monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Gradient */}
          <div className="absolute top-0 left-1/2 w-[78rem] aspect-square border border-neutral-100/10 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30">
            <div className="absolute top-1/2 left-1/2 w-[65rem] aspect-square border border-neutral-100/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[40rem] aspect-square border border-neutral-100/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;