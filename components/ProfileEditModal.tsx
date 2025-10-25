import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { XIcon, UploadCloudIcon } from './icons';
import GlassCard from './GlassCard';

interface ProfileEditModalProps {
    currentUser: User;
    onSave: (updatedData: Partial<User>) => void;
    onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ currentUser, onSave, onClose }) => {
    const [name, setName] = useState(currentUser.name);
    const [specialization, setSpecialization] = useState(currentUser.specialization);
    const [studyYear, setStudyYear] = useState(currentUser.studyYear);
    const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, specialization, studyYear, avatarUrl });
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
                className="w-full max-w-lg"
            >
                <GlassCard className="relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Edit Profile</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <img src={avatarUrl} alt="Profile preview" className="w-32 h-32 rounded-full border-4 border-[var(--primary-accent)] object-cover" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <UploadCloudIcon className="w-8 h-8 text-white" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/gif"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Major / Learning Track</label>
                            <input
                                type="text"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Study Year</label>
                            <select value={studyYear} onChange={(e) => setStudyYear(Number(e.target.value))} className="w-full appearance-none bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]">
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year+</option>
                                <option value="0">Lifelong Learner</option>
                            </select>
                        </div>
                        
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent text-[var(--text-secondary)] font-semibold rounded-full hover:bg-[var(--hover-bg)]">
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full hover:bg-white">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

export default ProfileEditModal;
