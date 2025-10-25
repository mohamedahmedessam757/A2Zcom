import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import Button from '../components/GlowButton';
import { MailIcon, LockIcon, ProfileIcon, BookIcon, StarIcon, UsersIcon, Logo, CheckCheckIcon } from '../components/icons';
import { User, Page } from '../types';

type UserSignUpData = Omit<User, 'id' | 'avatarUrl' | 'followers' | 'following' | 'studyYear'> & {
    password?: string;
    studyYear: string;
};


interface LandingPageProps {
  onLogin: (email: string) => void;
  onSignup: (userData: UserSignUpData) => void;
  setCurrentPage: (page: Page) => void;
}

const AuthInputField = ({ label, icon: Icon, type, placeholder, value, onChange, name }) => (
    <div>
        <label className="text-sm font-medium text-gray-300 mb-1 block">{label}</label>
        <div className="relative">
            {Icon && <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon className="w-5 h-5 text-gray-500" />
            </span>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                required
                className={`w-full bg-[#0D0D0D] border border-gray-700 rounded-lg py-2.5 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#14F195] focus:border-transparent transition-colors`}
            />
        </div>
    </div>
);

const SignInForm = ({ onLogin, switchToSignup, switchToForgot }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) onLogin(email);
    };

    return (
        <div className="space-y-6">
            <div className="text-left">
                <h1 className="text-3xl font-bold text-white">Welcome <span className="text-[#14F195]">back</span></h1>
                <p className="mt-1 text-gray-400">Sign in to continue your learning journey</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInputField label="Email" icon={MailIcon} type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                <AuthInputField label="Password" icon={LockIcon} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
                <div className="flex justify-between items-center text-sm pt-2">
                    <label className="flex items-center gap-2 text-gray-400 select-none cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#14F195] focus:ring-[#14F195]"/>
                        Remember me
                    </label>
                    <button onClick={switchToForgot} className="font-medium text-[#14F195] hover:underline">Forgot password?</button>
                </div>
                <button type="submit" className="w-full py-3 mt-2 px-4 bg-[#14F195] text-black font-bold rounded-lg text-center hover:bg-white transition-colors duration-300">
                    Sign In
                </button>
            </form>
            <p className="text-sm text-center text-gray-500">
                Don't have an account? <button onClick={switchToSignup} className="font-medium text-[#14F195] hover:underline">Join Now</button>
            </p>
        </div>
    );
};

const SignUpForm = ({ onSignup, switchToSignin }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', username: '', password: '', confirmPassword: '',
        university: '', studyYear: '1', specialization: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        setStep(2);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignup(formData);
    };

    return (
        <div className="space-y-6">
             <div className="text-left">
                <h1 className="text-3xl font-bold text-white">Join <span className="text-[#14F195]">A2Z</span></h1>
                <p className="mt-1 text-gray-400">Connect with students and build your academic roadmap</p>
            </div>

            <div className="flex gap-2 pt-2">
                <div className="h-1 rounded-full bg-[#14F195] w-1/2"></div>
                <div className={`h-1 rounded-full w-1/2 transition-colors ${step === 2 ? 'bg-[#14F195]' : 'bg-gray-700'}`}></div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    {step === 1 && (
                        <form onSubmit={handleNext} className="space-y-4">
                            <AuthInputField label="Full Name" icon={ProfileIcon} type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                            <AuthInputField label="Student Email" icon={MailIcon} type="email" name="email" placeholder="you@university.edu" value={formData.email} onChange={handleChange} />
                            <AuthInputField label="Username" icon={UsersIcon} type="text" name="username" placeholder="johndoe" value={formData.username} onChange={handleChange} />
                            <AuthInputField label="Password" icon={LockIcon} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                            <AuthInputField label="Confirm Password" icon={LockIcon} type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                            <button type="submit" className="w-full mt-2 py-3 px-4 bg-[#14F195] text-black font-bold rounded-lg text-center hover:bg-white transition-colors duration-300">
                                Next
                            </button>
                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AuthInputField label="University" icon={BookIcon} type="text" name="university" placeholder="Quantum University (Optional)" value={formData.university} onChange={handleChange} />
                             <div>
                                <label className="text-sm font-medium text-gray-300 mb-1 block">Study Year</label>
                                 <select name="studyYear" value={formData.studyYear} onChange={handleChange} className="w-full appearance-none bg-[#0D0D0D] border border-gray-700 rounded-lg py-2.5 pl-4 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#14F195]">
                                     <option value="1">1st Year</option>
                                     <option value="2">2nd Year</option>
                                     <option value="3">3rd Year</option>
                                     <option value="4">4th Year+</option>
                                     <option value="0">Lifelong Learner</option>
                                 </select>
                             </div>
                            <AuthInputField label="Major / Learning Track" icon={StarIcon} type="text" name="specialization" placeholder="e.g. Computer Science" value={formData.specialization} onChange={handleChange} />
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setStep(1)} className="w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-lg text-center hover:bg-gray-600 transition-colors duration-300">Back</button>
                                <button type="submit" className="w-full py-3 px-4 bg-[#14F195] text-black font-bold rounded-lg text-center hover:bg-white transition-colors duration-300">
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </AnimatePresence>
            <p className="text-sm text-center text-gray-500">
                Already have an account? <button onClick={switchToSignin} className="font-medium text-[#14F195] hover:underline">Sign In</button>
            </p>
        </div>
    )
}

