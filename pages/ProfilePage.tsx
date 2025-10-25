import React, { useState, useMemo } from 'react';
import GlassCard from '../components/GlassCard';
import PostCard from '../components/PostCard';
import { User, Post, Page, Theme, Course } from '../types';
import { ArrowLeftIcon, CommentIcon as MessageIcon, SunIcon, MoonIcon, EditIcon, ThumbsUpIcon, MessageSquareIcon, StarIcon } from '../components/icons';
import ProfileEditModal from '../components/ProfileEditModal';
import FollowListModal from '../components/FollowListModal';

interface ProfilePageProps {
    profileUser: User;
    currentUser: User;
    allPosts: Post[];
    allUsers: User[];
    courses: Course[];
    onLogout: () => void;
    onLikePost: (postId: number) => void;
    onLikeComment: (postId: number, commentId: number) => void;
    onCommentPost: (postId: number, commentText: string) => void;
    onViewProfile: (userId: number) => void;
    onFollowToggle: (userId: number) => void;
    setCurrentPage: (page: Page) => void;
    onStartChat: (user: User) => void;
    onRatePost: (postId: number, rating: number) => void;
    onEditPost: (post: Post) => void;
    onDeleteRequest: (post: Post) => void;
    onReportRequest: (post: Post) => void;
    onBlockUser: (userId: number) => void;
    onRepost: (postId: number) => void;
    onViewCommunity: (course: Course) => void;
    theme: Theme;
    onToggleTheme: () => void;
    onUpdateProfile: (updatedData: Partial<User>) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
    profileUser, currentUser, allPosts, allUsers, courses, onLogout, 
    onLikePost, onLikeComment, onCommentPost, onViewProfile, 
    onFollowToggle, setCurrentPage, onStartChat, onRatePost, 
    onEditPost, onDeleteRequest, onReportRequest, onBlockUser, onRepost, onViewCommunity,
    theme, onToggleTheme, onUpdateProfile 
}) => {
    const isCurrentUserProfile = profileUser.id === currentUser.id;
    const isFollowing = currentUser.followingIds.includes(profileUser.id);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalData, setFollowModalData] = useState<{ title: string, userIds: number[] }>({ title: '', userIds: [] });
    
    const [activeTab, setActiveTab] = useState('posts');
    const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent');
    const [starFilter, setStarFilter] = useState<number>(0);

    const handleOpenFollowers = () => {
        // In a real app, we'd fetch follower IDs. Here, we mock it by finding who follows the profileUser.
        const followerIds = allUsers.filter(u => u.followingIds.includes(profileUser.id)).map(u => u.id);
        setFollowModalData({ title: 'Followers', userIds: followerIds });
        setIsFollowModalOpen(true);
    };

    const handleOpenFollowing = () => {
        setFollowModalData({ title: 'Following', userIds: profileUser.followingIds });
        setIsFollowModalOpen(true);
    };
    
    const { joinedCommunities, ownedCommunities } = useMemo(() => {
        const joined = courses.filter(course => profileUser.joinedCommunities.includes(course.field) && course.ownerId !== profileUser.id);
        const owned = courses.filter(course => course.ownerId === profileUser.id);
        return { joinedCommunities: joined, ownedCommunities: owned };
    }, [courses, profileUser]);

    const { userPosts, likedPosts, commentedPosts } = useMemo(() => {
        const userPosts = allPosts.filter(p => p.author.id === profileUser.id);
        const likedPosts = allPosts.filter(p => p.likedBy.includes(profileUser.id));
        const commentedPostsSet = new Set<Post>();
        allPosts.forEach(p => {
            if (p.comments.some(c => c.author.id === profileUser.id)) {
                commentedPostsSet.add(p);
            }
        });
        return { userPosts, likedPosts, commentedPosts: Array.from(commentedPostsSet) };
    }, [allPosts, profileUser.id]);
    
    const displayedPosts = useMemo(() => {
        let postsToDisplay: Post[] = [];
        switch (activeTab) {
            case 'posts': postsToDisplay = userPosts; break;
            case 'liked': postsToDisplay = likedPosts; break;
            case 'commented': postsToDisplay = commentedPosts; break;
            default: postsToDisplay = userPosts;
        }
        
        const filteredByRating = postsToDisplay.filter(p => {
            const postToCheck = p.repostOf || p;
            return starFilter === 0 || postToCheck.rating >= starFilter
        });

        return [...filteredByRating].sort((a, b) => {
            if (sortBy === 'top') {
                return b.likes - a.likes;
            }
            // Assuming higher ID is newer for 'recent'
            return b.id - a.id;
        });

    }, [activeTab, sortBy, starFilter, userPosts, likedPosts, commentedPosts]);

    const TABS = [
        { id: 'posts', label: 'Posts', icon: EditIcon, count: userPosts.length },
        { id: 'liked', label: 'Liked', icon: ThumbsUpIcon, count: likedPosts.length },
        { id: 'commented', label: 'Commented', icon: MessageSquareIcon, count: commentedPosts.length },
    ];
    
    const ratingFilters = [
        { label: 'All', value: 0 },
        { label: '4+ ★', value: 4 },
        { label: '3+ ★', value: 3 },
    ];

    return (
        <>
            <div className="p-4 md:p-8">
                <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
                    {!isCurrentUserProfile && (
                        <div className="mb-4">
                            <button
                                onClick={() => setCurrentPage('home')}
                                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 -ml-2 rounded-full hover:bg-[var(--hover-bg)]"
                                aria-label="Back to home"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                Back
                            </button>
                        </div>
                    )}
                    <GlassCard className="flex flex-col md:flex-row items-center gap-6">
                        <img src={profileUser.avatarUrl} alt={profileUser.name} className="w-32 h-32 rounded-full border-4 border-[var(--primary-accent)] object-cover" />
                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-4xl font-extrabold text-[var(--text-primary)]">{profileUser.name}</h1>
                                <div 
                                    className={`w-4 h-4 rounded-full ${profileUser.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]' : 'bg-gray-500'}`} 
                                    title={profileUser.isActive ? 'Online' : 'Offline'}
                                />
                            </div>
                            <p className="text-lg text-teal-400">{profileUser.specialization}</p>
                            <p className="text-[var(--text-secondary)]">Year {profileUser.studyYear}</p>
                            <div className="flex justify-center md:justify-start items-center gap-6 mt-4">
                                <button onClick={handleOpenFollowers} className="text-left hover:bg-[var(--hover-bg)] p-2 rounded-md">
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">{profileUser.followers}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">Followers</p>
                                </button>
                                <button onClick={handleOpenFollowing} className="text-left hover:bg-[var(--hover-bg)] p-2 rounded-md">
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">{profileUser.following}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">Following</p>
                                </button>
                                <div className="text-left p-2 rounded-md">
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">{profileUser.joinedCommunities.length}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">Communities</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isCurrentUserProfile ? (
                                <>
                                    <button onClick={() => setIsEditModalOpen(true)} className="p-3 bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] border border-[var(--card-border)] rounded-full transition-colors" aria-label="Edit profile">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={onToggleTheme} className="p-3 bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] border border-[var(--card-border)] rounded-full transition-colors" aria-label="Toggle theme">
                                        {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-slate-800" />}
                                    </button>
                                    <button onClick={onLogout} className="px-4 py-2 bg-red-600/50 text-white font-semibold rounded-full hover:bg-red-600/80 border border-red-500">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => onFollowToggle(profileUser.id)} className={`px-6 py-2 font-semibold rounded-full transition-colors w-32 text-center ${isFollowing ? 'bg-transparent text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--hover-bg)]' : 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)] hover:bg-white'}`}>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                    <button onClick={() => onStartChat(profileUser)} className="p-3 bg-transparent text-[var(--text-primary)] border border-[var(--card-border)] rounded-full hover:bg-[var(--hover-bg)] transition-colors" aria-label={`Message ${profileUser.name}`}>
                                        <MessageIcon className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </GlassCard>

                    {ownedCommunities.length > 0 && (
                         <GlassCard className="mt-8">
                            <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">My Communities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {ownedCommunities.map(community => (
                                    <div key={community.id} onClick={() => onViewCommunity(community)} className="cursor-pointer group">
                                        <img src={community.imageUrl} className="rounded-lg aspect-video object-cover transition-transform group-hover:scale-105" alt={community.title} />
                                        <p className="font-semibold mt-2 group-hover:text-[var(--primary-accent)] transition-colors">{community.title}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    <GlassCard className="mt-8">
                        <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Joined Communities</h2>
                        {joinedCommunities.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {joinedCommunities.map(community => (
                                    <div key={community.id} onClick={() => onViewCommunity(community)} className="cursor-pointer group">
                                        <img src={community.imageUrl} className="rounded-lg aspect-video object-cover transition-transform group-hover:scale-105" alt={community.title} />
                                        <p className="font-semibold mt-2 group-hover:text-[var(--primary-accent)] transition-colors">{community.title}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-[var(--text-secondary)] py-4">Not a member of any other communities yet.</p>
                        )}
                    </GlassCard>

                    <div className="mt-8">
                        <div className="border-b border-[var(--card-border)] mb-4">
                            <nav className="flex items-center gap-4 -mb-px overflow-x-auto">
                                {TABS.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'border-[var(--primary-accent)] text-[var(--primary-accent)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                        <tab.icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                        <span className="bg-[var(--input-bg)] text-xs font-bold px-2 py-0.5 rounded-full">{tab.count}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-end gap-4 mb-4">
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
                            <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full p-1 w-fit">
                                <button onClick={() => setSortBy('recent')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${sortBy === 'recent' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}>
                                    Recent
                                </button>
                                <button onClick={() => setSortBy('top')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${sortBy === 'top' ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}>
                                    Top
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {displayedPosts.length > 0 ? (
                                displayedPosts.map(post => (
                                    <PostCard
                                        key={post.id} post={post} currentUser={currentUser} allUsers={allUsers}
                                        onLikePost={onLikePost} onLikeComment={onLikeComment} onCommentPost={onCommentPost}
                                        onViewProfile={onViewProfile} onRatePost={onRatePost}
                                        onEditPost={onEditPost} onDeleteRequest={onDeleteRequest}
                                        onReportRequest={onReportRequest} onBlockUser={onBlockUser}
                                        onRepost={onRepost}
                                    />
                                ))
                            ) : (
                                <GlassCard>
                                    <p className="text-center text-[var(--text-secondary)] py-8">No posts to show in this category.</p>
                                </GlassCard>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && <ProfileEditModal currentUser={currentUser} onSave={onUpdateProfile} onClose={() => setIsEditModalOpen(false)} />}
            {isFollowModalOpen && <FollowListModal title={followModalData.title} userIds={followModalData.userIds} allUsers={allUsers} onClose={() => setIsFollowModalOpen(false)} onViewProfile={onViewProfile} />}
        </>
    );
};

export default ProfilePage;