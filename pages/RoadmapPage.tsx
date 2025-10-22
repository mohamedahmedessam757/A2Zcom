

import React from 'react';
import GlassCard from '../components/GlassCard';
import { RoadmapStep } from '../types';
import { BookIcon, CourseIcon, YouTubeIcon } from '../components/icons';

const resourceIcons = {
    Book: BookIcon,
    YouTube: YouTubeIcon,
    Course: CourseIcon,
}

interface RoadmapPageProps {
    roadmapSteps: RoadmapStep[];
}

const RoadmapPage: React.FC<RoadmapPageProps> = ({ roadmapSteps }) => {
  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
        <h1 className="text-4xl font-extrabold text-white mb-4">Computer Science Roadmap</h1>
        <p className="text-gray-400 mb-12">Your visual guide to mastering Computer Science, with top-rated resources at each step.</p>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-1 h-full bg-white/10 rounded-full"></div>

          {roadmapSteps.map((step, index) => (
            <div
              key={step.id}
              className="relative mb-12 flex items-center w-full"
            >
              <div className={`flex w-full items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="hidden md:flex justify-center w-1/2"></div>
                  <div className="w-full md:w-1/2">
                    <GlassCard className="ml-8 md:ml-0">
                      <span className="absolute -left-12 md:left-auto top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 border-2 border-[#14F195] rounded-full flex items-center justify-center font-bold text-[#14F195] text-sm">
                        {step.stage.split(' ')[1]}
                      </span>
                      <p className="font-bold text-teal-300 text-lg mb-1">{step.stage}</p>
                      <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-300 mb-4">{step.description}</p>
                      <div className="space-y-2">
                        {step.resources.map((res, i) => {
                          const Icon = resourceIcons[res.type];
                          return (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-200 bg-white/5 p-2 rounded-md">
                              <Icon className="w-4 h-4 text-blue-300"/>
                              <span>{res.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    </GlassCard>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;