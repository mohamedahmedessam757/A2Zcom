import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Post, Course } from '../types';
import GlassCard from '../components/GlassCard';
import { UsersIcon, EditIcon, TrashIcon, MessageSquareIcon, BookIcon } from '../components/icons';

type AdminTab = 'overview' | 'users' | 'posts' | 'communities';

const StatCard: React.FC<{ title: string, value: number, icon: React.FC<any> }> = ({ title, value, icon: Icon }) => (
    <GlassCard>
        <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--primary-accent)]/10 rounded-lg">
                <Icon className="w-6 h-6 text-[var(--primary-accent)]" />
            </div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-[var(--text-secondary)]">{title}</p>
            </div>
        </div>
    </GlassCard>
);

const ConfirmationModal: React.FC<{ title: string, message: string, onConfirm: () => void, onCancel: () => void }> = ({ title, message, onConfirm, onCancel }) => (
    <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCancel}
    >
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
        >
            <GlassCard className="w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{title}</h2>
                <p className="text-[var(--text-secondary)] mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-transparent text-[var(--text-secondary)] font-semibold rounded-full hover:bg-[var(--hover-bg)]">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700">Confirm</button>
                </div>
            </GlassCard>
        </motion.div>
    </motion.div>
);


interface AdminPageProps {
    allUsers: User[];
    allPosts: Post[];
    allCourses: Course[];
    onUpdateUser: (userId: number, updatedData: Partial<User>) => void;
    onDeleteUser: (userId: number) => void;
    onUpdatePost: (postId: number, updatedData: Partial<Post>) => void;
    onDeletePost: (postId: number) => void;
    onUpdateCommunity: (courseId: number, updatedData: Partial<Course>) => void;
    onDeleteCommunity: (courseId: number) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
    allUsers, allPosts, allCourses, 
    onDeleteUser, onDeletePost, onDeleteCommunity 
}) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [itemToDelete, setItemToDelete] = useState<{ type: 'user' | 'post' | 'community', id: number } | null>(null);

    const handleDeleteClick = (type: 'user' | 'post' | 'community', id: number) => {
        setItemToDelete({ type, id });
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        
        switch (itemToDelete.type) {
            case 'user':
                onDeleteUser(itemToDelete.id);
                break;
            case 'post':
                onDeletePost(itemToDelete.id);
                break;
            case 'community':
                onDeleteCommunity(itemToDelete.id);
                break;
        }
        setItemToDelete(null);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Users" value={allUsers.length} icon={UsersIcon} />
                        <StatCard title="Total Posts" value={allPosts.length} icon={MessageSquareIcon} />
                        <StatCard title="Total Communities" value={allCourses.length} icon={BookIcon} />
                    </div>
                );
            case 'users':
                return (
                    <GlassCard>
                        <h2 className="text-xl font-bold mb-4">Manage Users</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-[var(--card-border)] text-sm text-[var(--text-secondary)]">
                                    <tr>
                                        <th className="p-2">ID</th>
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Email</th>
                                        <th className="p-2">Admin</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map(user => (
                                        <tr key={user.id} className="border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)]">
                                            <td className="p-2">{user.id}</td>
                                            <td className="p-2">{user.name}</td>
                                            <td className="p-2">{user.email}</td>
                                            <td className="p-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                                            <td className="p-2">
                                                <button onClick={() => handleDeleteClick('user', user.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                );
            case 'posts':
                 return (
                    <GlassCard>
                        <h2 className="text-xl font-bold mb-4">Manage Posts</h2>
                        <div className="overflow-x-auto max-h-[60vh]">
                            <table className="w-full text-left">
                                <thead className="border-b border-[var(--card-border)] text-sm text-[var(--text-secondary)] sticky top-0 bg-[var(--card-bg)]">
                                    <tr>
                                        <th className="p-2">ID</th>
                                        <th className="p-2">Title / Review</th>
                                        <th className="p-2">Author</th>
                                        <th className="p-2">Likes</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allPosts.map(post => (
                                        <tr key={post.id} className="border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)]">
                                            <td className="p-2">{post.id}</td>
                                            <td className="p-2 max-w-xs truncate">{post.courseName || post.review}</td>
                                            <td className="p-2">{post.author.name}</td>
                                            <td className="p-2">{post.likes}</td>
                                            <td className="p-2">
                                                <button onClick={() => handleDeleteClick('post', post.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                );
             case 'communities':
                return (
                    <GlassCard>
                        <h2 className="text-xl font-bold mb-4">Manage Communities</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-[var(--card-border)] text-sm text-[var(--text-secondary)]">
                                    <tr>
                                        <th className="p-2">ID</th>
                                        <th className="p-2">Title</th>
                                        <th className="p-2">Field</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allCourses.map(course => (
                                        <tr key={course.id} className="border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)]">
                                            <td className="p-2">{course.id}</td>
                                            <td className="p-2">{course.title}</td>
                                            <td className="p-2">{course.field}</td>
                                            <td className="p-2">
                                                <button onClick={() => handleDeleteClick('community', course.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                );
            default: return null;
        }
    }

    const TABS: { id: AdminTab, label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'users', label: 'Users' },
        { id: 'posts', label: 'Posts' },
        { id: 'communities', label: 'Communities' },
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto pb-20 lg:pb-0">
                <h1 className="text-4xl font-extrabold text-[var(--text-primary)] mb-2">Admin Dashboard</h1>
                <p className="text-[var(--text-secondary)] mb-8">Welcome, admin. Manage your platform here.</p>
                
                <div className="flex gap-8">
                    <aside className="w-1/4">
                        <GlassCard className="p-2">
                            <nav className="flex flex-col gap-1">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-2 rounded-md font-semibold text-base transition-colors ${activeTab === tab.id ? 'bg-[var(--primary-accent)] text-[var(--primary-accent-text)]' : 'hover:bg-[var(--hover-bg)]'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </GlassCard>
                    </aside>
                    <main className="w-3/4">
                       <AnimatePresence mode="wait">
                           <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                           >
                               {renderContent()}
                           </motion.div>
                       </AnimatePresence>
                    </main>
                </div>
            </div>
             <AnimatePresence>
                {itemToDelete && (
                    <ConfirmationModal 
                        title={`Delete ${itemToDelete.type}`}
                        message={`Are you sure you want to permanently delete this ${itemToDelete.type}? This action cannot be undone.`}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setItemToDelete(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPage;