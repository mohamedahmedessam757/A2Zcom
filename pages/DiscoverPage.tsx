import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Course } from '../types';
import { StarIcon } from '../components/icons';
import CreateCommunityModal from '../components/CreateCommunityModal';

const CourseCard: React.FC<{ course: Course; onViewCommunity: (course: Course) => void }> = ({ course, onViewCommunity }) => (
  <div onClick={() => onViewCommunity(course)} className="cursor-pointer group h-full">
    <GlassCard className="!p-0 overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:border-[var(--primary-accent)] group-hover:shadow-2xl group-hover:-translate-y-1">
      <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] py-1 px-2 rounded-full self-start mb-2">{course.field} Community</span>
        <h3 className="font-bold text-lg text-[var(--text-primary)] truncate">{course.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1 flex-grow">{course.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-yellow-400">
            <StarIcon className="w-4 h-4" fill="currentColor"/>
            <span className="font-bold">{course.rating}</span>
            <span className="text-xs text-[var(--text-secondary)] ml-1">({course.platform})</span>
          </div>
          <span className="text-sm font-semibold text-[var(--primary-accent)] group-hover:underline">View Group &rarr;</span>
        </div>
      </div>
    </GlassCard>
  </div>
);

interface DiscoverPageProps {
    courses: Course[];
    searchQuery: string;
    onViewCommunity: (course: Course) => void;
    onCreateCommunity: (communityData: Omit<Course, 'id' | 'rating' | 'platform'>) => void;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ courses, searchQuery, onViewCommunity, onCreateCommunity }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const filters = ['All', ...Array.from(new Set(courses.map(c => c.field)))];
  
  const filteredCoursesByTag = activeFilter === 'All' ? courses : courses.filter(c => c.field === activeFilter);

  const filteredCourses = filteredCoursesByTag.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto pb-20 lg:pb-0">
          <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:-mx-8 md:px-8">
                {filters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      activeFilter === filter
                        ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]'
                        : 'bg-[var(--input-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full hover:bg-white whitespace-nowrap"
              >
                + Create Community
              </button>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCourses.map(course => (
              <div key={course.id}>
                <CourseCard course={course} onViewCommunity={onViewCommunity} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {isCreateModalOpen && (
          <CreateCommunityModal 
              onSave={onCreateCommunity}
              onClose={() => setIsCreateModalOpen(false)}
          />
      )}
    </>
  );
};

export default DiscoverPage;