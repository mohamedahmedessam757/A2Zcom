import React from 'react';
import { Page } from '../types';
import { Logo } from '../components/icons';

interface LegalPageProps {
  setCurrentPage: (page: Page) => void;
}

const TermsPage: React.FC<LegalPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="py-6 px-4 md:px-8 flex justify-between items-center border-b border-gray-800">
        <Logo />
        <button onClick={() => setCurrentPage('landing')} className="text-gray-400 hover:text-white transition-colors">
          &larr; Back to Home
        </button>
      </header>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-glow mb-8">Terms of Service</h1>
        <div className="max-w-4xl text-gray-300 space-y-6 leading-relaxed">
            <h2 className="text-2xl font-bold text-white pt-4">1. Terms</h2>
            <p>By accessing the website at A2Z, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
            <h2 className="text-2xl font-bold text-white pt-4">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on A2Z's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-decimal list-inside space-y-2">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on A2Z's website;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by A2Z at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
            <h2 className="text-2xl font-bold text-white pt-4">3. Disclaimer</h2>
            <p>The materials on A2Z's website are provided on an 'as is' basis. A2Z makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
