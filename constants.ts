import { User, Post, Course, RoadmapStep, ChatMessage } from './types';

export const users: User[] = [
  { id: 1, name: 'Alex Nova', username: 'alexnova', email: 'alex@university.edu', avatarUrl: 'https://picsum.photos/seed/alex/100/100', specialization: 'Quantum Computing', studyYear: 3, followers: 1250, following: 210, university: 'Quantum University' },
  { id: 2, name: 'Jasmine Lee', username: 'jasminelee', email: 'jasmine@university.edu', avatarUrl: 'https://picsum.photos/seed/jasmine/100/100', specialization: 'Bio-Engineering', studyYear: 4, followers: 850, following: 150, university: 'BioGen Institute' },
  { id: 3, name: 'Kenji Tanaka', username: 'kenjitanaka', email: 'kenji@university.edu', avatarUrl: 'https://picsum.photos/seed/kenji/100/100', specialization: 'UX/UI Design', studyYear: 2, followers: 2300, following: 400, university: 'Design Forward Academy' },
];

export const initialPosts: Post[] = [
  { id: 1, author: users[0], courseName: 'Advanced Quantum Mechanics', review: 'Professor Al-Khalili\'s lectures on YouTube are a game-changer. Breaks down complex topics into digestible pieces. Highly recommend!', rating: 5, likes: 256, commentsCount: 32, timestamp: '2h ago', likedBy: [] },
  { id: 2, author: users[1], courseName: 'CRISPR-Cas9 Fundamentals', review: 'The Coursera course by Doudna Lab is the gold standard. A bit challenging, but the practical insights are invaluable for anyone in biotech.', rating: 5, likes: 189, commentsCount: 21, timestamp: '5h ago', likedBy: [] },
  { id: 3, author: users[2], courseName: 'Figma for UI/UX Mastery', review: 'Shiftnudge is pricey but worth every penny. The focus on design systems thinking has completely leveled up my workflow.', rating: 4, likes: 450, commentsCount: 55, timestamp: '1d ago', likedBy: [] },
  { id: 4, author: users[0], courseName: 'Linear Algebra by 3Blue1Brown', review: 'The visual approach to understanding vectors and matrices is pure genius. This should be mandatory for any STEM student.', rating: 5, likes: 780, commentsCount: 98, timestamp: '2d ago', likedBy: [] },
];

export const courses: Course[] = [
    { id: 1, title: 'AI for Everyone', field: 'Engineering', rating: 4.9, platform: 'Coursera', imageUrl: 'https://picsum.photos/seed/ai/400/200' },
    { id: 2, title: 'Human Anatomy', field: 'Medicine', rating: 4.8, platform: 'Khan Academy', imageUrl: 'https://picsum.photos/seed/anatomy/400/200' },
    { id: 3, title: 'Design Thinking', field: 'Design', rating: 4.9, platform: 'Interaction Design Foundation', imageUrl: 'https://picsum.photos/seed/design/400/200' },
    { id: 4, title: 'Organic Chemistry', field: 'Medicine', rating: 4.7, platform: 'AK Lectures', imageUrl: 'https://picsum.photos/seed/chem/400/200' },
    { id: 5, title: 'Data Structures & Algorithms', field: 'Engineering', rating: 5.0, platform: 'NeetCode', imageUrl: 'https://picsum.photos/seed/dsa/400/200' },
];

export const roadmapSteps: RoadmapStep[] = [
    { id: 1, stage: 'Year 1', title: 'Foundations of CS', description: 'Grasp the fundamentals of programming and computer science theory.', resources: [{ name: 'CS50x by Harvard', type: 'Course' }, { name: 'Structure and Interpretation of Computer Programs', type: 'Book' }] },
    { id: 2, stage: 'Year 2', title: 'Core Competencies', description: 'Dive deep into data structures, algorithms, and system architecture.', resources: [{ name: 'The Cherno on YouTube', type: 'YouTube' }, { name: 'Grokking the System Design Interview', type: 'Course' }] },
    { id: 3, stage: 'Year 3', title: 'Specialization', description: 'Focus on a specific area like AI, Web Development, or Cybersecurity.', resources: [{ name: 'fast.ai - Practical Deep Learning', type: 'Course' }, { name: 'Fullstack Open', type: 'Course' }] },
];

export const initialChatMessages: ChatMessage[] = [
    { id: 1, sender: users[1], text: 'Has anyone taken the advanced ML course?', timestamp: '10:30 AM' },
    { id: 2, sender: users[0], text: 'Yeah, I have. It\'s tough but rewarding. Make sure your linear algebra is solid.', timestamp: '10:31 AM' },
    { id: 3, sender: users[2], text: 'Any tips for the final project?', timestamp: '10:32 AM' },
];