const ForgotPasswordForm = ({ onForgot, switchToSignin }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would trigger a password reset email here.
        console.log('Password reset requested for:', email);
        onForgot();
    };

    return (
        <div className="space-y-6">
            <div className="text-left">
                <h1 className="text-3xl font-bold text-white">Reset <span className="text-[#14F195]">Password</span></h1>
                <p className="mt-1 text-gray-400">Enter your email to receive a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInputField label="Email" icon={MailIcon} type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                <button type="submit" className="w-full py-3 mt-2 px-4 bg-[#14F195] text-black font-bold rounded-lg text-center hover:bg-white transition-colors duration-300">
                    Send Reset Link
                </button>
            </form>
            <p className="text-sm text-center text-gray-500">
                Remember your password? <button onClick={switchToSignin} className="font-medium text-[#14F195] hover:underline">Sign In</button>
            </p>
        </div>
    );
};

const ForgotConfirmation = ({ switchToSignin }) => (
    <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCheckIcon className="w-8 h-8 text-green-400" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">Check Your <span className="text-[#14F195]">Email</span></h1>
            <p className="mt-2 text-gray-400">If an account exists for that email, we've sent instructions to reset your password.</p>
        </div>
        <button onClick={switchToSignin} className="w-full py-3 mt-2 px-4 bg-gray-700 text-white font-bold rounded-lg text-center hover:bg-gray-600 transition-colors duration-300">
            Back to Sign In
        </button>
    </div>
);


interface AuthModalProps {
    children: React.ReactNode;
    onBackdropClick: (e: any) => void;
    show: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ children, onBackdropClick, show }) => (
    <AnimatePresence>
        {show && (
            <motion.div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onBackdropClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="fixed inset-0 -z-10 h-full w-full">
                    <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(20,241,149,.1),rgba(255,255,255,0))]"></div>
                    <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(20,241,149,.1),rgba(255,255,255,0))]"></div>
                </div>
                <motion.div
                    className="bg-[#121212] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="p-8 pt-6 overflow-y-auto">
                      <div className="flex justify-center mb-6">
                        <Logo />
                      </div>
                      {children}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const Globe = () => {
    const numDots = 300;
    const radius = 350;
  
    const dots = Array.from({ length: numDots }).map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / numDots);
      const theta = Math.sqrt(numDots * Math.PI) * phi;
  
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
      };
    });
  
    return (
      <div className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px] flex items-center justify-center [perspective:1000px]">
          <motion.div 
              className="absolute"
              animate={{ rotateY: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
          >
              <div className="absolute inset-0 bg-[#14F195]/5 rounded-full blur-3xl"></div>
              {dots.map((dot, i) => (
                   <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{ 
                          transform: `translateX(${dot.x}px) translateY(${dot.y}px) translateZ(${dot.z}px)`,
                          background: `rgba(255, 255, 255, ${Math.max(0.1, (dot.z + radius) / (2 * radius))})`,
                          boxShadow: `0 0 8px rgba(20, 241, 149, ${Math.max(0.3, (dot.z + radius) / (2 * radius))})`,
                          width: `${2 + Math.round(((dot.z + radius) / (2 * radius)) * 4)}px`,
                          height: `${2 + Math.round(((dot.z + radius) / (2 * radius)) * 4)}px`,
                      }}
                   />
              ))}
          </motion.div>
      </div>
    );
  };

