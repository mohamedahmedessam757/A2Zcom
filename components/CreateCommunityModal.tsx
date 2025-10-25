import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Course } from '../types';
import { XIcon, UploadCloudIcon } from './icons';
import GlassCard from './GlassCard';

interface CreateCommunityModalProps {
    onSave: (communityData: Omit<Course, 'id' | 'rating' | 'platform' | 'ownerId'>) => void;
    onClose: () => void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [field, setField] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && description && field && imageUrl) {
            onSave({ title, description, field, imageUrl });
            onClose();
        } else {
            alert('Please fill out all fields and upload an image.');
        }
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
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Create a New Community</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div 
                            className="w-full h-40 bg-[var(--input-bg)] border-2 border-dashed border-[var(--input-border)] rounded-lg flex items-center justify-center cursor-pointer hover:border-[var(--primary-accent)] transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="Community preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="text-center text-[var(--text-secondary)]">
                                    <UploadCloudIcon className="w-8 h-8 mx-auto" />
                                    <p className="mt-2 text-sm">Click to upload a banner image</p>
                                    <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </div>
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Community Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Field / Major</label>
                            <input type="text" value={field} onChange={(e) => setField(e.target.value)} required
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] min-h-[80px]" />
                        </div>
                        
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent text-[var(--text-secondary)] font-semibold rounded-full hover:bg-[var(--hover-bg)]">
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full hover:bg-white">
                                Create Community
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

export default CreateCommunityModal;