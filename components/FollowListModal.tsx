import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { XIcon } from './icons';
import GlassCard from './GlassCard';

interface FollowListModalProps {
    title: string;
    userIds: number[];
    allUsers: User[];
    onClose: () => void;
    onViewProfile: (userId: number) => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ title, userIds, allUsers, onClose, onViewProfile }) => {
    const usersToShow = userIds.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];

    const handleUserClick = (userId: number) => {
        onViewProfile(userId);
        onClose();
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm"
            >
                <GlassCard className="relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{title}</h2>
                    <div className="max-h-80 overflow-y-auto space-y-3">
                        {usersToShow.length > 0 ? usersToShow.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--hover-bg)]">
                                <button onClick={() => handleUserClick(user.id)} className="flex items-center gap-3 text-left">
                                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">@{user.username}</p>
                                    </div>
                                </button>
                                {/* Future: Add follow/unfollow button here */}
                            </div>
                        )) : (
                            <p className="text-center text-[var(--text-secondary)] py-8">No users to show.</p>
                        )}
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

export default FollowListModal;