const FeatureCard = ({ number, icon: Icon, title, description }) => (
    <div className="border border-gray-800 p-8 rounded-lg bg-[#111111]">
        <div className="flex items-start gap-4">
            <span className="text-5xl font-bold text-gray-700">{number}</span>
            <div className="mt-2">
                <div className="w-12 h-12 bg-gray-900 border border-gray-700 rounded-md flex items-center justify-center mb-4">
                     <Icon className="w-6 h-6 text-glow" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400">{description}</p>
            </div>
        </div>
    </div>
);

const TestimonialCard = ({ avatarInitial, name, major, review }) => (
    <div className="border border-gray-800 p-6 rounded-lg bg-[#111111] h-full">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#14F195] flex items-center justify-center text-black font-bold text-xl">{avatarInitial}</div>
            <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-sm text-gray-400">{major}</p>
            </div>
        </div>
        <p className="text-gray-300">"{review}"</p>
    </div>
);

const testimonials = [
    { avatarInitial: "A", name: "Alex Chen", major: "Computer Science", review: "Professor Johnson is incredible! His data structures course changed how I think about programming." },
    { avatarInitial: "M", name: "Maria Santos", major: "Business Admin", review: "Found the best YouTube series for accounting. Finally making sense of financial statements!" },
    { avatarInitial: "S", name: "Samira Khan", major: "Neuroscience", review: "The community roadmap for pre-med was a lifesaver. It broke down exactly which courses to take and when." },
    { avatarInitial: "D", name: "David Lee", major: "Mechanical Engineering", review: "Being able to see reviews for specific lab sections was clutch. Avoided a notoriously difficult TA." },
    { avatarInitial: "J", name: "Jessica Wallace", major: "Fine Arts", review: "A2Z helped me find online courses to supplement my studio work, especially for digital art software. It's not just for STEM!" },
];

const StatCard = ({ value, label }) => (
    <div className="border border-gray-800 p-6 rounded-lg text-center bg-[#111111]">
        <p className="text-4xl font-bold text-glow">{value}</p>
        <p className="text-gray-400 mt-2">{label}</p>
    </div>
);

