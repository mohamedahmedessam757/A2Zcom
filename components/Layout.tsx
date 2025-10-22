

import React, { useState } from 'react';
import { ChatMessage, Page, User } from '../types';
import { HomeIcon, DiscoverIcon, ChatIcon, ProfileIcon, Logo } from './icons';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  chatMessages: ChatMessage[];
  currentUser: User;
  onSendMessage: (text: string) => void;
}

const navItems: { page: Page; icon: React.FC<any> }[] = [
  { page: 'home', icon: HomeIcon },
  { page: 'discover', icon: DiscoverIcon },
  { page: 'roadmap', icon: ChatIcon }, 
  { page: 'profile', icon: ProfileIcon },
];

const ChatSidebar: React.FC<{
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
}> = ({ messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="hidden lg:flex flex-col w-80 bg-slate-900/50 backdrop-blur-xl border-l border-white/10 h-full">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Discussions</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="flex items-start gap-3"
                    >
                        <img src={msg.sender.avatarUrl} alt={msg.sender.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="flex items-baseline gap-2">
                                <p className="font-semibold text-white">{msg.sender.name}</p>
                                <p className="text-xs text-gray-400">{msg.timestamp}</p>
                            </div>
                            <p className="text-gray-300">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-white/10">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-slate-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14F195]"
                />
            </div>
        </div>
    );
}

const MobileNavBar: React.FC<{ currentPage: Page; setCurrentPage: (page: Page) => void }> = ({ currentPage, setCurrentPage }) => {
    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-[calc(100%-2rem)] max-w-sm bg-black/20 backdrop-blur-xl border border-white/10 rounded-full p-2 z-50">
            <div className="flex justify-around">
                {navItems.map(({ page, icon: Icon }) => (
                    <button key={page} onClick={() => setCurrentPage(page)} className="relative flex-1 p-2 text-center">
                        <Icon className={`w-6 h-6 mx-auto ${currentPage === page ? 'text-[#14F195]' : 'text-gray-400'}`} />
                        {currentPage === page && (
                            <div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14F195]"
                            />
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage, chatMessages, currentUser, onSendMessage }) => {
  return (
    <div className="flex h-screen w-full text-white overflow-hidden">
      <nav className="hidden lg:flex flex-col items-center gap-10 p-6 bg-slate-900/30 backdrop-blur-xl border-r border-white/10">
        <Logo />
        {navItems.map(({ page, icon: Icon }) => (
            <button key={page} onClick={() => setCurrentPage(page)} className="relative p-3 rounded-xl">
                <Icon className={`w-7 h-7 ${currentPage === page ? 'text-[#14F195]' : 'text-gray-300'}`} />
                {currentPage === page && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#14F195] rounded-r-full" />
                )}
            </button>
        ))}
      </nav>
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">
            {children}
        </div>
      </main>
      <ChatSidebar messages={chatMessages} onSendMessage={onSendMessage} />
      <MobileNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default Layout;