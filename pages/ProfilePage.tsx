

import React from 'react';
import GlassCard from '../components/GlassCard';
import { User } from '../types';

interface ProfilePageProps {
    currentUser: User;
    onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onLogout }) => {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
                <div>
                    <GlassCard className="flex flex-col md:flex-row items-center gap-6">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-32 h-32 rounded-full border-4 border-[#14F195]" />
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl font-extrabold text-white">{currentUser.name}</h1>
                            <p className="text-lg text-teal-300">{currentUser.specialization}</p>
                            <p className="text-gray-400">Year {currentUser.studyYear}</p>
                            <div className="flex justify-center md:justify-start items-center gap-6 mt-4">
                                <div>
                                    <p className="text-2xl font-bold text-white">{currentUser.followers}</p>
                                    <p className="text-sm text-gray-400">Followers</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{currentUser.following}</p>
                                    <p className="text-sm text-gray-400">Following</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-600/50 text-white font-semibold rounded-full hover:bg-red-600/80 border border-red-500"
                        >
                            Logout
                        </button>
                    </GlassCard>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <GlassCard className="h-full">
                            <h2 className="text-2xl font-bold text-white mb-4">Current Courses</h2>
                            <ul className="space-y-2">
                                {['Advanced Quantum Mechanics', 'Linear Algebra', 'General Relativity'].map(course => (
                                    <li key={course} className="bg-white/5 p-3 rounded-lg text-gray-200">{course}</li>
                                ))}
                            </ul>
                        </GlassCard>
                    </div>
                    <div>
                        <GlassCard className="h-full">
                            <h2 className="text-2xl font-bold text-white mb-4">Top Recommendations</h2>
                            <ul className="space-y-2">
                                {['3Blue1Brown (YouTube)', 'Professor Al-Khalili\'s Lectures', 'Feynman Lectures on Physics'].map(rec => (
                                    <li key={rec} className="bg-white/5 p-3 rounded-lg text-gray-200">{rec}</li>
                                ))}
                            </ul>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;