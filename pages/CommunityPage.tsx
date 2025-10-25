import React, { useState, useMemo, useRef } from 'react';
import { Course, User, Post, Page } from '../types';
import GlassCard from '../components/GlassCard';
import PostCard from '../components/PostCard';
import { UsersIcon, MessageSquareIcon, BookIcon, StarIcon, AttachmentIcon, LinkIcon, XIcon, ArrowLeftIcon, EditIcon, TrashIcon } from '../components/icons';

const CreateCommunityPostForm: React.FC<{
    currentUser: User;
    allUsers: User[];
    community: Course;
    onCreatePost: (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'timestamp' | 'likedBy' | 'repostOf'>) => void;
}> = ({ currentUser, allUsers, community, onCreatePost }) => {
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
            onCreatePost({ courseName, review, rating, imageUrls, linkUrl, field: community.field, isCommunityPost: true });
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
                        placeholder="Post title..."
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                    />
                    <div className="relative">
                        <textarea
                            placeholder={`Share something with the ${community.title} community...`}
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

const MemberCard: React.FC<{ member: User; onViewProfile: (userId: number) => void }> = ({ member, onViewProfile }) => (
    <GlassCard className="flex items-center gap-4 p-4">
        <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full" />
        <div className="min-w-0">
            <button onClick={() => onViewProfile(member.id)} className="font-bold text-[var(--text-primary)] hover:underline truncate">{member.name}</button>
            <p className="text-sm text-[var(--text-secondary)] truncate">{member.specialization} - Year {member.studyYear}</p>
        </div>
    </GlassCard>
);

const ResourceCard: React.FC<{ course: Course }> = ({ course }) => (
    <GlassCard className="p-4">
        <h3 className="font-bold text-[var(--text-primary)] truncate">{course.title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{course.platform}</p>
    </GlassCard>
);

interface CommunityPageProps {
    community: Course;
    currentUser: User;
    allUsers: User[];
    allPosts: Post[];
    courses: Course[];
    onJoinToggle: (field: string) => void;
    onViewProfile: (userId: number) => void;
    onLikePost: (postId: number) => void;
    onLikeComment: (postId: number, commentId: number) => void;
    onCommentPost: (postId: number, commentText: string) => void;
    onCreatePost: (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'timestamp' | 'likedBy' | 'repostOf'>) => void;
    onRatePost: (postId: number, rating: number) => void;
    onEditPost: (post: Post) => void;
    onDeleteRequest: (post: Post) => void;
    onReportRequest: (post: Post) => void;
    onBlockUser: (userId: number) => void;
    onRepost: (postId: number) => void;
    setCurrentPage: (page: Page) => void;
    onEditCommunity: () => void;
    onDeleteCommunity: () => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({
    community, currentUser, allUsers, allPosts, courses, onJoinToggle, onViewProfile, onCreatePost, onRepost, setCurrentPage, onEditCommunity, onDeleteCommunity, ...postCardProps
}) => {
    const [activeTab, setActiveTab] = useState('discussion');
    const isJoined = currentUser.joinedCommunities.includes(community.field);
    const isOwner = community.ownerId === currentUser.id;

    const [memberSort, setMemberSort] = useState<'name' | 'year'>('name');
    const [postSortBy, setPostSortBy] = useState<'recent' | 'top'>('recent');
    const [postStarFilter, setPostStarFilter] = useState<number>(0);

    const { members, posts, resources } = useMemo(() => {
        const members = allUsers.filter(u => u.specialization === community.field);
        const posts = allPosts.filter(p => p.field === community.field);
        const resources = courses.filter(c => c.field === community.field);
        return { members, posts, resources };
    }, [allUsers, allPosts, courses, community.field]);
    
    const sortedMembers = useMemo(() => {
        const sorted = [...members];
        if (memberSort === 'name') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            sorted.sort((a, b) => a.studyYear - b.studyYear);
        }
        return sorted;
    }, [members, memberSort]);

    const sortedAndFilteredPosts = useMemo(() => {
        const filtered = posts.filter(post => {
            const postToCheck = post.repostOf || post;
            return postStarFilter === 0 || postToCheck.rating >= postStarFilter
        });
        if (postSortBy === 'top') {
            return [...filtered].sort((a, b) => b.likes - a.likes);
        }
        return [...filtered].sort((a,b) => b.id - a.id); // recent
    }, [posts, postSortBy, postStarFilter]);

    const ratingFilters = [
        { label: 'All', value: 0 },
        { label: '4+ Stars', value: 4 },
        { label: '3+ Stars', value: 3 },
    ];

    const TABS = [
        { id: 'discussion', label: 'Discussion', icon: MessageSquareIcon },
        { id: 'members', label: 'Members', icon: UsersIcon },
        { id: 'resources', label: 'Resources', icon: BookIcon },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'members':
                return <>
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full p-1 w-fit">
                            <button onClick={() => setMemberSort('name')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${memberSort === 'name' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}>Name (A-Z)</button>
                            <button onClick={() => setMemberSort('year')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${memberSort === 'year' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}>Study Year</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sortedMembers.map(member => <MemberCard key={member.id} member={member} onViewProfile={onViewProfile} />)}
                    </div>
                </>;
            case 'resources':
                return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map(resource => <ResourceCard key={resource.id} course={resource} />)}
                </div>;
            case 'discussion':
            default:
                return <>
                    {isJoined ? (
                        <CreateCommunityPostForm currentUser={currentUser} allUsers={allUsers} community={community} onCreatePost={onCreatePost} />
                    ) : (
                        <GlassCard className="w-full mb-8 text-center p-6">
                            <p className="text-[var(--text-secondary)] font-semibold">You must join this community to create a new post.</p>
                        </GlassCard>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full p-1 w-fit">
                            <button onClick={() => setPostSortBy('recent')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${postSortBy === 'recent' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}>Recent</button>
                            <button onClick={() => setPostSortBy('top')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${postSortBy === 'top' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}>Top</button>
                        </div>
                        <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full p-1 w-fit">
                           {ratingFilters.map(filter => (
                                <button key={filter.value} onClick={() => setPostStarFilter(filter.value)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${postStarFilter === filter.value ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}>{filter.label}</button>
                           ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        {sortedAndFilteredPosts.length > 0 ? (
                            sortedAndFilteredPosts.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} allUsers={allUsers} {...postCardProps} onRepost={onRepost} onViewProfile={onViewProfile} isCommentingAllowed={isJoined} />)
                        ) : (
                            <GlassCard>
                                <p className="text-center text-[var(--text-secondary)] py-8">No discussions yet. Start one!</p>
                            </GlassCard>
                        )}
                    </div>
                </>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
                <div className="mb-4">
                    <button
                        onClick={() => setCurrentPage('discover')}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 -ml-2 rounded-full hover:bg-[var(--hover-bg)]"
                        aria-label="Back to discover"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Discover
                    </button>
                </div>
                <GlassCard className="mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <img src={community.imageUrl} alt={community.field} className="w-32 h-32 rounded-lg object-cover" />
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl font-extrabold text-[var(--text-primary)]">{community.field} Community</h1>
                            <p className="text-[var(--text-secondary)] mt-2">{community.description}</p>
                            <div className="flex justify-center md:justify-start items-center gap-6 mt-4">
                                <div>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">{posts.length}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">Posts</p>
                                </div>
                                <button onClick={() => setActiveTab('members')} className="text-left hover:bg-[var(--hover-bg)] p-2 rounded-md transition-colors">
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">{members.length}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">Members</p>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                             <button 
                                onClick={() => onJoinToggle(community.field)}
                                className={`px-6 py-3 font-semibold rounded-full transition-colors w-40 text-center ${isJoined ? 'bg-transparent text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--hover-bg)]' : 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)] hover:bg-white'}`}
                                disabled={isOwner}
                            >
                                {isOwner ? 'Owner' : (isJoined ? 'Joined' : 'Join Group')}
                            </button>
                            {isOwner && (
                                <div className='flex gap-2'>
                                    <button onClick={onEditCommunity} className="flex-1 p-2 bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] border border-[var(--card-border)] rounded-full transition-colors text-sm font-semibold flex items-center justify-center gap-1.5">
                                       <EditIcon className="w-4 h-4" /> Edit
                                    </button>
                                     <button onClick={onDeleteCommunity} className="flex-1 p-2 bg-red-900/50 hover:bg-red-900/80 border border-red-500 rounded-full transition-colors text-sm font-semibold text-red-300 flex items-center justify-center gap-1.5">
                                       <TrashIcon className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </GlassCard>

                <div className="border-b border-[var(--card-border)] mb-6">
                    <nav className="flex items-center gap-2 -mb-px overflow-x-auto">
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'border-[var(--primary-accent)] text-[var(--primary-accent)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                <tab.icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default CommunityPage;