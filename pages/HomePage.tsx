import React, { useState, useMemo, useCallback, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import PostCard from '../components/PostCard';
import { Post, User } from '../types';
import { StarIcon, AttachmentIcon, LinkIcon, XIcon } from '../components/icons';

const CreatePostForm: React.FC<{
    currentUser: User;
    allUsers: User[];
    onCreatePost: (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'timestamp' | 'likedBy' | 'repostOf'>) => void;
}> = ({ currentUser, allUsers, onCreatePost }) => {
    const [courseName, setCourseName] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mentionSuggestions = useMemo(() => {
        if (!mentionQuery) return [];
        return allUsers.filter(u => u.username.toLowerCase().includes(mentionQuery.toLowerCase()) && u.id !== currentUser.id).slice(0, 5);
    }, [mentionQuery, allUsers, currentUser.id]);

    const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setReview(text);

        const mentionMatch = text.match(/@(\w+)$/);
        if (mentionMatch) {
            setMentionQuery(mentionMatch[1]);
            setShowMentions(true);
        } else {
            setShowMentions(false);
        }
    };
    
    const handleMentionSelect = (username: string) => {
        setReview(prev => prev.replace(/@(\w+)$/, `@${username} `));
        setShowMentions(false);
    };

    const handleAttachment = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const promises = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(promises).then(results => {
                setImageUrls(prev => [...prev, ...results]);
            }).catch(error => console.error("Error reading files:", error));
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (courseName && review && rating > 0) {
            onCreatePost({ courseName, review, rating, imageUrls, linkUrl, field: currentUser.specialization, isCommunityPost: false });
            setCourseName('');
            setReview('');
            setRating(0);
            setImageUrls([]);
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    return (
        <GlassCard className="w-full mb-8">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
            />
            <div className="flex items-start space-x-4">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full" />
                <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                    <input
                        type="text"
                        placeholder="What course are you reviewing?"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                    />
                    <div className="relative">
                        <textarea
                            placeholder={`What's on your mind, ${currentUser.name}?`}
                            value={review}
                            onChange={handleReviewChange}
                            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] min-h-[80px]"
                        />
                        {showMentions && mentionSuggestions.length > 0 && (
                            <div className="absolute bottom-full mb-1 w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg z-10 overflow-hidden">
                                {mentionSuggestions.map(user => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => handleMentionSelect(user.username)}
                                        className="w-full text-left flex items-center gap-2 p-2 hover:bg-[var(--hover-bg)]"
                                    >
                                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full"/>
                                        <div>
                                            <p className="font-semibold text-sm">{user.name}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">@{user.username}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {showLinkInput && (
                         <input
                            type="url"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                        />
                    )}
                    {imageUrls.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto py-2">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative group w-28 h-28 flex-shrink-0">
                                    <img src={url} alt="preview" className="w-full h-full object-cover rounded-lg" />
                                    <button onClick={() => removeImage(index)} className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XIcon className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center sm:justify-start">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`w-6 h-6 cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-[var(--star-inactive)]'}`}
                                        fill={i < rating ? 'currentColor' : 'none'}
                                        onClick={() => setRating(i + 1)}
                                    />
                                ))}
                            </div>
                             <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                <button type="button" onClick={handleAttachment} className="p-2 hover:bg-[var(--hover-bg)] rounded-full"><AttachmentIcon className="w-5 h-5" /></button>
                                <button type="button" onClick={() => setShowLinkInput(!showLinkInput)} className={`p-2 hover:bg-[var(--hover-bg)] rounded-full ${showLinkInput ? 'text-[var(--primary-accent)]' : ''}`}><LinkIcon className="w-5 h-5" /></button>
                            </div>
                        </div>

                        <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full hover:bg-white">
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
    allUsers: User[];
    onLikePost: (postId: number) => void;
    onLikeComment: (postId: number, commentId: number) => void;
    onCreatePost: (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'timestamp' | 'likedBy' | 'repostOf'>) => void;
    onCommentPost: (postId: number, commentText: string) => void;
    onViewProfile: (userId: number) => void;
    onRatePost: (postId: number, rating: number) => void;
    onEditPost: (post: Post) => void;
    onDeleteRequest: (post: Post) => void;
    onReportRequest: (post: Post) => void;
    onBlockUser: (userId: number) => void;
    onRepost: (postId: number) => void;
    searchQuery: string;
}

const HomePage: React.FC<HomePageProps> = ({ posts, currentUser, allUsers, onLikePost, onLikeComment, onCreatePost, onCommentPost, onViewProfile, onRatePost, onEditPost, onDeleteRequest, onReportRequest, onBlockUser, onRepost, searchQuery }) => {
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent');
  const [starFilter, setStarFilter] = useState<number>(0);

  const sortedPosts = useMemo(() => {
    const filtered = posts.filter(post =>
        !post.isCommunityPost &&
        (post.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.repostOf && post.repostOf.courseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.repostOf && post.repostOf.review.toLowerCase().includes(searchQuery.toLowerCase()))
        ) &&
        (starFilter === 0 || post.rating >= starFilter || (post.repostOf && post.repostOf.rating >= starFilter))
    );

    if (sortBy === 'top') {
        return [...filtered].sort((a, b) => b.likes - a.likes);
    }
    return filtered; // Default is recent, assuming initial array is sorted by time
  }, [posts, searchQuery, sortBy, starFilter]);

  const ratingFilters = [
    { label: 'All', value: 0 },
    { label: '4+ Stars', value: 4 },
    { label: '3+ Stars', value: 3 },
  ];
  
  return (
    <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
            <CreatePostForm currentUser={currentUser} allUsers={allUsers} onCreatePost={onCreatePost} />
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full p-1 w-fit">
                    <button 
                        onClick={() => setSortBy('recent')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${sortBy === 'recent' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}
                    >
                        Recent
                    </button>
                    <button 
                        onClick={() => setSortBy('top')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${sortBy === 'top' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}
                    >
                        Top
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full p-1 w-fit">
                   {ratingFilters.map(filter => (
                        <button 
                            key={filter.value}
                            onClick={() => setStarFilter(filter.value)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${starFilter === filter.value ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}
                        >
                            {filter.label}
                        </button>
                   ))}
                </div>
            </div>

            <div
                className="space-y-6"
            >
                {sortedPosts.map(post => (
                    <div key={post.id}>
                        <PostCard 
                            post={post} 
                            currentUser={currentUser} 
                            allUsers={allUsers}
                            onLikePost={onLikePost} 
                            onLikeComment={onLikeComment} 
                            onCommentPost={onCommentPost} 
                            onViewProfile={onViewProfile} 
                            onRatePost={onRatePost} 
                            onEditPost={onEditPost}
                            onDeleteRequest={onDeleteRequest}
                            onReportRequest={onReportRequest}
                            onBlockUser={onBlockUser}
                            onRepost={onRepost}
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default HomePage;