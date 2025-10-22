

import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import PostCard from '../components/PostCard';
import { Post, User } from '../types';
import { StarIcon } from '../components/icons';

const CreatePostForm: React.FC<{
    currentUser: User;
    onCreatePost: (postData: Omit<Post, 'id' | 'author' | 'likes' | 'commentsCount' | 'timestamp' | 'likedBy'>) => void;
}> = ({ currentUser, onCreatePost }) => {
    const [courseName, setCourseName] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (courseName && review && rating > 0) {
            onCreatePost({ courseName, review, rating });
            setCourseName('');
            setReview('');
            setRating(0);
        }
    };

    return (
        <GlassCard className="w-full mb-8">
            <div className="flex items-start space-x-4">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full" />
                <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                    <input
                        type="text"
                        placeholder="What course are you reviewing?"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14F195]"
                    />
                    <textarea
                        placeholder={`What's on your mind, ${currentUser.name}?`}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14F195] min-h-[80px]"
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`w-6 h-6 cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                    fill={i < rating ? 'currentColor' : 'none'}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>
                        <button type="submit" className="px-4 py-2 bg-[#14F195] text-black font-semibold rounded-full hover:bg-white">
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </GlassCard>
    );
};


interface HomePageProps {
    posts: Post[];
    currentUser: User;
    onLikePost: (postId: number) => void;
    onCreatePost: (postData: Omit<Post, 'id' | 'author' | 'likes' | 'commentsCount' | 'timestamp' | 'likedBy'>) => void;
}

const HomePage: React.FC<HomePageProps> = ({ posts, currentUser, onLikePost, onCreatePost }) => {
  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
            <h1 className="text-4xl font-extrabold text-white mb-8">Home Feed</h1>
            <CreatePostForm currentUser={currentUser} onCreatePost={onCreatePost} />
            <div
                className="space-y-6"
            >
                {posts.map(post => (
                    <div key={post.id}>
                        <PostCard post={post} currentUser={currentUser} onLikePost={onLikePost} />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default HomePage;