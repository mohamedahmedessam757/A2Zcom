import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Post } from '../types';
import { XIcon, StarIcon } from './icons';
import GlassCard from './GlassCard';

interface EditPostModalProps {
    post: Post;
    onSave: (updatedData: { courseName: string; review: string; rating: number }) => void;
    onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onSave, onClose }) => {
    const [courseName, setCourseName] = useState(post.courseName);
    const [review, setReview] = useState(post.review);
    const [rating, setRating] = useState(post.rating);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (courseName && review && rating > 0) {
            onSave({ courseName, review, rating });
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
            >
                <GlassCard className="relative w-full max-w-lg">
                    <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Edit Post</h2>
                    <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Course Name</label>
                            <input
                                type="text"
                                placeholder="What course are you reviewing?"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Your Review</label>
                            <textarea
                                placeholder={`What's on your mind?`}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] min-h-[120px]"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium text-[var(--text-secondary)]">Your Rating</label>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`w-7 h-7 cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-[var(--star-inactive)]'}`}
                                        fill={i < rating ? 'currentColor' : 'none'}
                                        onClick={() => setRating(i + 1)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent text-[var(--text-secondary)] font-semibold rounded-full hover:bg-[var(--hover-bg)]">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full hover:bg-white">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

export default EditPostModal;
