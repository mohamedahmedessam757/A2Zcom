import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, User, Post, Course, Theme, Notification } from './types';
import { useAppContext } from './contexts/AppContext';
import { authService } from './services/authService';
import { postService } from './services/postService';
import { userService } from './services/userService';
import { courseService } from './services/courseService';
import { roadmapService } from './services/roadmapService';
import { notificationService } from './services/notificationService';

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
    password?: string;
};


const App: React.FC = () => {
  const { currentUser, allUsers, posts, courses, roadmaps, notifications, loading, refreshData, setCurrentUser } = useAppContext();

  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [viewedUserId, setViewedUserId] = useState<number | null>(null);
  const [chattingWith, setChattingWith] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postToReport, setPostToReport] = useState<Post | null>(null);
  const [hiddenPostIds, setHiddenPostIds] = useState<number[]>([]);
  const [viewedCommunity, setViewedCommunity] = useState<Course | null>(null);
  const [editingCommunity, setEditingCommunity] = useState<Course | null>(null);
  const [communityToDelete, setCommunityToDelete] = useState<Course | null>(null);
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

  useEffect(() => {
    if (currentUser) {
      setCurrentPage('home');
    } else if (!loading) {
      setCurrentPage('landing');
    }
  }, [currentUser, loading]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
      await refreshData();

      const urlParams = new URLSearchParams(window.location.search);
      const roadmapKey = urlParams.get('roadmap');
      if (roadmapKey && roadmaps[roadmapKey]) {
        setInitialRoadmapKey(roadmapKey);
        setCurrentPage('roadmap');
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setCurrentPage('home');
      }
    } catch (error: any) {
      alert(error.message || "Login failed. Please check your credentials.");
    }
  };

  const handleSignup = async (formData: UserSignUpData) => {
    try {
      if (!formData.password) {
        alert("Password is required");
        return;
      }

      await authService.signUp(formData.email, formData.password, {
        name: formData.name,
        username: formData.username,
        specialization: formData.specialization,
        studyYear: parseInt(formData.studyYear, 10) || 1,
        university: formData.university,
      });

      await refreshData();
      setCurrentPage('home');
    } catch (error: any) {
      alert(error.message || "Signup failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      setCurrentPage('landing');
    } catch (error: any) {
      alert(error.message || "Logout failed.");
    }
  };

  const handleLikePost = async (postId: number) => {
    if (!currentUser) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      await postService.likePost(postId, currentUser.id.toString(), post.likes, post.likedBy);
      await refreshData();
    } catch (error: any) {
      console.error('Error liking post:', error);
    }
  };

  const handleLikeComment = async (postId: number, commentId: number) => {
    if (!currentUser) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const comment = post.comments.find(c => c.id === commentId);
      if (!comment) return;

      await postService.likeComment(commentId, currentUser.id.toString(), comment.likes, comment.likedBy);
      await refreshData();
    } catch (error: any) {
      console.error('Error liking comment:', error);
    }
  };

  const handleRatePost = async (postId: number, rating: number) => {
    try {
      await postService.updatePost(postId, { rating });
      await refreshData();
    } catch (error: any) {
      console.error('Error rating post:', error);
    }
  };

  const handleCreatePost = async (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'timestamp' | 'likedBy' | 'repostOf'>) => {
    if (!currentUser) return;

    try {
      await postService.createPost({
        author_id: currentUser.id.toString(),
        course_name: postData.courseName || '',
        review: postData.review,
        rating: postData.rating,
        image_urls: postData.imageUrls,
        link_url: postData.linkUrl,
        field: postData.field || currentUser.specialization,
        is_community_post: postData.isCommunityPost || false,
      });

      await refreshData();
    } catch (error: any) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleCommentPost = async (postId: number, commentText: string) => {
      if(!currentUser) return;

      try {
        await postService.addComment({
          post_id: postId,
          author_id: currentUser.id.toString(),
          text: commentText,
        });

        await refreshData();
      } catch (error: any) {
        console.error('Error adding comment:', error);
      }
  };

  const handleFollowToggle = async (targetUserId: number) => {
      if (!currentUser) return;

      try {
        const isFollowing = currentUser.followingIds.includes(targetUserId);
        await userService.followUser(currentUser.id.toString(), targetUserId.toString(), isFollowing);
        await refreshData();
      } catch (error: any) {
        console.error('Error toggling follow:', error);
      }
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

  const handleUpdatePost = async (updatedData: { courseName: string; review: string; rating: number; }) => {
    if (!editingPost) return;

    try {
      await postService.updatePost(editingPost.id, {
        course_name: updatedData.courseName,
        review: updatedData.review,
        rating: updatedData.rating,
      });

      setEditingPost(null);
      await refreshData();
    } catch (error: any) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;

    try {
      await userService.updateUser(currentUser.id.toString(), {
        name: updatedData.name,
        specialization: updatedData.specialization,
        study_year: updatedData.studyYear,
        avatar_url: updatedData.avatarUrl,
      });

      await refreshData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleOpenDeleteConfirm = (post: Post) => {
    setPostToDelete(post);
  };

  const handleCloseDeleteConfirm = () => {
    setPostToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await postService.deletePost(postToDelete.id);
      setPostToDelete(null);
      await refreshData();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
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

  const handleBlockUser = async (userIdToBlock: number) => {
    if (!currentUser) return;

    const userToBlock = allUsers.find(u => u.id === userIdToBlock);

    if (userToBlock && userToBlock.id !== currentUser.id && !currentUser.blockedUserIds.includes(userIdToBlock)) {
      console.log(`User ${currentUser?.username} blocked user ${userToBlock.username}.`);

      try {
        await userService.updateUser(currentUser.id.toString(), {
          blocked_user_ids: [...currentUser.blockedUserIds, userIdToBlock],
        });

        await refreshData();
      } catch (error: any) {
        console.error('Error blocking user:', error);
      }
    }
  };

  const handleViewCommunity = (course: Course) => {
    setViewedCommunity(course);
    setCurrentPage('community');
    window.scrollTo(0, 0);
  };

  const handleJoinCommunityToggle = async (field: string) => {
    if (!currentUser) return;

    try {
      const isJoined = currentUser.joinedCommunities.includes(field);
      await userService.joinCommunity(currentUser.id.toString(), field, isJoined);
      await refreshData();
    } catch (error: any) {
      console.error('Error toggling community join:', error);
    }
  };

  const handleCreateCommunity = async (communityData: Omit<Course, 'id' | 'rating' | 'platform' | 'ownerId'>) => {
    if (!currentUser) return;

    try {
      await courseService.createCourse({
        title: communityData.title,
        field: communityData.field,
        description: communityData.description,
        image_url: communityData.imageUrl,
        platform: 'Community',
        owner_id: currentUser.id.toString(),
      });

      await userService.joinCommunity(currentUser.id.toString(), communityData.field, false);
      await refreshData();
    } catch (error: any) {
      console.error('Error creating community:', error);
      alert('Failed to create community. Please try again.');
    }
  };

  const handleUpdateCommunity = async (updatedData: Partial<Course>) => {
    if (!editingCommunity) return;

    try {
      await courseService.updateCourse(editingCommunity.id, {
        title: updatedData.title,
        description: updatedData.description,
        image_url: updatedData.imageUrl,
      });

      setViewedCommunity(prev => prev ? { ...prev, ...updatedData } : null);
      setEditingCommunity(null);
      await refreshData();
    } catch (error: any) {
      console.error('Error updating community:', error);
      alert('Failed to update community. Please try again.');
    }
  };

  const handleConfirmDeleteCommunity = async () => {
    if (!communityToDelete) return;

    try {
      await courseService.deleteCourse(communityToDelete.id);
      setCommunityToDelete(null);
      setCurrentPage('discover');
      await refreshData();
    } catch (error: any) {
      console.error('Error deleting community:', error);
      alert('Failed to delete community. Please try again.');
    }
  };

  const handleRepost = async (postId: number) => {
    if(!currentUser) return;

    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;

    if (originalPost.repostOf) return;
    if (originalPost.author.id === currentUser.id) return;

    try {
      await postService.createPost({
        author_id: currentUser.id.toString(),
        course_name: '',
        review: '',
        rating: 0,
        field: originalPost.field,
        is_community_post: originalPost.isCommunityPost,
        repost_of_id: originalPost.id,
      });

      await refreshData();
    } catch (error: any) {
      console.error('Error reposting:', error);
    }
  };

  const handleSaveRoadmap = async (roadmapKey: string, roadmapData: any) => {
    if (!currentUser) return;

    try {
      const newKey = roadmapKey.toLowerCase().replace(/\s+/g, '-');
      await roadmapService.saveRoadmap(currentUser.id.toString(), newKey, roadmapData);
      await refreshData();
    } catch (error: any) {
      console.error('Error saving roadmap:', error);
      alert('Failed to save roadmap. Please try again.');
    }
  };

  const handleAdminUpdateUser = async (userId: number, updatedData: Partial<User>) => {
    try {
      await userService.updateUser(userId.toString(), {
        name: updatedData.name,
        is_active: updatedData.isActive,
      });
      await refreshData();
    } catch (error: any) {
      console.error('Error updating user:', error);
    }
  };

  const handleAdminDeleteUser = async (userId: number) => {
    if (currentUser && userId === currentUser.id) {
        alert("You cannot delete your own account from the admin panel.");
        return;
    }

    try {
      console.log('Admin delete user not fully implemented in backend');
    } catch (error: any) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAdminUpdatePost = async (postId: number, updatedData: Partial<Post>) => {
    try {
      await postService.updatePost(postId, {
        course_name: updatedData.courseName,
        review: updatedData.review,
        rating: updatedData.rating,
      });
      await refreshData();
    } catch (error: any) {
      console.error('Error updating post:', error);
    }
  };

  const handleAdminDeletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      await refreshData();
    } catch (error: any) {
      console.error('Error deleting post:', error);
    }
  };

  const handleAdminUpdateCommunity = async (courseId: number, updatedData: Partial<Course>) => {
    try {
      await courseService.updateCourse(courseId, {
        title: updatedData.title,
        description: updatedData.description,
      });
      await refreshData();
    } catch (error: any) {
      console.error('Error updating community:', error);
    }
  };

  const handleAdminDeleteCommunity = async (courseId: number) => {
    try {
      await courseService.deleteCourse(courseId);
      await refreshData();
    } catch (error: any) {
      console.error('Error deleting community:', error);
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

  const handleMarkNotificationAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      await refreshData();
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleClearAllNotifications = async () => {
    if (!currentUser) return;

    try {
      await notificationService.markAllAsRead(currentUser.id.toString());
      await refreshData();
    } catch (error: any) {
      console.error('Error clearing notifications:', error);
    }
  };

  const visiblePosts = React.useMemo(() => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  const renderAppPage = () => {
    if (!currentUser) return null;

    switch(currentPage) {
        case 'home':
            return <HomePage posts={visiblePosts} currentUser={currentUser} allUsers={allUsers} onLikePost={handleLikePost} onLikeComment={handleLikeComment} onCreatePost={handleCreatePost} onCommentPost={handleCommentPost} onViewProfile={handleViewProfile} onRatePost={handleRatePost} onEditPost={handleOpenEditModal} onDeleteRequest={handleOpenDeleteConfirm} onReportRequest={handleOpenReportConfirm} onBlockUser={handleBlockUser} onRepost={handleRepost} searchQuery={searchQuery} />;
        case 'discover':
            return <DiscoverPage courses={courses} searchQuery={searchQuery} onViewCommunity={handleViewCommunity} onCreateCommunity={handleCreateCommunity} />;
        case 'roadmap':
            return <RoadmapPage
                        roadmaps={roadmaps}
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
