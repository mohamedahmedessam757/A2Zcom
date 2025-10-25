import React, { useState, useRef, useMemo, useEffect } from 'react';
import GlassCard from './GlassCard';
import { Post, User } from '../types';
import { StarIcon, LikeIcon, CommentIcon, SendIcon, EditIcon, TrashIcon, MoreHorizontalIcon, FlagIcon, BlockUserIcon, LinkIcon, RepostIcon, ArrowLeftIcon, ArrowRightIcon, PinIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

interface StarRatingProps {
    count: number;
    rating: number;
    onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ count, rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center">
            {[...Array(count)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                    <StarIcon
                        key={i}
                        className={`w-5 h-5 ${onRatingChange ? 'cursor-pointer' : ''} transition-colors ${
                            ratingValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-[var(--star-inactive)]'
                        }`}
                        fill={ratingValue <= (hoverRating || rating) ? 'currentColor' : 'none'}
                        onClick={onRatingChange ? () => onRatingChange(ratingValue) : undefined}
                        onMouseEnter={onRatingChange ? () => setHoverRating(ratingValue) : undefined}
                        onMouseLeave={onRatingChange ? () => setHoverRating(0) : undefined}
                    />
                );
            })}
        </div>
    );
};

interface PostOptionsMenuProps {
    post: Post;
    currentUser: User;
    onEdit?: () => void;
    onDelete?: () => void;
    onReport?: () => void;
    onBlock?: () => void;
}

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({ post, currentUser, onEdit, onDelete, onReport, onBlock }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const isOwnPost = post.author.id === currentUser.id;

    const handleBlockClick = () => {
        setIsOpen(false);
        const confirmBlock = window.confirm(`Are you sure you want to block @${post.author.username}? You will no longer see their posts or comments.`);
        if (confirmBlock && onBlock) {
            onBlock();
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]">
                <MoreHorizontalIcon className="w-5 h-5"/>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        className="absolute top-full right-0 mt-1 w-48 bg-[var(--notification-bg)] backdrop-blur-lg border border-[var(--card-border)] rounded-lg shadow-lg z-10 overflow-hidden"
                    >
                        {isOwnPost ? (
                            <>
                                {onEdit && <button onClick={() => { onEdit(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-[var(--hover-bg)] text-sm text-[var(--text-primary)]">
                                    <EditIcon className="w-4 h-4" /> Edit Post
                                </button>}
                                {onDelete && <button onClick={() => { onDelete(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-[var(--hover-bg)] text-sm text-red-500">
                                    <TrashIcon className="w-4 h-4" /> Delete Post
                                </button>}
                            </>
                        ) : (
                             <>
                                {onReport && <button onClick={() => { onReport(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-[var(--hover-bg)] text-sm text-[var(--text-primary)]">
                                    <FlagIcon className="w-4 h-4" /> Report Post
                                </button>}
                                {onBlock && <button onClick={handleBlockClick} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-[var(--hover-bg)] text-sm text-red-500">
                                    <BlockUserIcon className="w-4 h-4" /> Block @{post.author.username}
                                </button>}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return <img src={images[0]} alt="Post attachment" className="rounded-lg w-full max-h-96 object-cover border border-[var(--card-border)]" />
    }

    return (
        <div className="relative group">
            <AnimatePresence initial={false}>
                 <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Post attachment ${currentIndex + 1}`}
                    className="rounded-lg w-full max-h-96 object-cover border border-[var(--card-border)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                />
            </AnimatePresence>
            <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30">
                <ArrowLeftIcon className="w-5 h-5"/>
            </button>
             <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30">
                <ArrowRightIcon className="w-5 h-5"/>
            </button>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

interface PostCardProps {
    post: Post;
    currentUser: User;
    allUsers: User[];
    onViewProfile: (userId: number) => void;
    onLikePost?: (postId: number) => void;
    onLikeComment?: (postId: number, commentId: number) => void;
    onCommentPost?: (postId: number, commentText: string) => void;
    onRatePost?: (postId: number, rating: number) => void;
    onEditPost?: (post: Post) => void;
    onDeleteRequest?: (post: Post) => void;
    onReportRequest?: (post: Post) => void;
    onBlockUser?: (userId: number) => void;
    onRepost?: (postId: number) => void;
    isCommentingAllowed?: boolean;
    pinConfig?: {
        onPin: (postId: number) => void;
        buttonText?: string;
    };
}


const PostCard: React.FC<PostCardProps> = ({ post, currentUser, allUsers, onViewProfile, onLikePost, onLikeComment, onCommentPost, onRatePost, onEditPost, onDeleteRequest, onReportRequest, onBlockUser, onRepost, isCommentingAllowed = true, pinConfig }) => {
    const isLiked = post.likedBy.includes(currentUser.id);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentSortBy, setCommentSortBy] = useState<'recent' | 'top'>('recent');
    const commentInputRef = useRef<HTMLInputElement>(null);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    
    const MAX_COMMENT_LENGTH = 280;
    
    const mentionSuggestions = useMemo(() => {
        if (!mentionQuery) return [];
        return allUsers.filter(u => u.username.toLowerCase().includes(mentionQuery.toLowerCase()) && u.id !== currentUser.id).slice(0, 5);
    }, [mentionQuery, allUsers, currentUser.id]);

    const sortedComments = useMemo(() => {
        if (commentSortBy === 'top') {
            return [...post.comments].sort((a, b) => b.likes - a.likes);
        }
        return [...post.comments].sort((a, b) => b.id - a.id);
    }, [post.comments, commentSortBy]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        if (text.length > MAX_COMMENT_LENGTH) return;
        setNewComment(text);

        const mentionMatch = text.match(/@(\w+)$/);
        if (mentionMatch) {
            setMentionQuery(mentionMatch[1]);
            setShowMentions(true);
        } else {
            setShowMentions(false);
        }
    };
    
    const handleMentionSelect = (username: string) => {
        setNewComment(prev => prev.replace(/@(\w+)$/, `@${username} `));
        setShowMentions(false);
        commentInputRef.current?.focus();
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && onCommentPost) {
            onCommentPost(post.id, newComment.trim());
            setNewComment('');
        }
    };
    
    const handleReply = (replyToUser: User) => {
        setNewComment(prev => `${prev ? prev + ' ' : ''}@${replyToUser.username} `);
        commentInputRef.current?.focus();
    };
    
    const renderWithMentions = (text: string) => {
        const mentionRegex = /@(\w+)/g;
        const parts = text.split(mentionRegex);
        return parts.map((part, index) => {
            if (index % 2 === 1) { // It's a username
                const userExists = allUsers.some(u => u.username === part);
                if (userExists) {
                    return <span key={index} className="text-teal-400 font-semibold cursor-pointer hover:underline">@{part}</span>;
                }
            }
            return part;
        });
    };
    
    const originalPost = post.repostOf ? post.repostOf : post;
    const showOptionsMenu = onEditPost || onDeleteRequest || onReportRequest || onBlockUser;

    return (
        <GlassCard className="w-full">
            {post.repostOf && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                    <RepostIcon className="w-4 h-4"/>
                    <button onClick={() => onViewProfile(post.author.id)} className="font-bold hover:underline">{post.author.name}</button> reposted
                </div>
            )}
            <div className={`flex items-start space-x-3 sm:space-x-4 ${post.repostOf ? 'pl-4 border-l-2 border-[var(--card-border)]' : ''}`}>
                <button onClick={() => onViewProfile(originalPost.author.id)} className="flex-shrink-0 transition-transform duration-200 hover:scale-105">
                    <img src={originalPost.author.avatarUrl} alt={originalPost.author.name} className="w-12 h-12 rounded-full" />
                </button>
                <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        <button onClick={() => onViewProfile(originalPost.author.id)} className="text-left">
                            <p className="font-bold text-[var(--text-primary)] hover:underline">{originalPost.author.name}</p>
                        </button>
                        <p className="text-sm text-[var(--text-secondary)]">@{originalPost.author.username}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-[var(--text-secondary)] whitespace-nowrap">{originalPost.timestamp}</p>
                        {showOptionsMenu && <PostOptionsMenu 
                            post={originalPost} 
                            currentUser={currentUser} 
                            onEdit={onEditPost ? () => onEditPost(originalPost) : undefined}
                            onDelete={onDeleteRequest ? () => onDeleteRequest(originalPost) : undefined}
                            onReport={onReportRequest ? () => onReportRequest(originalPost) : undefined}
                            onBlock={onBlockUser ? () => onBlockUser(originalPost.author.id) : undefined}
                        />}
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="font-semibold text-purple-400 text-lg">{originalPost.courseName}</h3>
                        <StarRating 
                            count={5} 
                            rating={originalPost.rating} 
                            onRatingChange={onRatePost ? (newRating) => onRatePost(originalPost.id, newRating) : undefined}
                        />
                    </div>
                    <p className="text-[var(--text-primary)] break-words">{renderWithMentions(originalPost.review)}</p>

                    {originalPost.imageUrls && originalPost.imageUrls.length > 0 && (
                        <div className="mt-4">
                           <ImageCarousel images={originalPost.imageUrls} />
                        </div>
                    )}

                    {originalPost.linkUrl && (
                        <a href={originalPost.linkUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block bg-[var(--hover-bg)] p-3 rounded-lg hover:bg-[var(--input-bg)] transition-colors border border-[var(--card-border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex-shrink-0 bg-[var(--input-bg)] rounded-md flex items-center justify-center">
                                    <LinkIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{originalPost.linkUrl}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">External Link</p>
                                </div>
                            </div>
                        </a>
                    )}

                    <div className="flex items-center justify-start space-x-4 sm:space-x-6 mt-4 text-[var(--text-secondary)]">
                         {pinConfig ? (
                            <button
                                onClick={() => pinConfig.onPin(originalPost.id)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full hover:bg-white"
                            >
                                <PinIcon className="w-5 h-5" />
                                <span>{pinConfig.buttonText || 'Pin Post'}</span>
                            </button>
                        ) : (
                            <>
                                {onLikePost && <button
                                    onClick={() => onLikePost(originalPost.id)}
                                    className={`flex items-center gap-1.5 transition-colors font-semibold ${originalPost.likedBy.includes(currentUser.id) ? 'text-pink-500' : 'hover:text-[var(--text-primary)]'}`}
                                >
                                    <LikeIcon className="w-5 h-5" fill={originalPost.likedBy.includes(currentUser.id) ? 'currentColor' : 'none'} />
                                    <span className="text-sm">{originalPost.likes} {originalPost.likes === 1 ? 'Like' : 'Likes'}</span>
                                </button>}
                                <button 
                                    onClick={() => {
                                        setShowComments(!showComments);
                                        if (!showComments) {
                                            setCommentSortBy('recent');
                                        }
                                    }}
                                    className="flex items-center gap-1.5 hover:text-[var(--text-primary)] font-semibold"
                                >
                                    <CommentIcon className="w-5 h-5" />
                                    <span className="text-sm">{originalPost.comments.length} {originalPost.comments.length === 1 ? 'Comment' : 'Comments'}</span>
                                </button>
                                {onRepost && <button
                                    onClick={() => onRepost(originalPost.id)}
                                    className="flex items-center gap-1.5 hover:text-[var(--text-primary)] font-semibold"
                                >
                                    <RepostIcon className="w-5 h-5" />
                                    <span className="text-sm">Repost</span>
                                </button>}
                            </>
                        )}
                    </div>
                    
                    {showComments && (
                        <div className="mt-4 pt-4 border-t border-[var(--card-border)] transition-all duration-300">
                            {(isCommentingAllowed && onCommentPost) ? (
                                <div className="relative">
                                   {showMentions && mentionSuggestions.length > 0 && (
                                        <div className="absolute bottom-full mb-1 w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
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
                                    <form onSubmit={handleCommentSubmit} className="flex items-start gap-2 mb-2">
                                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="relative">
                                                <input
                                                    ref={commentInputRef}
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    value={newComment}
                                                    onChange={handleCommentChange}
                                                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-full px-4 py-1.5 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-accent)] pr-10"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!newComment.trim()}
                                                    aria-label="Send comment"
                                                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ${
                                                        newComment.trim()
                                                            ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)] scale-100'
                                                            : 'bg-gray-400 dark:bg-gray-600 scale-90 opacity-50 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <SendIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className={`text-right text-xs mt-1 pr-2 transition-colors ${newComment.length > MAX_COMMENT_LENGTH * 0.9 ? 'text-orange-500' : 'text-[var(--text-secondary)]'}`}>
                                                {newComment.length}/{MAX_COMMENT_LENGTH}
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            ) : !onCommentPost ? null : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-[var(--text-secondary)]">Join the community to add a comment.</p>
                                </div>
                            )}
                            
                            {originalPost.comments.length > 1 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm font-semibold text-[var(--text-secondary)]">Sort by:</span>
                                    <button
                                        onClick={() => setCommentSortBy('recent')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${commentSortBy === 'recent' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'bg-[var(--input-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}
                                    >
                                        Recent
                                    </button>
                                    <button
                                        onClick={() => setCommentSortBy('top')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${commentSortBy === 'top' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'bg-[var(--input-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}
                                    >
                                        Top
                                    </button>
                                </div>
                            )}

                            <div className="space-y-3">
                                {sortedComments.length > 0 ? sortedComments.map(comment => {
                                    const isCommentLiked = comment.likedBy.includes(currentUser.id);
                                    return (
                                        <div key={comment.id} className="flex items-start gap-3">
                                            <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-8 h-8 rounded-full" />
                                            <div className="bg-[var(--hover-bg)] p-3 rounded-lg flex-1">
                                                <div className="flex items-baseline gap-2">
                                                    <p className="font-semibold text-sm text-[var(--text-primary)]">{comment.author.name}</p>
                                                    <p className="text-xs text-[var(--text-secondary)]">{comment.timestamp}</p>
                                                </div>
                                                <p className="text-sm text-[var(--text-secondary)] break-words">{renderWithMentions(comment.text)}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-secondary)]">
                                                    {onLikeComment && <button
                                                        onClick={() => onLikeComment(originalPost.id, comment.id)}
                                                        className={`flex items-center gap-1.5 font-medium transition-colors ${isCommentLiked ? 'text-pink-500' : 'hover:text-[var(--text-primary)]'}`}
                                                    >
                                                        <LikeIcon className="w-4 h-4" />
                                                        {comment.likes > 0 && <span>{comment.likes}</span>}
                                                    </button>}
                                                    <button 
                                                        onClick={() => handleReply(comment.author)}
                                                        className="hover:text-[var(--text-primary)] font-medium"
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <p className="text-sm text-center text-[var(--text-secondary)] py-4">Be the first to comment.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default PostCard;