const AnimatedStatCard = ({ value: rawValue, label }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
    const [count, setCount] = useState(0);

    const numericValue = parseInt(rawValue.replace(/[^0-9]/g, ''), 10);
    const suffix = rawValue.includes('+') ? '+' : '';

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, numericValue, {
                duration: 2,
                onUpdate(value) {
                    setCount(Math.round(value));
                }
            });
            return () => controls.stop();
        }
    }, [isInView, numericValue]);

    return (
        <div ref={ref}>
            <StatCard value={`${count.toLocaleString()}${suffix}`} label={label} />
        </div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, setCurrentPage }) => {
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot' | 'forgotConfirmation'>('signin');

    const openAuth = (mode: 'signin' | 'signup') => {
        setAuthMode(mode);
        setShowAuth(true);
    };

    return (
        <div className="bg-[#0D0D0D] text-white overflow-x-hidden">
            <AuthModal show={showAuth} onBackdropClick={() => setShowAuth(false)}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={authMode}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        {authMode === 'signin' && (
                            <SignInForm onLogin={onLogin} switchToSignup={() => setAuthMode('signup')} switchToForgot={() => setAuthMode('forgot')} />
                        )}
                        {authMode === 'signup' && (
                            <SignUpForm onSignup={onSignup} switchToSignin={() => setAuthMode('signin')} />
                        )}
                         {authMode === 'forgot' && (
                            <ForgotPasswordForm onForgot={() => setAuthMode('forgotConfirmation')} switchToSignin={() => setAuthMode('signin')} />
                        )}
                        {authMode === 'forgotConfirmation' && (
                            <ForgotConfirmation switchToSignin={() => setAuthMode('signin')} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </AuthModal>

            <div className="container mx-auto px-4">
                <header className="py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                    <nav className="flex items-center gap-4">
                        <Button onClick={() => openAuth('signin')} variant="secondary" className="hidden md:flex">Sign In</Button>
                        <Button onClick={() => openAuth('signup')} variant="primary">Join Now</Button>
                    </nav>
                </header>

                <section className="relative py-20 md:py-32 flex items-center min-h-[70vh]">
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1/3 md:-right-1/4 lg:-right-1/4 -z-0 opacity-30 md:opacity-40 pointer-events-none">
                        <Globe />
                    </div>
                    <div className="relative z-10 w-full md:w-3/4 lg:w-1/2 text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
                            Find your <span className="text-glow">path.</span>
                            <br/>
                            Share your <span className="text-glow">journey.</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-400 max-w-lg mx-auto md:mx-0">
                            Connect with students who've been where you are — and learn smarter, together.
                        </p>
                        <div className="mt-8 flex gap-4 justify-center md:justify-start">
                             <Button onClick={() => openAuth('signup')} variant="primary">Join Now</Button>
                             <Button onClick={() => openAuth('signin')} variant="secondary">Sign In</Button>
                        </div>
                    </div>
                </section>

                 <section className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-4">Your academic roadmap in <span className="text-glow">3 steps</span></h2>
                    <p className="text-gray-400 text-center mb-12">Simple, transparent, and built for students</p>
                    <div className="grid md:grid-cols-3 gap-8">
                       <FeatureCard number="01" icon={UsersIcon} title="Register & Verify" description="Sign up with your student email and verify your identity. Join a trusted community." />
                       <FeatureCard number="02" icon={BookIcon} title="Share & Discover" description="Post about professors, courses, and resources. Rate and review to help others." />
                       <FeatureCard number="03" icon={StarIcon} title="Learn Smarter" description="Get real feedback from peers. Make informed decisions about your education." />
                    </div>
                </section>

                <section className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-4">Real <span className="text-glow">student experiences</span></h2>
                    <p className="text-gray-400 text-center mb-12">Authentic reviews and recommendations from your peers</p>
                    <div className="w-full overflow-hidden py-4 flex flex-nowrap [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                        <motion.div
                            className="flex gap-8 flex-nowrap"
                            animate={{ x: '-100%' }}
                            transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 50, ease: "linear" } }}
                        >
                            {[...testimonials, ...testimonials].map((t, i) => (
                                <div className="flex-shrink-0 w-[90vw] sm:w-[400px]" key={`testimonial-a-${i}`}>
                                    <TestimonialCard {...t} />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-4">Join thousands of <span className="text-glow">students</span></h2>
                    <p className="text-gray-400 text-center mb-12">Across universities and majors</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        <AnimatedStatCard value="12,500+" label="Students" />
                        <AnimatedStatCard value="150+" label="Universities" />
                        <AnimatedStatCard value="45,000+" label="Reviews" />
                        <AnimatedStatCard value="200+" label="Majors" />
                    </div>
                </section>
                
                <section className="py-24 text-center">
                    <h2 className="text-5xl font-bold mb-4">Ready to find your <span className="text-glow">path?</span></h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join the community and start making smarter academic decisions today.</p>
                    <div className="flex justify-center">
                        <Button onClick={() => openAuth('signup')} variant="primary">Get Started</Button>
                    </div>
                </section>

            </div>
            <footer className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="flex items-center gap-2">
                        <Logo className="text-xl" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0 text-sm text-gray-400">
                        <button onClick={() => setCurrentPage('about')} className="hover:text-[#14F195]">About</button>
                        <button onClick={() => setCurrentPage('privacy')} className="hover:text-[#14F195]">Privacy</button>
                        <button onClick={() => setCurrentPage('terms')} className="hover:text-[#14F195]">Terms</button>
                        <button onClick={() => setCurrentPage('support')} className="hover:text-[#14F195]">Support</button>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 md:mt-0">&copy; 2025 A2Z. All rights reserved</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;