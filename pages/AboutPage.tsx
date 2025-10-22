import React from 'react';
import { Page } from '../types';
import { Logo } from '../components/icons';

interface LegalPageProps {
  setCurrentPage: (page: Page) => void;
}

const AboutPage: React.FC<LegalPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="py-6 px-4 md:px-8 flex justify-between items-center border-b border-gray-800">
        <Logo />
        <button onClick={() => setCurrentPage('landing')} className="text-gray-400 hover:text-white transition-colors">
          &larr; Back to Home
        </button>
      </header>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-glow mb-8">About A2Z</h1>
        <div className="max-w-4xl text-gray-300 space-y-6 leading-relaxed">
            <p>Welcome to A2Z, the ultimate platform for students to navigate their academic journey. Our mission is to create a transparent and collaborative educational ecosystem where students can share real experiences, discover valuable resources, and make informed decisions about their studies.</p>
            <h2 className="text-2xl font-bold text-white pt-4">Our Vision</h2>
            <p>We believe that learning is a shared journey. In an age of abundant information, the most valuable insights often come from peers who have walked the path before you. A2Z was born from the idea that every student's experience, whether a triumph or a challenge, is a lesson that can empower others.</p>
            <p>We aim to be the central hub for academic life, connecting students from A to Z—from their first introductory course to their final specialization. By fostering a community built on trust and authentic reviews, we help you learn smarter, together.</p>
            <h2 className="text-2xl font-bold text-white pt-4">What We Do</h2>
            <ul className="list-disc list-inside space-y-2">
                <li><span className="font-semibold text-gray-100">Peer Reviews:</span> Get honest feedback on courses, professors, and learning resources from fellow students.</li>
                <li><span className="font-semibold text-gray-100">Resource Discovery:</span> Find the best books, online courses, and tutorials recommended by your community.</li>
                <li><span className="font-semibold text-gray-100">Academic Roadmaps:</span> Visualize your learning path and discover the steps needed to achieve your academic goals.</li>
                <li><span className="font-semibold text-gray-100">Community Discussion:</span> Connect with peers, ask questions, and share knowledge in real-time discussions.</li>
            </ul>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
