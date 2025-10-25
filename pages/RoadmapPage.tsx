import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import GlassCard from '../components/GlassCard';
import PostCard from '../components/PostCard';
import { Roadmap, RoadmapStep, Roadmaps, Post, User, QuizQuestion, QuizAttempt, RoadmapResource, Page } from '../types';
import { BookIcon, CourseIcon, YouTubeIcon, ArrowLeftIcon, BotIcon, PlusCircleIcon, ClipboardCheckIcon, PinIcon, SearchIcon, XIcon, ShareIcon, CopyIcon } from '../components/icons';

const resourceIcons = {
    Book: BookIcon,
    YouTube: YouTubeIcon,
    Course: CourseIcon,
    Post: PinIcon,
};

// --- AI GENERATION LOADER ---
const GenerationLoader: React.FC<{ topic: string }> = ({ topic }) => (
    <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
        <motion.div
            className="w-full max-w-md text-center"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        >
            <GlassCard>
                <BotIcon className="w-16 h-16 text-glow mx-auto animate-pulse" />
                <h2 className="text-2xl font-bold mt-4">Generating Roadmap...</h2>
                <p className="text-[var(--text-secondary)] mt-2">Our AI is crafting a personalized learning path for <span className="font-bold text-[var(--text-primary)]">{topic}</span>. This may take a moment.</p>
            </GlassCard>
        </motion.div>
    </motion.div>
);


// --- PIN POST MODAL ---
const PinPostModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    allPosts: Post[];
    onPinPost: (post: Post) => void;
    currentUser: User;
    allUsers: User[];
    onViewProfile: (userId: number) => void;
}> = ({ isOpen, onClose, allPosts, onPinPost, currentUser, allUsers, onViewProfile }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredPosts = useMemo(() =>
        allPosts.filter(p => !p.isCommunityPost && (p.courseName.toLowerCase().includes(searchQuery.toLowerCase()) || p.review.toLowerCase().includes(searchQuery.toLowerCase())))
    , [allPosts, searchQuery]);

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-2xl bg-[var(--notification-bg)] rounded-2xl shadow-2xl flex flex-col max-h-[80vh] border border-[var(--card-border)]"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-[var(--card-border)] sticky top-0 bg-[var(--notification-bg)]/80 backdrop-blur-lg">
                    <h2 className="text-xl font-bold">Pin a Post</h2>
                    <div className="relative mt-2">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search posts by course or review..."
                            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-full pl-10 pr-4 py-2"
                        />
                    </div>
                </header>
                <main className="p-4 overflow-y-auto space-y-4">
                    {filteredPosts.length > 0 ? filteredPosts.map(post => (
                       <PostCard
                            key={post.id}
                            post={post}
                            currentUser={currentUser}
                            allUsers={allUsers}
                            onViewProfile={onViewProfile}
                            pinConfig={{
                                onPin: (postId) => {
                                    const postToPin = allPosts.find(p => p.id === postId);
                                    if (postToPin) {
                                        onPinPost(postToPin);
                                    }
                                    onClose();
                                }
                            }}
                        />
                    )) : <p className="text-center text-[var(--text-secondary)] py-8">No matching posts found.</p>}
                </main>
            </motion.div>
        </motion.div>
    );
};


