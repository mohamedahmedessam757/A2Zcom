import React from 'react';
import { Page } from '../types';
import { Logo } from '../components/icons';

interface LegalPageProps {
  setCurrentPage: (page: Page) => void;
}

const PrivacyPage: React.FC<LegalPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="py-6 px-4 md:px-8 flex justify-between items-center border-b border-gray-800">
        <Logo />
        <button onClick={() => setCurrentPage('landing')} className="text-gray-400 hover:text-white transition-colors">
          &larr; Back to Home
        </button>
      </header>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-glow mb-8">Privacy Policy</h1>
        <div className="max-w-4xl text-gray-300 space-y-6 leading-relaxed">
            <p>Your privacy is important to us. It is A2Z's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>
            <h2 className="text-2xl font-bold text-white pt-4">1. Information we collect</h2>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used. This includes your name, email address, university affiliation, and academic information you choose to provide.</p>
            <h2 className="text-2xl font-bold text-white pt-4">2. How we use your information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul className="list-disc list-inside space-y-2">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
            </ul>
            <h2 className="text-2xl font-bold text-white pt-4">3. Log Files</h2>
            <p>A2Z follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
