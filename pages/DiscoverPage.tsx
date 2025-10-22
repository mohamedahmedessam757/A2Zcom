

import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Course } from '../types';
import { StarIcon } from '../components/icons';

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <GlassCard className="!p-0 overflow-hidden">
    <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-lg text-white truncate">{course.title}</h3>
      <p className="text-sm text-teal-300">{course.platform}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 py-1 px-2 rounded-full">{course.field}</span>
        <div className="flex items-center gap-1 text-yellow-400">
          <StarIcon className="w-4 h-4" fill="currentColor"/>
          <span className="font-bold">{course.rating}</span>
        </div>
      </div>
    </div>
  </GlassCard>
);

interface DiscoverPageProps {
    courses: Course[];
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ courses }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', ...Array.from(new Set(courses.map(c => c.field)))];
  const filteredCourses = activeFilter === 'All' ? courses : courses.filter(c => c.field === activeFilter);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-20 lg:pb-0">
        <h1 className="text-4xl font-extrabold text-white mb-4">Discover Resources</h1>
        <p className="text-gray-400 mb-8">Browse the highest-rated courses and learning paths.</p>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-[#14F195] text-black'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCourses.map(course => (
            <div key={course.id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;