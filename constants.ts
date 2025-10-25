import { User, Post, Course, RoadmapStep, Comment } from './types';

export const users: User[] = [
  { id: 1, name: 'Alex Nova', username: 'alexnova', email: 'alex@university.edu', avatarUrl: 'https://picsum.photos/seed/jellyfish/100/100', specialization: 'Engineering', studyYear: 3, followers: 1, following: 1, university: 'Quantum University', isActive: true, followingIds: [2], blockedUserIds: [], joinedCommunities: ['Engineering', 'Design'], isAdmin: true },
  { id: 2, name: 'Jasmine Lee', username: 'jasminelee', email: 'jasmine@university.edu', avatarUrl: 'https://picsum.photos/seed/jasmine/100/100', specialization: 'Medicine', studyYear: 4, followers: 2, following: 0, university: 'BioGen Institute', isActive: false, followingIds: [], blockedUserIds: [], joinedCommunities: ['Medicine'] },
  { id: 3, name: 'Kenji Tanaka', username: 'kenjitanaka', email: 'kenji@university.edu', avatarUrl: 'https://picsum.photos/seed/kenji/100/100', specialization: 'Design', studyYear: 2, followers: 0, following: 2, university: 'Design Forward Academy', isActive: true, followingIds: [1, 2], blockedUserIds: [], joinedCommunities: [] },
];

export const comments: Comment[] = [
  { id: 1, author: users[1], text: 'Totally agree! This series is a must-watch.', timestamp: '1h ago', likes: 5, likedBy: [] },
  { id: 2, author: users[2], text: 'Thanks for the recommendation, I was looking for a good resource on this.', timestamp: '45m ago', likes: 2, likedBy: [] },
  { id: 3, author: users[0], text: 'Glad you liked it! His explanation of entanglement is the best I\'ve seen.', timestamp: '30m ago', likes: 10, likedBy: [] },
  { id: 4, author: users[2], text: 'I found the first few chapters a bit slow, but it gets really good after that.', timestamp: '3h ago', likes: 1, likedBy: [] },
  { id: 5, author: users[0], text: 'Make sure to do the problem sets, they are key to understanding the material.', timestamp: '2h ago', likes: 8, likedBy: [] },
];

export const initialPosts: Post[] = [
  { id: 1, author: users[0], courseName: 'Advanced Quantum Mechanics', review: 'Professor Al-Khalili\'s lectures on YouTube are a game-changer. Breaks down complex topics into digestible pieces. Highly recommend!', rating: 5, likes: 256, comments: [comments[0], comments[1], comments[2]], timestamp: '2h ago', likedBy: [], linkUrl: 'https://www.youtube.com/watch?v=q-i-U332vW4', field: 'Engineering', isCommunityPost: false },
  { id: 2, author: users[1], courseName: 'CRISPR-Cas9 Fundamentals', review: 'The Coursera course by Doudna Lab is the gold standard. A bit challenging, but the practical insights are invaluable for anyone in biotech.', rating: 5, likes: 189, comments: [comments[4]], timestamp: '5h ago', likedBy: [], imageUrls: ['https://picsum.photos/seed/crispr/800/400'], field: 'Medicine', isCommunityPost: false },
  { id: 3, author: users[2], courseName: 'Figma for UI/UX Mastery', review: 'Shiftnudge is pricey but worth every penny. The focus on design systems thinking has completely leveled up my workflow.', rating: 4, likes: 450, comments: [], timestamp: '1d ago', likedBy: [], field: 'Design', isCommunityPost: false },
  { id: 4, author: users[0], courseName: 'Linear Algebra by 3Blue1Brown', review: 'The visual approach to understanding vectors and matrices is pure genius. This should be mandatory for any STEM student.', rating: 5, likes: 780, comments: [comments[3]], timestamp: '2d ago', likedBy: [], field: 'Engineering', isCommunityPost: false },
  { id: 5, author: users[1], courseName: 'Intro to Python', review: 'The content is okay for absolute beginners, but the instructor is a bit dry. Pacing is slow.', rating: 2, likes: 32, comments: [], timestamp: '3d ago', likedBy: [], field: 'Engineering', isCommunityPost: false },
];

export const courses: Course[] = [
    { id: 1, title: 'AI for Everyone', field: 'Engineering', rating: 4.9, platform: 'Coursera', imageUrl: 'https://picsum.photos/seed/engineering/400/200', description: 'Unlock the potential of AI. Join a community of builders and innovators.', ownerId: 1 },
    { id: 2, title: 'Human Anatomy', field: 'Medicine', rating: 4.8, platform: 'Khan Academy', imageUrl: 'https://picsum.photos/seed/medicine/400/200', description: 'Explore the human body with fellow medical students and professionals.' },
    { id: 3, title: 'Design Thinking', field: 'Design', rating: 4.9, platform: 'Interaction Design Foundation', imageUrl: 'https://picsum.photos/seed/art/400/200', description: 'Collaborate with creatives and solve problems through innovative design.' },
    { id: 4, title: 'Organic Chemistry', field: 'Medicine', rating: 4.7, platform: 'AK Lectures', imageUrl: 'https://picsum.photos/seed/chemistry/400/200', description: 'Master complex chemical reactions with a dedicated study group.' },
    { id: 5, title: 'Data Structures & Algorithms', field: 'Engineering', rating: 5.0, platform: 'NeetCode', imageUrl: 'https://picsum.photos/seed/code/400/200', description: 'The go-to community for acing technical interviews and building core skills.' },
];

export const roadmaps: { [key: string]: { title: string; description: string; steps: RoadmapStep[] } } = {};