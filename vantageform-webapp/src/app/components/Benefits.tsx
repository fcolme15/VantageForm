import React from 'react';
import { benefits } from "../constants";
import Section from '@/components/Section';

const Benefits = () => {

  return (
    <Section
      className="bg-n-8 py-20 px-4 overflow-hidden min-h-screen"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="features"
    >
    
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Next-Gen Sports Analytics
          </h2>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.id}
                className={`group relative overflow-hidden rounded-2xl border-2 ${benefit.borderColor} ${benefit.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20`}
              >
                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Animated Border Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300 -z-10`} />
                
                {/* Card Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon and Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-sm font-mono text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                      {benefit.stats}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 transition-all duration-300 group-hover:text-gray-100">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed mb-6 flex-grow">
                    {benefit.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-sm font-semibold text-gray-400 group-hover:text-white transition-colors duration-300">
                    <span>Learn More</span>
                    <svg 
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 w-2 h-16 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                </div>

                {/* Floating Particles Effect on hover*/}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />
                  <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 delay-200" />
                  <div className="absolute -bottom-2 right-1/3 w-6 h-6 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 delay-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <span className="relative z-10">Start Analyzing Today</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </Section>
  );
};

export default Benefits;