import React from 'react';
import { Page } from '../types';
import { Logo } from '../components/icons';

interface LegalPageProps {
  setCurrentPage: (page: Page) => void;
}

const SupportPage: React.FC<LegalPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="py-6 px-4 md:px-8 flex justify-between items-center border-b border-gray-800">
        <Logo />
        <button onClick={() => setCurrentPage('landing')} className="text-gray-400 hover:text-white transition-colors">
          &larr; Back to Home
        </button>
      </header>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-glow mb-8">Support Center</h1>
        <div className="max-w-4xl text-gray-300 space-y-6 leading-relaxed">
            <p>Welcome to the A2Z Support Center. We're here to help you get the most out of our platform. If you have any questions, issues, or feedback, please don't hesitate to reach out.</p>
            
            <h2 className="text-2xl font-bold text-white pt-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg text-gray-100">How do I verify my student email?</h3>
                    <p>After signing up, you will receive a verification link to your student email address. Click the link to complete your registration and gain full access to the A2Z community.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-gray-100">Can I post anonymously?</h3>
                    <p>To maintain a trusted and authentic community, all posts are tied to user profiles. We believe this encourages more thoughtful and constructive reviews.</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg text-gray-100">How do I report inappropriate content?</h3>
                    <p>Every post and comment has a 'report' option. Our moderation team will review all reports and take appropriate action to maintain a safe community environment.</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white pt-8">Contact Us</h2>
            <p>If you can't find the answer you're looking for, please email us directly. Our support team will get back to you as soon as possible.</p>
            <p>
                <strong>Email:</strong> <a href="mailto:support@a2z.com" className="text-[#14F195] hover:underline">support@a2z.com</a>
            </p>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;