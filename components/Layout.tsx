import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, Notification, User } from '../types';
import { HomeIcon, DiscoverIcon, ChatIcon, ProfileIcon, Logo, BellIcon, LikeIcon, CommentIcon, UsersIcon, SearchIcon, AdminIcon } from './icons';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: number) => void;
  onClearAllNotifications: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const navItems: { page: Page; icon: React.FC<any>; adminOnly?: boolean }[] = [
  { page: 'home', icon: HomeIcon },
  { page: 'discover', icon: DiscoverIcon },
  { page: 'roadmap', icon: ChatIcon }, 
  { page: 'admin', icon: AdminIcon, adminOnly: true },
];

const notificationIcons = {
    like: LikeIcon,
    comment: CommentIcon,
    follow: UsersIcon,
};

const NotificationBell: React.FC<{
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
    onClearAll: () => void;
    direction?: 'up' | 'down';
}> = ({ notifications, onMarkAsRead, onClearAll, direction = 'up' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const getNotificationMessage = (n: Notification) => {
        switch (n.type) {
            case 'like':
                return <><span className="font-bold">{n.user.name}</span> liked your post: "{n.post?.courseName}"</>;
            case 'comment':
                return <><span className="font-bold">{n.user.name}</span> commented on your post: "{n.post?.courseName}"</>;
            case 'follow':
                return <><span className="font-bold">{n.user.name}</span> started following you.</>;
            default:
                return 'New notification';
        }
    };

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-3 rounded-xl hover:bg-[var(--hover-bg)] transition-colors">
                <BellIcon className="w-7 h-7 text-[var(--text-secondary)]" />
                {unreadCount > 0 && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[var(--sidebar-bg)]">
                        {unreadCount}
                    </div>
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute w-80 bg-[var(--notification-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-lg shadow-2xl z-50 ${
                            direction === 'up' 
                                ? 'bottom-full mb-2 -right-4 sm:left-1/2 sm:-translate-x-1/2' 
                                : 'top-full mt-2 right-0'
                        }`}
                    >
                        <div className="p-3 flex justify-between items-center border-b border-[var(--card-border)]">
                            <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
                            {notifications.length > 0 && <button onClick={onClearAll} className="text-sm text-[var(--primary-accent)] hover:underline">Clear all</button>}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(n => {
                                    const Icon = notificationIcons[n.type];
                                    return (
                                        <div key={n.id} onClick={() => onMarkAsRead(n.id)} className={`flex items-start gap-3 p-3 border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)] cursor-pointer ${!n.read ? '' : 'opacity-60'}`}>
                                            <div className="relative">
                                                <img src={n.user.avatarUrl} alt={n.user.name} className="w-10 h-10 rounded-full" />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--primary-accent)] text-black rounded-full flex items-center justify-center border-2 border-[var(--card-bg)]">
                                                    <Icon className="w-3 h-3"/>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-[var(--text-secondary)]">{getNotificationMessage(n)}</p>
                                                <p className="text-xs text-[var(--text-secondary)]/70 mt-1">{n.timestamp}</p>
                                            </div>
                                            {!n.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full self-center flex-shrink-0"></div>}
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-center text-[var(--text-secondary)] text-sm p-6">No new notifications.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const MobileNavBar: React.FC<{ currentPage: Page; setCurrentPage: (page: Page) => void; currentUser: User; }> = ({ currentPage, setCurrentPage, currentUser }) => {
    const mobileNavItems: { page: Page; icon: React.FC<any>; }[] = [...navItems.filter(item => !item.adminOnly || currentUser.isAdmin), { page: 'profile', icon: ProfileIcon }];
    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-[calc(100%-2rem)] max-w-sm bg-[var(--sidebar-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-full p-2 z-50">
            <div className="flex justify-around">
                {mobileNavItems.map(({ page, icon: Icon }) => (
                    <button key={page} onClick={() => setCurrentPage(page)} className="relative flex-1 p-2 text-center">
                        <Icon className={`w-6 h-6 mx-auto transition-colors ${currentPage === page ? 'text-[var(--primary-accent)]' : 'text-[var(--text-secondary)]'}`} />
                        {currentPage === page && (
                            <div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-accent)]"
                            />
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage, currentUser, notifications, onMarkNotificationAsRead, onClearAllNotifications, searchQuery, setSearchQuery }) => {
  const showSearch = currentPage === 'home' || currentPage === 'discover';
    
  return (
    <div className="w-full text-[var(--text-primary)]">
      <nav className="hidden lg:flex flex-col items-center gap-2 p-4 bg-[var(--sidebar-bg)] backdrop-blur-xl border-r border-[var(--card-border)] fixed top-0 left-0 h-full w-24 z-20">
        <div className="flex flex-col items-center gap-4 mt-8">
            {navItems.map(({ page, icon: Icon, adminOnly }) => {
                if (adminOnly && !currentUser.isAdmin) return null;
                return (
                    <button key={page} onClick={() => setCurrentPage(page)} className="relative p-3 rounded-xl hover:bg-[var(--hover-bg)] transition-colors">
                        <Icon className={`w-7 h-7 transition-colors ${currentPage === page ? 'text-[var(--primary-accent)]' : 'text-[var(--text-secondary)]'}`} />
                        {currentPage === page && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary-accent)] rounded-r-full" />
                        )}
                    </button>
                );
            })}
        </div>
        <div className="mt-auto flex flex-col items-center gap-4">
            <NotificationBell notifications={notifications} onMarkAsRead={onMarkNotificationAsRead} onClearAll={onClearAllNotifications} />
            <button onClick={() => setCurrentPage('profile')} className="relative p-3 rounded-xl hover:bg-[var(--hover-bg)] transition-colors">
                <ProfileIcon className={`w-7 h-7 transition-colors ${currentPage === 'profile' ? 'text-[var(--primary-accent)]' : 'text-[var(--text-secondary)]'}`} />
                 {currentPage === 'profile' && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary-accent)] rounded-r-full" />
                )}
            </button>
        </div>
      </nav>
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-24">
        <header className="flex-shrink-0 sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--card-border)]">
            <div className={`flex items-center justify-between gap-4 max-w-6xl mx-auto p-4`}>
                <div className="flex-1 flex justify-start">
                    <Logo />
                </div>
                
                {showSearch && (
                    <div className={`relative w-full max-w-md`}>
                        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-full pl-10 pr-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                        />
                    </div>
                )}
                
                {currentPage !== 'home' && currentPage !== 'discover' &&
                    <h1 className={`text-2xl font-bold capitalize ${currentPage === 'profile' ? 'invisible' : ''}`}>
                        {currentPage}
                    </h1>
                }

                 <div className="flex-1 flex justify-end">
                    <div className="lg:hidden">
                        <NotificationBell notifications={notifications} onMarkAsRead={onMarkNotificationAsRead} onClearAll={onClearAllNotifications} direction="down" />
                    </div>
                 </div>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
      </div>
      <MobileNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} />
    </div>
  );
};

export default Layout;