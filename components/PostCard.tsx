
import React from 'react';
import GlassCard from './GlassCard';
import { Post, User } from '../types';
import { StarIcon, LikeIcon, CommentIcon } from './icons';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ))}
  </div>
);

interface PostCardProps {
    post: Post;
    currentUser: User;
    onLikePost: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onLikePost }) => {
    const isLiked = post.likedBy.includes(currentUser.id);

    return (
        <GlassCard className="w-full">
        <div className="flex items-start space-x-4">
            <img src={post.author.avatarUrl} alt={post.author.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
            <div className="flex items-baseline justify-between">
                <div>
                <p className="font-bold text-white">{post.author.name}</p>
                <p className="text-sm text-gray-400">@{post.author.name.toLowerCase().replace(' ', '')}</p>
                </div>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-purple-300">{post.courseName}</h3>
                <StarRating rating={post.rating} />
                </div>
                <p className="text-gray-200">{post.review}</p>
            </div>

            <div className="flex items-center justify-end space-x-6 mt-4 text-gray-400">
                <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-white'}`}
                >
                    <LikeIcon className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} /> {post.likes}
                </button>
                <button className="flex items-center gap-2 hover:text-white">
                    <CommentIcon className="w-5 h-5" /> {post.commentsCount}
                </button>
            </div>
            </div>
        </div>
        </GlassCard>
    );
};

export default PostCard;
