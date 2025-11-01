import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, User, Post, Course, RoadmapStep, Comment, Theme, Notification, Roadmaps, Roadmap } from './types';
import { users as initialUsers, initialPosts, courses as initialCourses, roadmaps as initialRoadmaps } from './constants';

import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import RoadmapPage from './pages/RoadmapPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SupportPage from './pages/SupportPage';
import ChatPage from './pages/ChatPage';
import EditPostModal from './components/EditPostModal';
import GlassCard from './components/GlassCard';
import CommunityPage from './pages/CommunityPage';
import EditCommunityModal from './components/EditCommunityModal';
import AdminPage from './pages/AdminPage';


type UserSignUpData = Omit<User, 'id' | 'avatarUrl' | 'followers' | 'following' | 'studyYear' | 'isActive' | 'followingIds' | 'blockedUserIds' | 'joinedCommunities'> & {
    studyYear: string;
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [viewedUserId, setViewedUserId] = useState<number | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [chattingWith, setChattingWith] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postToReport, setPostToReport] = useState<Post | null>(null);
  const [hiddenPostIds, setHiddenPostIds] = useState<number[]>([]);
  const [viewedCommunity, setViewedCommunity] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [editingCommunity, setEditingCommunity] = useState<Course | null>(null);
  const [communityToDelete, setCommunityToDelete] = useState<Course | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<Roadmaps>(initialRoadmaps);
  const [initialRoadmapKey, setInitialRoadmapKey] = useState<string | null>(null);


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roadmapKey = urlParams.get('roadmap');
    if (roadmapKey) {
        setInitialRoadmapKey(roadmapKey);
    }
  }, []);

  // Simulate receiving notifications
  useEffect(() => {
    if (!currentUser) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const createNotification = (delay: number, type: 'comment' | 'follow' | 'like') => {
      const timer = setTimeout(() => {
        const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
        if (otherUsers.length === 0) return;
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        const ownPost = posts.find(p => p.author.id === currentUser.id);

        let newNotification: Notification | null = null;
        if (type === 'comment' && ownPost) {
          newNotification = { id: Date.now() + Math.random(), type, user: randomUser, post: ownPost, timestamp: 'Just now', read: false };
        } else if (type === 'follow') {
          newNotification = { id: Date.now() + Math.random(), type, user: randomUser, timestamp: 'Just now', read: false };
        } else if (type === 'like' && ownPost) {
          newNotification = { id: Date.now() + Math.random(), type, user: randomUser, post: ownPost, timestamp: 'Just now', read: false };
        }
        
        if (newNotification) {
          setNotifications(prev => [newNotification!, ...prev]);
        }
      }, delay);
      timers.push(timer);
    };

    createNotification(8000, 'comment');
    createNotification(15000, 'follow');
    createNotification(22000, 'like');

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentUser, allUsers, posts]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (email: string) => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      const urlParams = new URLSearchParams(window.location.search);
      const roadmapKey = urlParams.get('roadmap');
      if (roadmapKey && savedRoadmaps[roadmapKey]) {
        setInitialRoadmapKey(roadmapKey);
        setCurrentPage('roadmap');
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setCurrentPage('home');
      }
    } else {
      alert("User not found. Please sign up.");
    }
  };

  const handleSignup = (formData: UserSignUpData) => {
    const newUser: User = { 
      id: allUsers.length + 1,
      name: formData.name,
      username: formData.username,
      email: formData.email,
      avatarUrl: `https://picsum.photos/seed/${formData.username}/100/100`,
      specialization: formData.specialization,
      studyYear: parseInt(formData.studyYear, 10) || 1,
      followers: 0,
      following: 0,
      university: formData.university,
      isActive: true,
      followingIds: [],
      blockedUserIds: [],
      joinedCommunities: [],
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('home');
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleLikePost = (postId: number) => {
    if (!currentUser) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (post.likedBy.includes(currentUser.id)) {
          // Unlike
          return { ...post, likes: post.likes - 1, likedBy: post.likedBy.filter(id => id !== currentUser.id) };
        } else {
          // Like
          return { ...post, likes: post.likes + 1, likedBy: [...post.likedBy, currentUser.id] };
        }
      }
      return post;
    }));
  };
  
  const handleLikeComment = (postId: number, commentId: number) => {
    if (!currentUser) return;

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.id === commentId) {
              const isLiked = comment.likedBy.includes(currentUser.id);
              if (isLiked) {
                // Unlike
                return {
                  ...comment,
                  likes: comment.likes - 1,
                  likedBy: comment.likedBy.filter(id => id !== currentUser.id),
                };
              } else {
                // Like
                return {
                  ...comment,
                  likes: comment.likes + 1,
                  likedBy: [...comment.likedBy, currentUser.id],
                };
              }
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );
  };

  const handleRatePost = (postId: number, rating: number) => {
    setPosts(posts.map(post => 
        post.id === postId ? { ...post, rating } : post
    ));
  };

  const handleCreatePost = (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'timestamp' | 'likedBy' | 'repostOf'>) => {
    if (!currentUser) return;
    const newPost: Post = {
        ...postData,
        id: Date.now(),
        author: currentUser,
        likes: 0,
        comments: [],
        timestamp: 'Just now',
        likedBy: [],
        field: postData.field || currentUser.specialization,
    };
    setPosts([newPost, ...posts]);
  };

  const handleCommentPost = (postId: number, commentText: string) => {
      if(!currentUser) return;

      const newComment: Comment = {
          id: Date.now(),
          author: currentUser,
          text: commentText,
          timestamp: 'Just now',
          likes: 0,
          likedBy: [],
      };

      setPosts(posts.map(post => {
          if (post.id === postId) {
              return { ...post, comments: [...post.comments, newComment] };
          }
          return post;
      }));
  };

  const handleFollowToggle = (targetUserId: number) => {
      if (!currentUser) return;

      setAllUsers(prevUsers => {
          const updatedUsers = [...prevUsers];
          
          const currentUserIndex = updatedUsers.findIndex(u => u.id === currentUser.id);
          const targetUserIndex = updatedUsers.findIndex(u => u.id === targetUserId);

          if (currentUserIndex === -1 || targetUserIndex === -1) return prevUsers;

          const isFollowing = updatedUsers[currentUserIndex].followingIds.includes(targetUserId);

          if (isFollowing) {
              // Unfollow
              updatedUsers[currentUserIndex].following--;
              updatedUsers[currentUserIndex].followingIds = updatedUsers[currentUserIndex].followingIds.filter(id => id !== targetUserId);
              updatedUsers[targetUserIndex].followers--;
          } else {
              // Follow
              updatedUsers[currentUserIndex].following++;
              updatedUsers[currentUserIndex].followingIds.push(targetUserId);
              updatedUsers[targetUserIndex].followers++;
          }
          
          setCurrentUser(updatedUsers[currentUserIndex]);
          return updatedUsers;
      });
  };
  
  const handleViewProfile = (userId: number) => {
      setViewedUserId(userId);
      setCurrentPage('profile');
      window.scrollTo(0, 0);
  };

  const handleStartChat = (user: User) => {
    setChattingWith(user);
  };
  
  const handleOpenEditModal = (post: Post) => {
    setEditingPost(post);
  };
  
  const handleUpdatePost = (updatedData: { courseName: string; review: string; rating: number; }) => {
    if (!editingPost) return;
    setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...updatedData } : p));
    setEditingPost(null);
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUsers = allUsers.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u);
    setAllUsers(updatedUsers);
    setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
  };

  const handleOpenDeleteConfirm = (post: Post) => {
    setPostToDelete(post);
  };

  const handleCloseDeleteConfirm = () => {
    setPostToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
      setPostToDelete(null);
    }
  };

  const handleOpenReportConfirm = (post: Post) => {
    setPostToReport(post);
  };

  const handleCloseReportConfirm = () => {
    setPostToReport(null);
  };

  const handleConfirmReport = () => {
    if (postToReport) {
      console.log(`Post ${postToReport.id} by ${postToReport.author.username} reported by ${currentUser?.username}.`);
      setHiddenPostIds(prev => [...prev, postToReport!.id]);
      setPostToReport(null);
    }
  };
  
  const handleBlockUser = (userIdToBlock: number) => {
    if (!currentUser) return;
    const userToBlock = allUsers.find(u => u.id === userIdToBlock);
    
    if (userToBlock && userToBlock.id !== currentUser.id && !currentUser.blockedUserIds.includes(userIdToBlock)) {
      console.log(`User ${currentUser?.username} blocked user ${userToBlock.username}.`);
      
      const updatedUser = {
        ...currentUser,
        blockedUserIds: [...currentUser.blockedUserIds, userIdToBlock],
      };
      
      setCurrentUser(updatedUser);
      setAllUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const handleViewCommunity = (course: Course) => {
    setViewedCommunity(course);
    setCurrentPage('community');
    window.scrollTo(0, 0);
  };

  const handleJoinCommunityToggle = (field: string) => {
    if (!currentUser) return;

    const isJoined = currentUser.joinedCommunities.includes(field);
    let updatedCommunities: string[];

    if (isJoined) {
      updatedCommunities = currentUser.joinedCommunities.filter(c => c !== field);
    } else {
      updatedCommunities = [...currentUser.joinedCommunities, field];
    }
    
    const updatedUser = { ...currentUser, joinedCommunities: updatedCommunities };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };
  
  const handleCreateCommunity = (communityData: Omit<Course, 'id' | 'rating' | 'platform' | 'ownerId'>) => {
    if (!currentUser) return;
    const newCommunity: Course = {
      ...communityData,
      id: Date.now(),
      rating: 0,
      platform: 'Community',
      ownerId: currentUser.id,
    };
    setCourses(prev => [newCommunity, ...prev]);
    
    // Automatically join the community upon creation
    if (!currentUser.joinedCommunities.includes(newCommunity.field)) {
      const updatedUser = {
        ...currentUser,
        joinedCommunities: [...currentUser.joinedCommunities, newCommunity.field],
      };
      setCurrentUser(updatedUser);
      setAllUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const handleUpdateCommunity = (updatedData: Partial<Course>) => {
    if (!editingCommunity) return;
    const updatedCourses = courses.map(c => c.id === editingCommunity.id ? { ...c, ...updatedData } : c);
    setCourses(updatedCourses);
    setViewedCommunity(prev => prev ? { ...prev, ...updatedData } : null);
    setEditingCommunity(null);
  };
  
  const handleConfirmDeleteCommunity = () => {
    if (!communityToDelete) return;
    // Also remove posts associated with this community
    setPosts(prev => prev.filter(p => p.field !== communityToDelete.field || !p.isCommunityPost));
    setCourses(prev => prev.filter(c => c.id !== communityToDelete.id));
    setCommunityToDelete(null);
    setCurrentPage('discover');
  };
  
  const handleRepost = (postId: number) => {
    if(!currentUser) return;

    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;

    // Prevent reposting a repost
    if (originalPost.repostOf) return;
    
    // Prevent reposting own post
    if (originalPost.author.id === currentUser.id) return;
    
    const newRepost: Post = {
        id: Date.now(),
        author: currentUser,
        courseName: '', // Reposts don't have titles
        review: '', // Reposts don't have reviews
        rating: 0,
        likes: 0,
        comments: [],
        timestamp: 'Just now',
        likedBy: [],
        field: originalPost.field,
        isCommunityPost: originalPost.isCommunityPost,
        repostOf: originalPost,
    };

    setPosts(prev => [newRepost, ...prev]);
  };
  
  const handleSaveRoadmap = (roadmapKey: string, roadmapData: Roadmap) => {
    const newKey = roadmapKey.toLowerCase().replace(/\s+/g, '-');
    setSavedRoadmaps(prev => ({
      ...prev,
      [newKey]: roadmapData,
    }));
  };

  // --- ADMIN FUNCTIONS ---
  const handleAdminUpdateUser = (userId: number, updatedData: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
  };
  
  const handleAdminDeleteUser = (userId: number) => {
    if (currentUser && userId === currentUser.id) {
        alert("You cannot delete your own account from the admin panel.");
        return;
    }
    // Also remove posts and comments by this user for data consistency
    setPosts(prev => {
        const postsAfterDeletion = prev.filter(p => p.author.id !== userId);
        return postsAfterDeletion.map(p => ({
            ...p,
            comments: p.comments.filter(c => c.author.id !== userId)
        }));
    });
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleAdminUpdatePost = (postId: number, updatedData: Partial<Post>) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updatedData } : p));
  };

  const handleAdminDeletePost = (postId: number) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleAdminUpdateCommunity = (courseId: number, updatedData: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updatedData } : c));
  };

  const handleAdminDeleteCommunity = (courseId: number) => {
    const communityToDelete = courses.find(c => c.id === courseId);
    if (communityToDelete) {
        setPosts(prev => prev.filter(p => p.field !== communityToDelete.field || !p.isCommunityPost));
        setCourses(prev => prev.filter(c => c.id !== courseId));
    }
  };


  const navigate = (page: Page) => {
    if (page === 'profile' && currentUser) {
      setViewedUserId(currentUser.id);
    }
    setSearchQuery('');
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleMarkNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const visiblePosts = useMemo(() => {
    if (!currentUser) return posts;
    const blockedIds = currentUser.blockedUserIds || [];
    return posts.filter(post => {
      const authorId = post.author.id;
      const originalAuthorId = post.repostOf?.author.id;
      
      return !hiddenPostIds.includes(post.id) &&
             !blockedIds.includes(authorId) &&
             (!originalAuthorId || !blockedIds.includes(originalAuthorId));
    });
  }, [posts, currentUser, hiddenPostIds]);


  const renderAppPage = () => {
    if (!currentUser) return null;

    switch(currentPage) {
        case 'home':
            return <HomePage posts={visiblePosts} currentUser={currentUser} allUsers={allUsers} onLikePost={handleLikePost} onLikeComment={handleLikeComment} onCreatePost={handleCreatePost} onCommentPost={handleCommentPost} onViewProfile={handleViewProfile} onRatePost={handleRatePost} onEditPost={handleOpenEditModal} onDeleteRequest={handleOpenDeleteConfirm} onReportRequest={handleOpenReportConfirm} onBlockUser={handleBlockUser} onRepost={handleRepost} searchQuery={searchQuery} />;
        case 'discover':
            return <DiscoverPage courses={courses} searchQuery={searchQuery} onViewCommunity={handleViewCommunity} onCreateCommunity={handleCreateCommunity} />;
        case 'roadmap':
            return <RoadmapPage 
                        roadmaps={savedRoadmaps}
                        onSaveRoadmap={handleSaveRoadmap}
                        allPosts={visiblePosts}
                        allUsers={allUsers}
                        currentUser={currentUser}
                        initialRoadmapKey={initialRoadmapKey}
                        setCurrentPage={navigate}
                        setSearchQuery={setSearchQuery}
                        onViewProfile={handleViewProfile}
                   />;
        case 'community':
            if (!viewedCommunity) {
                return <DiscoverPage courses={courses} searchQuery={searchQuery} onViewCommunity={handleViewCommunity} onCreateCommunity={handleCreateCommunity} />;
            }
            return <CommunityPage
                community={viewedCommunity}
                currentUser={currentUser}
                allUsers={allUsers}
                allPosts={visiblePosts}
                courses={courses}
                onJoinToggle={handleJoinCommunityToggle}
                onViewProfile={handleViewProfile}
                onLikePost={handleLikePost}
                onLikeComment={handleLikeComment}
                onCommentPost={handleCommentPost}
                onCreatePost={handleCreatePost}
                onRatePost={handleRatePost}
                onEditPost={handleOpenEditModal}
                onDeleteRequest={handleOpenDeleteConfirm}
                onReportRequest={handleOpenReportConfirm}
                onBlockUser={handleBlockUser}
                onRepost={handleRepost}
                setCurrentPage={navigate}
                onEditCommunity={() => setEditingCommunity(viewedCommunity)}
                onDeleteCommunity={() => setCommunityToDelete(viewedCommunity)}
            />;
        case 'profile':
            const profileUser = allUsers.find(u => u.id === viewedUserId) ?? currentUser;
            return <ProfilePage 
                        profileUser={profileUser} 
                        currentUser={currentUser} 
                        allPosts={visiblePosts}
                        allUsers={allUsers}
                        courses={courses}
                        onLogout={handleLogout}
                        onLikePost={handleLikePost}
                        onLikeComment={handleLikeComment}
                        onCommentPost={handleCommentPost}
                        onViewProfile={handleViewProfile}
                        onFollowToggle={handleFollowToggle}
                        setCurrentPage={navigate}
                        onStartChat={handleStartChat}
                        onRatePost={handleRatePost}
                        onEditPost={handleOpenEditModal}
                        onDeleteRequest={handleOpenDeleteConfirm}
                        onReportRequest={handleOpenReportConfirm}
                        onBlockUser={handleBlockUser}
                        onRepost={handleRepost}
                        onViewCommunity={handleViewCommunity}
                        theme={theme}
                        onToggleTheme={handleToggleTheme}
                        onUpdateProfile={handleUpdateProfile}
                    />;
        case 'admin':
            if (!currentUser.isAdmin) {
                // Redirect non-admins away from this page
                return <HomePage posts={visiblePosts} currentUser={currentUser} allUsers={allUsers} onLikePost={handleLikePost} onLikeComment={handleLikeComment} onCreatePost={handleCreatePost} onCommentPost={handleCommentPost} onViewProfile={handleViewProfile} onRatePost={handleRatePost} onEditPost={handleOpenEditModal} onDeleteRequest={handleOpenDeleteConfirm} onReportRequest={handleOpenReportConfirm} onBlockUser={handleBlockUser} onRepost={handleRepost} searchQuery={searchQuery} />;
            }
            return <AdminPage 
                allUsers={allUsers}
                allPosts={posts}
                allCourses={courses}
                onUpdateUser={handleAdminUpdateUser}
                onDeleteUser={handleAdminDeleteUser}
                onUpdatePost={handleAdminUpdatePost}
                onDeletePost={handleAdminDeletePost}
                onUpdateCommunity={handleAdminUpdateCommunity}
                onDeleteCommunity={handleAdminDeleteCommunity}
            />;
        default:
            return <HomePage posts={visiblePosts} currentUser={currentUser} allUsers={allUsers} onLikePost={handleLikePost} onLikeComment={handleLikeComment} onCreatePost={handleCreatePost} onCommentPost={handleCommentPost} onViewProfile={handleViewProfile} onRatePost={handleRatePost} onEditPost={handleOpenEditModal} onDeleteRequest={handleOpenDeleteConfirm} onReportRequest={handleOpenReportConfirm} onBlockUser={handleBlockUser} onRepost={handleRepost} searchQuery={searchQuery} />;
    }
  }

  const renderContent = () => {
    if (currentPage === 'about') return <AboutPage setCurrentPage={navigate} />;
    if (currentPage === 'privacy') return <PrivacyPage setCurrentPage={navigate} />;
    if (currentPage === 'terms') return <TermsPage setCurrentPage={navigate} />;
    if (currentPage === 'support') return <SupportPage setCurrentPage={navigate} />;
    
    if (!currentUser) {
        return <LandingPage onLogin={handleLogin} onSignup={handleSignup} setCurrentPage={navigate} />;
    }

    return (
        <Layout
            currentPage={currentPage}
            setCurrentPage={navigate}
            currentUser={currentUser}
            notifications={notifications}
            onMarkNotificationAsRead={handleMarkNotificationAsRead}
            onClearAllNotifications={handleClearAllNotifications}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        >
          {renderAppPage()}
        </Layout>
    );
  };

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {renderContent()}
      {currentUser && chattingWith && (
        <ChatPage 
          currentUser={currentUser}
          chatUser={chattingWith}
          onClose={() => setChattingWith(null)}
        />
      )}
      {editingPost && (
        <EditPostModal
            post={editingPost}
            onSave={handleUpdatePost}
            onClose={() => setEditingPost(null)}
        />
      )}
      {editingCommunity && (
        <EditCommunityModal
          community={editingCommunity}
          onSave={handleUpdateCommunity}
          onClose={() => setEditingCommunity(null)}
        />
      )}
      <AnimatePresence>
        {postToDelete && (
             <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseDeleteConfirm}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <GlassCard className="w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Confirm Deletion</h2>
                        <p className="text-[var(--text-secondary)] mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={handleCloseDeleteConfirm} className="px-4 py-2 bg-transparent text-[var(--text-secondary)] font-semibold rounded-full hover:bg-[var(--hover-bg)]">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {postToReport && (
             <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseReportConfirm}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <GlassCard className="w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Report Post</h2>
                        <p className="text-[var(--text-secondary)] mb-6">Are you sure you want to report this post for review by our moderation team?</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={handleCloseReportConfirm} className="px-4 py-2 bg-transparent text-[var(--text-secondary)] font-semibold rounded-full hover:bg-[var(--hover-bg)]">
                                Cancel
                            </button>
                            <button onClick={handleConfirmReport} className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600">
                                Report
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
       <AnimatePresence>
        {communityToDelete && (
             <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCommunityToDelete(null)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <GlassCard className="w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Delete Community</h2>
                        <p className="text-[var(--text-secondary)] mb-6">Are you sure you want to delete the <span className='font-bold'>{communityToDelete.title}</span> community? All associated posts will also be removed. This action is irreversible.</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setCommunityToDelete(null)} className="px-4 py-2 bg-transparent text-[var(--text-secondary)] font-semibold rounded-full hover:bg-[var(--hover-bg)]">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDeleteCommunity} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;