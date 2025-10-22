import React, { useState } from 'react';
import { Page, User, Post, ChatMessage, Course, RoadmapStep } from './types';
import { users, initialPosts, courses, roadmapSteps, initialChatMessages } from './constants';

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


type UserSignUpData = Omit<User, 'id' | 'avatarUrl' | 'followers' | 'following' | 'studyYear'> & {
    studyYear: string;
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  const handleLogin = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setCurrentPage('home');
    } else {
      alert("User not found. Please sign up.");
    }
  };

  const handleSignup = (formData: UserSignUpData) => {
    const newUser: User = { 
      id: users.length + 1,
      name: formData.name,
      username: formData.username,
      email: formData.email,
      avatarUrl: `https://picsum.photos/seed/${formData.username}/100/100`,
      specialization: formData.specialization,
      studyYear: parseInt(formData.studyYear, 10) || 1,
      followers: 0,
      following: 0,
      university: formData.university,
    };
    users.push(newUser); // In a real app, this would be an API call
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

  const handleCreatePost = (postData: Omit<Post, 'id' | 'author' | 'likes' | 'commentsCount' | 'timestamp' | 'likedBy'>) => {
    if (!currentUser) return;
    const newPost: Post = {
        ...postData,
        id: Date.now(),
        author: currentUser,
        likes: 0,
        commentsCount: 0,
        timestamp: 'Just now',
        likedBy: [],
    };
    setPosts([newPost, ...posts]);
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;
    const newMessage: ChatMessage = {
        id: Date.now(),
        sender: currentUser,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([...chatMessages, newMessage]);
  }
  
  const handleSetPage = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderAppPage = () => {
    if (!currentUser) return null;

    switch(currentPage) {
        case 'home':
            return <HomePage posts={posts} currentUser={currentUser} onLikePost={handleLikePost} onCreatePost={handleCreatePost} />;
        case 'discover':
            return <DiscoverPage courses={courses} />;
        case 'roadmap':
            return <RoadmapPage roadmapSteps={roadmapSteps} />;
        case 'profile':
            return <ProfilePage currentUser={currentUser} onLogout={handleLogout} />;
        default:
            return <HomePage posts={posts} currentUser={currentUser} onLikePost={handleLikePost} onCreatePost={handleCreatePost} />;
    }
  }

  const renderContent = () => {
    if (currentPage === 'about') return <AboutPage setCurrentPage={handleSetPage} />;
    if (currentPage === 'privacy') return <PrivacyPage setCurrentPage={handleSetPage} />;
    if (currentPage === 'terms') return <TermsPage setCurrentPage={handleSetPage} />;
    if (currentPage === 'support') return <SupportPage setCurrentPage={handleSetPage} />;
    
    if (!currentUser) {
        return <LandingPage onLogin={handleLogin} onSignup={handleSignup} setCurrentPage={handleSetPage} />;
    }
    
    return (
        <Layout
            currentPage={currentPage}
            setCurrentPage={handleSetPage}
            chatMessages={chatMessages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
        >
          {renderAppPage()}
        </Layout>
    );
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      {renderContent()}
    </div>
  );
};

export default App;