// --- QUIZ MODAL ---
const QuizModal: React.FC<{
    step: RoadmapStep;
    onClose: () => void;
}> = ({ step, onClose }) => {
    const [questions, setQuestions] = useState<QuizAttempt[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [status, setStatus] = useState<'loading' | 'taking' | 'results'>('loading');
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const generateQuiz = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `Based on the following learning material for the topic "${step.title}", generate a 5-question multiple-choice quiz with 4 options per question. The questions should test the key concepts. Learning Material: ${step.description}. Resources mentioned: ${step.resources.map(r => r.name).join(', ')}.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                quiz: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            question: { type: Type.STRING },
                                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                            correctAnswerIndex: { type: Type.INTEGER }
                                        },
                                        required: ["question", "options", "correctAnswerIndex"]
                                    }
                                }
                            }
                        }
                    }
                });

                const jsonResponse = JSON.parse(response.text);
                if (jsonResponse.quiz && jsonResponse.quiz.length > 0) {
                    setQuestions(jsonResponse.quiz);
                    setStatus('taking');
                } else {
                    throw new Error("AI returned an invalid quiz format.");
                }
            } catch (err) {
                console.error("Quiz generation failed:", err);
                setError("Sorry, I couldn't generate a quiz for this topic. Please try again later.");
                setStatus('results'); // Show error on results screen
            }
        };
        generateQuiz();
    }, [step]);

    const handleAnswer = (answerIndex: number) => {
        const newQuestions = [...questions];
        const currentQuestion = newQuestions[currentQuestionIndex];
        currentQuestion.userAnswerIndex = answerIndex;
        currentQuestion.isCorrect = answerIndex === currentQuestion.correctAnswerIndex;
        setQuestions(newQuestions);

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setStatus('results');
            }
        }, 1200);
    };
    
    const score = questions.filter(q => q.isCorrect).length;
    const currentQuestion = questions[currentQuestionIndex];

    const renderContent = () => {
        if (status === 'loading') {
            return <div className="text-center p-8">
                <p className="font-semibold text-lg animate-pulse">Generating your quiz...</p>
                <p className="text-[var(--text-secondary)] mt-2">The AI is preparing some questions for you on "{step.title}".</p>
            </div>;
        }

        if (status === 'results') {
            return <div className="text-center p-8">
                <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                {error ? (
                     <p className="text-red-500 mt-4">{error}</p>
                ) : (
                    <>
                        <p className="text-5xl font-bold my-4">{score} / {questions.length}</p>
                        <p className="text-[var(--text-secondary)]">You did a great job revising "{step.title}"!</p>
                    </>
                )}
                <button onClick={onClose} className="mt-6 px-6 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full">Close</button>
            </div>;
        }

        if (status === 'taking' && currentQuestion) {
            return (
                <div className="p-8">
                    <p className="text-sm text-[var(--text-secondary)]">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <h3 className="text-xl font-semibold my-4 min-h-[56px]">{currentQuestion.question}</h3>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = currentQuestion.userAnswerIndex === index;
                            const isCorrect = currentQuestion.correctAnswerIndex === index;
                            
                            let buttonClass = "w-full text-left p-3 rounded-lg border-2 transition-all duration-300 ";
                            if (currentQuestion.userAnswerIndex !== undefined) {
                                if (isCorrect) {
                                    buttonClass += "bg-green-500/20 border-green-500";
                                } else if (isSelected) {
                                    buttonClass += "bg-red-500/20 border-red-500";
                                } else {
                                     buttonClass += "bg-[var(--input-bg)] border-[var(--input-border)] opacity-60";
                                }
                            } else {
                                buttonClass += "bg-[var(--input-bg)] border-[var(--input-border)] hover:border-[var(--primary-accent)]";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={currentQuestion.userAnswerIndex !== undefined}
                                    className={buttonClass}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div
                className="w-full max-w-xl bg-[var(--notification-bg)] rounded-2xl shadow-2xl flex flex-col border border-[var(--card-border)]"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                {renderContent()}
            </motion.div>
        </motion.div>
    );
};


// --- ROADMAP TIMELINE ---
const RoadmapTimeline: React.FC<{ 
    roadmap: Roadmap; 
    onBack: () => void; 
    allPosts: Post[];
    isUnsaved: boolean;
    roadmapKey: string | null;
    onSave?: () => void;
    setCurrentPage: (page: Page) => void;
    setSearchQuery: (query: string) => void;
}> = ({ roadmap, onBack, allPosts, isUnsaved, roadmapKey, onSave, setCurrentPage, setSearchQuery }) => {
    const [quizStep, setQuizStep] = useState<RoadmapStep | null>(null);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        if (!roadmapKey) return;
        const link = `${window.location.origin}${window.location.pathname}?roadmap=${roadmapKey}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const getResourceLink = (resource: RoadmapResource) => {
        switch (resource.type) {
            case 'Book':
                return `https://www.google.com/search?q=Book+${encodeURIComponent(resource.name)}`;
            case 'YouTube':
                return `https://www.youtube.com/results?search_query=${encodeURIComponent(resource.name)}`;
            case 'Course':
                return `https://www.google.com/search?q=Course+${encodeURIComponent(resource.name)}`;
            default:
                return '#';
        }
    };

    const handlePostResourceClick = (post: Post) => {
        setSearchQuery(post.courseName);
        setCurrentPage('home');
    };

    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {quizStep && <QuizModal step={quizStep} onClose={() => setQuizStep(null)} />}
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 -ml-2 rounded-full hover:bg-[var(--hover-bg)]" aria-label="Back to roadmaps">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Roadmaps
            </button>
            <div className="flex items-center gap-2">
                {isUnsaved && onSave && <button onClick={onSave} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700">Save Roadmap</button>}
                {!isUnsaved && roadmapKey && (
                    <button 
                        onClick={handleShare} 
                        className="px-4 py-2 flex items-center gap-2 bg-transparent border-2 border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        {copied ? <CopyIcon className="w-5 h-5" /> : <ShareIcon className="w-5 h-5" />}
                        {copied ? 'Copied!' : 'Share'}
                    </button>
                )}
            </div>
        </div>
        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] mb-4">{roadmap.title}</h1>
        <p className="text-[var(--text-secondary)] mb-12">{roadmap.description}</p>

        <div className="relative">
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-1 h-full bg-[var(--card-border)] rounded-full"></div>
            {roadmap.steps.map((step, index) => (
                <div key={step.id} className="relative mb-12 flex items-center w-full">
                    <div className={`flex w-full items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="hidden md:flex justify-center w-1/2"></div>
                        <div className="w-full md:w-1/2">
                            <GlassCard className="ml-8 md:ml-0">
                                <span className="absolute -left-12 md:left-auto top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--card-bg)] border-2 border-[var(--primary-accent)] rounded-full flex items-center justify-center font-bold text-[var(--primary-accent)] text-sm">
                                    {step.stage.match(/\d+/)?.[0] || step.stage.charAt(0)}
                                </span>
                                <p className="font-bold text-teal-400 text-lg mb-1">{step.stage}</p>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                                <p className="text-[var(--text-secondary)] mb-4">{step.description}</p>
                                {step.resources.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <h4 className='text-sm font-semibold text-[var(--text-secondary)]'>Resources:</h4>
                                    {step.resources.map((res, i) => {
                                        const Icon = resourceIcons[res.type];
                                        if (res.type === 'Post' && res.postId) {
                                            const post = allPosts.find(p => p.id === res.postId);
                                            return post ? (
                                                <button key={i} onClick={() => handlePostResourceClick(post)} className="w-full text-left bg-[var(--hover-bg)] p-2 rounded-md hover:ring-2 hover:ring-[var(--primary-accent)] transition-all">
                                                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-1">
                                                        <Icon className="w-4 h-4 text-purple-400" />
                                                        <span>Pinned Post</span>
                                                    </div>
                                                    <p className="font-semibold text-sm">{post.courseName}</p>
                                                    <p className="text-xs text-[var(--text-secondary)] italic">by {post.author.name}</p>
                                                </button>
                                            ) : null;
                                        }
                                        return (
                                            <a key={i} href={getResourceLink(res)} target="_blank" rel="noopener noreferrer" className="block text-sm text-[var(--text-secondary)] bg-[var(--hover-bg)] p-2 rounded-md hover:ring-2 hover:ring-[var(--primary-accent)] transition-all">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4 text-blue-400" />
                                                    <span>{res.name}</span>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                                )}
                                <button onClick={() => setQuizStep(step)} className="w-full mt-2 px-4 py-2 flex items-center justify-center gap-2 bg-transparent border-2 border-[var(--primary-accent)] text-[var(--primary-accent)] font-semibold rounded-full hover:bg-[var(--primary-accent)] hover:text-[var(--primary-accent-text)] transition-colors">
                                    <ClipboardCheckIcon className="w-5 h-5" /> Test Your Knowledge
                                </button>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
)};

// --- CREATE MANUAL ROADMAP VIEW ---
const CreateManualRoadmapView: React.FC<{
    onBack: () => void;
    onSave: (roadmap: Roadmap) => void;
    allPosts: Post[];
    currentUser: User;
    allUsers: User[];
    onViewProfile: (userId: number) => void;
}> = ({ onBack, onSave, allPosts, currentUser, allUsers, onViewProfile }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState<(Omit<RoadmapStep, 'id' | 'resources'> & { resources: RoadmapResource[] })[]>([
        { stage: `Stage 1`, title: '', description: '', resources: [] }
    ]);
    const [isPinning, setIsPinning] = useState<number | null>(null);

    const addStep = () => setSteps([...steps, { stage: `Stage ${steps.length + 1}`, title: '', description: '', resources: [] }]);
    
    const updateStep = (index: number, field: keyof Omit<RoadmapStep, 'id'>, value: any) => {
        const newSteps = [...steps];
        (newSteps[index] as any)[field] = value;
        setSteps(newSteps);
    };
    
    const removeResource = (stepIndex: number, resourceIndex: number) => {
        const newSteps = [...steps];
        newSteps[stepIndex].resources.splice(resourceIndex, 1);
        setSteps(newSteps);
    };

    const handlePinPost = (post: Post) => {
        if (isPinning === null) return;
        const newSteps = [...steps];
        newSteps[isPinning].resources.push({ name: post.courseName, type: 'Post', postId: post.id });
        setSteps(newSteps);
    };

    const handleSave = () => {
        if (!title) {
            alert("Please provide a title for your roadmap.");
            return;
        }
        if (steps.some(s => !s.title || !s.description)) {
            alert("Please ensure all steps have a title and description.");
            return;
        }
        const newRoadmap: Roadmap = {
            title,
            description,
            steps: steps.map((s, i) => ({ ...s, id: Date.now() + i }))
        };
        onSave(newRoadmap);
    };

    return (
        <motion.div key="create_manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PinPostModal 
                isOpen={isPinning !== null} 
                onClose={() => setIsPinning(null)} 
                allPosts={allPosts} 
                onPinPost={handlePinPost}
                currentUser={currentUser}
                allUsers={allUsers}
                onViewProfile={onViewProfile}
            />
            <button onClick={onBack} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 -ml-2 rounded-full hover:bg-[var(--hover-bg)] mb-4">
                <ArrowLeftIcon className="w-5 h-5" /> Back
            </button>
            <GlassCard>
                <h2 className="text-2xl font-bold mb-4">Create Your Roadmap</h2>
                <div className="space-y-4">
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Roadmap Title (e.g., 'Mastering React')" className="w-full text-lg font-semibold bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2"/>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A brief description of your learning path" className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2"/>
                </div>
            </GlassCard>

            {steps.map((step, index) => (
                <GlassCard key={index} className="my-4">
                   <input value={step.stage} onChange={e => updateStep(index, 'stage', e.target.value)} placeholder="Stage (e.g., Week 1)" className="w-full font-bold text-teal-400 bg-transparent mb-1"/>
                   <input value={step.title} onChange={e => updateStep(index, 'title', e.target.value)} placeholder="Step Title (e.g., 'Understanding JSX')" className="w-full text-xl font-bold bg-transparent mb-2"/>
                   <textarea value={step.description} onChange={e => updateStep(index, 'description', e.target.value)} placeholder="Step Description (e.g., 'Learn how to write markup in JavaScript')" className="w-full bg-transparent text-[var(--text-secondary)] mb-2"/>
                   <div className="space-y-1">
                       {step.resources.map((res, i) => (
                           <div key={i} className="flex items-center justify-between gap-2 p-2 bg-[var(--hover-bg)] rounded text-sm">
                               <div className='flex items-center gap-2 min-w-0'>
                                   <PinIcon className="w-4 h-4 text-purple-400 flex-shrink-0"/>
                                   <span className='truncate'>{res.name}</span>
                               </div>
                               <button onClick={() => removeResource(index, i)} className="p-0.5 hover:bg-black/20 rounded-full flex-shrink-0"><XIcon className="w-3 h-3"/></button>
                           </div>
                       ))}
                   </div>
                   <button onClick={() => setIsPinning(index)} className="mt-2 text-sm flex items-center gap-2 text-[var(--primary-accent)] font-semibold p-2 -ml-2 hover:bg-[var(--hover-bg)] rounded-full">
                       <PinIcon className="w-4 h-4"/> Pin a Post
                    </button>
               </GlassCard>
            ))}

            <div className="flex gap-4 mt-6">
               <button onClick={addStep} className="px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] font-semibold rounded-full">Add Step</button>
               <button onClick={handleSave} className="px-6 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full">Save Roadmap</button>
           </div>
        </motion.div>
    );
};


interface RoadmapPageProps {
    roadmaps: Roadmaps;
    onSaveRoadmap: (key: string, roadmap: Roadmap) => void;
    allPosts: Post[];
    allUsers: User[];
    currentUser: User;
    initialRoadmapKey: string | null;
    setCurrentPage: (page: Page) => void;
    setSearchQuery: (query: string) => void;
    onViewProfile: (userId: number) => void;
}


const RoadmapPage: React.FC<RoadmapPageProps> = ({ roadmaps, onSaveRoadmap, allPosts, allUsers, currentUser, initialRoadmapKey, setCurrentPage, setSearchQuery, onViewProfile }) => {
    const [view, setView] = useState<'selection' | 'view_roadmap' | 'create_manual'>('selection');
    const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);
    const [activeRoadmapKey, setActiveRoadmapKey] = useState<string | null>(null);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [generatingTopic, setGeneratingTopic] = useState<string | null>(null);
    const [generationError, setGenerationError] = useState<string | null>(null);

    React.useEffect(() => {
        if (initialRoadmapKey && roadmaps[initialRoadmapKey]) {
            setActiveRoadmap(roadmaps[initialRoadmapKey]);
            setActiveRoadmapKey(initialRoadmapKey);
            setIsUnsaved(false);
            setView('view_roadmap');
        }
    }, [initialRoadmapKey, roadmaps]);

    const handleGenerateRoadmap = async (topic: string) => {
        if (!topic.trim()) return;
        setGeneratingTopic(topic);
        setGenerationError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Create a detailed learning roadmap for "${topic}". The roadmap should have a title, description, and a series of 5-7 logical steps. Each step must include a stage (e.g., 'Stage 1'), title, description of learning objectives, and 2-3 suggested resources of type 'Book', 'YouTube', or 'Course'. The output must be a valid JSON object matching the provided schema.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            steps: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        stage: { type: Type.STRING },
                                        title: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        resources: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    name: { type: Type.STRING },
                                                    type: { type: Type.STRING, enum: ["Book", "YouTube", "Course", "Post"] }
                                                },
                                                required: ["name", "type"],
                                            }
                                        }
                                    },
                                    required: ["stage", "title", "description", "resources"],
                                }
                            }
                        },
                        required: ["title", "description", "steps"],
                    }
                }
            });

            if (!response.text || response.text.trim() === '') {
                throw new Error("The AI returned an empty response. Please try again.");
            }
    
            let roadmapData;
            try {
                // The response can sometimes be wrapped in ```json ... ```, so let's strip that.
                const cleanResponse = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
                roadmapData = JSON.parse(cleanResponse) as Omit<Roadmap, 'steps'> & { steps: Omit<RoadmapStep, 'id'>[] };
            } catch (parseError) {
                 console.error("JSON Parsing Error:", parseError, "Raw response:", response.text);
                 throw new Error("The AI returned a response in an unexpected format. Retrying might help.");
            }

            if (
                !roadmapData ||
                typeof roadmapData.title !== 'string' ||
                typeof roadmapData.description !== 'string' ||
                !Array.isArray(roadmapData.steps) ||
                roadmapData.steps.some(step => 
                    !step ||
                    typeof step.stage !== 'string' ||
                    typeof step.title !== 'string' ||
                    typeof step.description !== 'string' ||
                    !Array.isArray(step.resources) ||
                    step.resources.some(res => !res || typeof res.name !== 'string' || typeof res.type !== 'string')
                )
            ) {
                 console.error("Invalid roadmap structure received:", roadmapData);
                 throw new Error("The AI's response was missing some required information. Please try generating it again.");
            }

            const roadmapWithIds: Roadmap = {
                ...roadmapData,
                steps: roadmapData.steps.map((step, index) => ({ ...step, id: Date.now() + index }))
            };
            
            setActiveRoadmap(roadmapWithIds);
            setActiveRoadmapKey(topic);
            setIsUnsaved(true);
            setView('view_roadmap');

        } catch (error) {
            console.error("Roadmap Generation Error:", error);
            if (error instanceof Error) {
                setGenerationError(error.message);
            } else {
                setGenerationError("An unknown error occurred while generating the roadmap. Please check your connection and try again.");
            }
        } finally {
            setGeneratingTopic(null);
        }
    };
    
    const handleSaveCurrentRoadmap = () => {
        if (activeRoadmap && activeRoadmapKey) {
            const newKey = activeRoadmap.title.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
            onSaveRoadmap(newKey, activeRoadmap);
            setActiveRoadmapKey(newKey);
            setIsUnsaved(false);
        }
    };

    const handleSaveManualRoadmap = (newRoadmap: Roadmap) => {
        const newKey = newRoadmap.title.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        onSaveRoadmap(newKey, newRoadmap);
        setActiveRoadmap(newRoadmap);
        setActiveRoadmapKey(newKey);
        setIsUnsaved(false);
        setView('view_roadmap');
    };
    
    const renderSelectionView = () => (
         <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-4xl font-extrabold text-[var(--text-primary)] mb-4">Your Learning Roadmaps</h1>
            <p className="text-[var(--text-secondary)] mb-12">Generate a custom learning path with AI, or build your own from scratch.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <GlassCard className="!p-6 text-center flex flex-col items-center">
                    <BotIcon className="w-12 h-12 text-[var(--primary-accent)] mb-4" />
                    <h3 className="text-xl font-bold">Generate with AI</h3>
                    <p className="text-[var(--text-secondary)] my-2 flex-grow">Let our AI create a personalized roadmap for any topic in seconds.</p>
                    <form onSubmit={(e) => { e.preventDefault(); handleGenerateRoadmap(e.currentTarget.topic.value); }} className="w-full mt-4">
                        <input name="topic" required placeholder="e.g., 'Learn Python'" className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-full px-4 py-2 mb-2"/>
                        <button type="submit" className="w-full px-4 py-2 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-semibold rounded-full disabled:bg-gray-500">
                           Generate
                        </button>
                    </form>
                    {generationError && <p className="text-red-500 text-sm mt-2">{generationError}</p>}
                </GlassCard>
                <GlassCard className="!p-6 text-center flex flex-col items-center">
                    <PlusCircleIcon className="w-12 h-12 text-[var(--primary-accent)] mb-4" />
                    <h3 className="text-xl font-bold">Create Your Own</h3>
                    <p className="text-[var(--text-secondary)] my-2 flex-grow">Craft a custom roadmap, add your own steps, and pin resources from the community.</p>
                    <button onClick={() => setView('create_manual')} className="w-full mt-4 px-4 py-2 bg-transparent border-2 border-[var(--primary-accent)] text-[var(--primary-accent)] font-semibold rounded-full hover:bg-[var(--primary-accent)] hover:text-[var(--primary-accent-text)] transition-colors">
                        Start Building
                    </button>
                </GlassCard>
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Saved Roadmaps</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(roadmaps).length > 0 ? Object.entries(roadmaps).map(([key, roadmap]) => (
                    <div key={key} onClick={() => { setActiveRoadmap(roadmap); setView('view_roadmap'); setActiveRoadmapKey(key); setIsUnsaved(false); }} className="cursor-pointer group h-full">
                        <GlassCard className="!p-6 h-full flex flex-col group-hover:border-[var(--primary-accent)] group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
                            <h3 className="font-bold text-xl">{roadmap.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] mt-2 flex-grow line-clamp-2">{roadmap.description}</p>
                            <span className="text-sm font-semibold text-[var(--primary-accent)] group-hover:underline mt-4 self-end">View Roadmap &rarr;</span>
                        </GlassCard>
                    </div>
                )) : (
                    <GlassCard className="md:col-span-2 text-center py-12">
                        <h3 className="text-xl font-bold">No Saved Roadmaps</h3>
                        <p className="text-[var(--text-secondary)] mt-2">Generate a roadmap with AI or create your own to get started!</p>
                    </GlassCard>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
                <AnimatePresence>
                    {generatingTopic && <GenerationLoader topic={generatingTopic} />}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {view === 'selection' && renderSelectionView()}
                    {view === 'create_manual' && (
                        <CreateManualRoadmapView
                            onBack={() => setView('selection')}
                            onSave={handleSaveManualRoadmap}
                            allPosts={allPosts}
                            currentUser={currentUser}
                            allUsers={allUsers}
                            onViewProfile={onViewProfile}
                        />
                    )}
                    {view === 'view_roadmap' && activeRoadmap && (
                         <motion.div key="timeline">
                           <RoadmapTimeline 
                                roadmap={activeRoadmap} 
                                onBack={() => setView('selection')} 
                                allPosts={allPosts} 
                                isUnsaved={isUnsaved}
                                roadmapKey={activeRoadmapKey}
                                onSave={handleSaveCurrentRoadmap} 
                                setCurrentPage={setCurrentPage}
                                setSearchQuery={setSearchQuery}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RoadmapPage;