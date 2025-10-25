import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { XIcon, SendIcon, CheckIcon, CheckCheckIcon } from '../components/icons';

interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}

interface ChatPageProps {
    currentUser: User;
    chatUser: User;
    onClose: () => void;
}

const initialMockMessages: Omit<Message, 'id' | 'senderId'>[] = [
    { text: 'Hey! I saw your review on the Quantum Mechanics course. Super helpful!', timestamp: '10:01 AM', status: 'read' },
    { text: 'Awesome, glad you found it useful! It\'s a tough subject but so rewarding.', timestamp: '10:02 AM', status: 'read' },
    { text: 'For sure. I was wondering if you had any tips for the final problem set?', timestamp: '10:02 AM', status: 'read' },
    { text: 'Definitely! Focus on lectures 8 and 10. He pulls a lot of questions from those concepts.', timestamp: '10:03 AM', status: 'read' },
    { text: 'That\'s a lifesaver, thank you so much! 🙏', timestamp: '10:04 AM', status: 'read' },
];

const mockResponses = [
    "That makes total sense. Thanks!",
    "Got it, appreciate the help!",
    "Oh, I see. That's a great tip.",
    "Perfect, I'll check those out.",
];

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, chatUser, onClose }) => {
    const [messages, setMessages] = useState<Message[]>(initialMockMessages.map((msg, i) => ({
        id: i + 1,
        senderId: i % 2 === 0 ? chatUser.id : currentUser.id,
        ...msg,
    })));
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages, isTyping]);
    
    // Simulate other user reading messages and responding
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.senderId === currentUser.id) {
            const readTimer = setTimeout(() => {
                setMessages(prev => prev.map(m => ({ ...m, status: 'read' })));
            }, 1000);

            const typingTimer = setTimeout(() => {
                setIsTyping(true);
            }, 1500);

            const responseTimer = setTimeout(() => {
                setIsTyping(false);
                const responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
                const response: Message = {
                    id: Date.now(),
                    senderId: chatUser.id,
                    text: responseText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                    status: 'delivered',
                };
                setMessages(prev => [...prev, response]);
            }, 3000 + Math.random() * 1000);

            return () => {
                clearTimeout(readTimer);
                clearTimeout(typingTimer);
                clearTimeout(responseTimer);
            };
        }
    }, [messages, currentUser.id, chatUser.id]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message: Message = {
                id: messages.length + 1,
                senderId: currentUser.id,
                text: newMessage.trim(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                status: 'sent',
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };
    
    const ReadReceipt: React.FC<{status: Message['status']}> = ({status}) => {
      if (status === 'read') return <CheckCheckIcon className="w-4 h-4 text-blue-400" />
      if (status === 'delivered') return <CheckCheckIcon className="w-4 h-4 text-gray-400" />
      return <CheckIcon className="w-4 h-4 text-gray-400" />
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full max-w-md h-[70vh] max-h-[550px] bg-[#1F2937] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-700"
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.1}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <header className="flex items-center gap-4 p-3 bg-slate-800/50 backdrop-blur-lg border-b border-white/10 flex-shrink-0 cursor-move">
                        <img src={chatUser.avatarUrl} alt={chatUser.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <h1 className="font-bold text-base text-white">{chatUser.name}</h1>
                            <p className="text-xs text-gray-400">@{chatUser.username}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </header>

                    <main className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0D0D0D]">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex w-full ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-2 max-w-[80%]`}>
                                    {msg.senderId !== currentUser.id && (
                                        <img src={chatUser.avatarUrl} alt={chatUser.name} className="w-6 h-6 rounded-full self-end"/>
                                    )}
                                    <div className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3 rounded-2xl text-sm ${msg.senderId === currentUser.id ? 'bg-[#14F195] text-black rounded-br-lg' : 'bg-slate-700 text-white rounded-bl-lg'}`}>
                                            <p>{msg.text}</p>
                                        </div>
                                        <div className={`flex items-center gap-1.5 mt-1 px-1 ${msg.senderId === currentUser.id ? 'flex-row-reverse' : ''}`}>
                                            <p className="text-[10px] text-gray-500">{msg.timestamp}</p>
                                            {msg.senderId === currentUser.id && <ReadReceipt status={msg.status} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex items-end gap-2 justify-start">
                              <img src={chatUser.avatarUrl} alt={chatUser.name} className="w-6 h-6 rounded-full"/>
                              <div className="p-3 rounded-2xl bg-slate-700 rounded-bl-lg">
                                  <div className="flex gap-1.5 items-center">
                                      <motion.div className="w-1.5 h-1.5 bg-gray-300 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
                                      <motion.div className="w-1.5 h-1.5 bg-gray-300 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} />
                                      <motion.div className="w-1.5 h-1.5 bg-gray-300 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                                  </div>
                              </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>

                    <footer className="p-3 bg-slate-800/50 backdrop-blur-lg border-t border-white/10 flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-700 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14F195]"
                            />
                            <button type="submit" className="p-3 bg-[#14F195] text-black rounded-full hover:bg-white disabled:bg-gray-600 transition-colors" disabled={!newMessage.trim()}>
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </footer>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatPage;