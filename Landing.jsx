import React, { useState, useEffect, useRef } from 'react';
// 1. FIX: Use standard Lucide imports (assuming `lucide-react` is installed)
import { 
  Mail, Lock, User, Sun, Moon, BookOpen, Code, Calculator, 
  TrendingUp, Zap, Clock, MessageSquare, CornerUpRight, Users, 
  Feather, Phone, AtSign, Globe, Check, PlayCircle 
} from 'lucide-react';

// --- CONFIG & UTILITIES ---

const BRAND_COLOR = {
  light: 'bg-indigo-600 hover:bg-indigo-700',
  dark: 'bg-purple-600 hover:bg-purple-700',
  text: 'text-indigo-600 dark:text-purple-400',
  ring: 'ring-indigo-500 dark:ring-purple-500',
};

// Simple hook to observe when an element enters the viewport
const useIntersectionObserver = (options) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Set to true only once
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Optional: observer.unobserve(entry.target); 
      }
    }, options);

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

// --- SUB-COMPONENTS ---

const FloatingIcon = ({ Icon, size, className, delay, duration }) => (
  <div 
    className={`absolute text-indigo-500/50 dark:text-purple-400/50 ${className} opacity-50 z-0 animate-float`}
    style={{ 
      '--float-delay': delay, 
      '--float-duration': `${duration}s`,
      animationDelay: `${Math.random() * delay}s`
    }}
  >
    {Icon && <Icon size={size} />}
  </div>
);

const FeatureCard = ({ title, icon: Icon, description }) => (
  <div className="flex-shrink-0 w-64 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
    {Icon && <Icon size={32} className={BRAND_COLOR.text} />}
    <h3 className="font-semibold text-xl text-gray-900 dark:text-white my-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, name, title }) => (
  <div className="flex-shrink-0 w-80 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
    <div className="text-2xl mb-4 text-gray-900 dark:text-white">“</div>
    <p className="italic text-gray-600 dark:text-gray-300 mb-4 h-20 overflow-hidden">{quote}</p>
    <div className="flex items-center">
      <img 
        src={`https://placehold.co/40x40/6366f1/ffffff?text=${name.charAt(0)}`} 
        alt={`${name} avatar`} 
        className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-500 dark:border-purple-400 animate-avatar-bounce"
      />
      <div>
        <p className="font-bold text-gray-900 dark:text-white">{name}</p>
        <p className="text-sm text-indigo-600 dark:text-purple-400">{title}</p>
      </div>
    </div>
  </div>
);

const AnimatedCounter = ({ endValue, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible] = useIntersectionObserver({ threshold: 0.5 });
  const duration = 2000;

  useEffect(() => {
    if (isVisible && count === 0) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * endValue));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isVisible, endValue, count]);

  const formatter = new Intl.NumberFormat('en-US');

  return (
    <div ref={ref} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-[1.02]">
      <div className={`text-6xl font-extrabold mb-2 ${BRAND_COLOR.text}`}>{formatter.format(count)}</div>
      <p className="text-lg font-medium text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
};

const StatSection = () => (
  <div className="py-16 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Impact, By the Numbers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatedCounter endValue={15000} label="Students Helped" />
        <AnimatedCounter endValue={42} label="Subjects Covered" />
        <AnimatedCounter endValue={500000} label="XP Earned by Peers" />
      </div>
    </div>
  </div>
);


// --- LANDING COMPONENT ---

const Landing = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authPanel, setAuthPanel] = useState('login');
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);

  // 2. FIX: REMOVED Firebase initialization logic which relies on CDN scripts
  useEffect(() => {
    // console.log("Firebase logic is disabled. Use proper npm package imports for a real project.");
  }, []);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleAuth = (e) => {
    e.preventDefault();
    setIsAuthSuccess(true);
    setTimeout(() => {
      setIsAuthSuccess(false);
      console.log(`${authPanel} successful. Redirecting...`);
    }, 3000);
  };

  const [aboutRef, aboutVisible] = useIntersectionObserver({ threshold: 0.2 });
  const [howRef, howVisible] = useIntersectionObserver({ threshold: 0.2 });
  const [benefitsRef, benefitsVisible] = useIntersectionObserver({ threshold: 0.2 });

  const floatingIcons = [
    { Icon: BookOpen, size: 40, className: 'top-10 left-1/4', delay: 0, duration: 8 },
    { Icon: Code, size: 50, className: 'bottom-20 left-10', delay: 2, duration: 6 },
    { Icon: Calculator, size: 60, className: 'top-1/3 right-10', delay: 4, duration: 7 },
    { Icon: Feather, size: 30, className: 'bottom-5 right-1/4', delay: 1, duration: 9 },
  ];

  const features = [
    { title: "Peer Matchmaking", icon: Users, description: "Intelligent algorithm connects you with the perfect learning partner based on needs and skills." },
    { title: "AI Doubt Solver", icon: Zap, description: "Get instant, context-aware answers for quick fixes before your peer session." },
    { title: "XP Rewards", icon: TrendingUp, description: "Earn experience points, badges, and unlock rewards as you teach and learn." },
    { title: "Video Tutoring", icon: Phone, description: "Integrated high-quality video and screen-sharing tools for effective remote sessions." },
  ];

  const testimonials = [
    { quote: "PeerLearn helped me ace Calculus! Being able to teach Python in return felt incredibly rewarding.", name: "Alex K.", title: "Computer Science Student" },
    { quote: "The matching system is spot on. I instantly found someone who needed help with history and taught me physics.", name: "Maya S.", title: "High School Junior" },
    { quote: "It’s more engaging than traditional tutoring. It truly feels like learning with a friend.", name: "Jordan L.", title: "College Sophomore" },
  ];


  return (
    <div className={`${isDarkMode ? 'dark bg-gray-950' : 'bg-white'} min-h-screen transition-colors duration-500 font-inter`}>
      {/* Dark Mode Toggle & Chatbot Icon */}
      <div className="fixed top-4 right-4 z-50 flex space-x-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full shadow-2xl bg-indigo-500 text-white animate-bounce-slow cursor-pointer">
          <MessageSquare size={24} />
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full shadow-2xl transition-colors duration-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-300"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Confetti Celebration (Simulated) */}
      {isAuthSuccess && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {Array(50).fill().map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-0 bg-indigo-500 dark:bg-purple-400 animate-confetti"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                transform: `rotate(${Math.random() * 360}deg) scale(0)`,
              }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold p-8 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-2xl border border-green-500">
            Success! Welcome to PeerLearn!
          </div>
        </div>
      )}

      <main>
        {/* 1. HERO SECTION (Split Screen) */}
        <section className="h-screen flex flex-col lg:flex-row overflow-hidden relative">
          {/* LEFT SIDE: Illustration and Hero Text */}
          <div className="relative w-full lg:w-3/5 p-8 md:p-16 flex flex-col justify-center items-center bg-indigo-50 dark:bg-gray-900 transition-colors duration-500">
            {/* Floating Icons */}
            {floatingIcons.map((iconProps, index) => (
              <FloatingIcon key={index} {...iconProps} />
            ))}

            {/* Hero Headline (Smooth Fade-in) */}
            <div className="text-center transition-opacity duration-1000 delay-300 opacity-100 mt-20 lg:mt-0" style={{ opacity: 1 }}>
              <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 dark:text-white leading-tight animate-fade-in`}>
                Learn Together, <br /> Grow Together
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
                Connect with peers who are ready to teach what you need and learn what you know. True peer support, powered by connection.
              </p>
            </div>
            {/* Peer Match Visual */}
            <div className="mt-12 w-full max-w-sm flex justify-center items-center">
              <div className="relative w-full h-24">
                <Users size={48} className={`absolute left-0 text-indigo-500 dark:text-purple-400 animate-puzzle-left`} />
                <Users size={48} className={`absolute right-0 text-indigo-500 dark:text-purple-400 animate-puzzle-right`} />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-2 bg-indigo-300 dark:bg-purple-600 rounded-full opacity-0 animate-puzzle-connect" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Animated Login/Register Panel (Glassmorphism) */}
          <div className="w-full lg:w-2/5 p-8 md:p-16 flex flex-col justify-center items-center dark:bg-gray-950 transition-colors duration-500 relative">
            <div className="max-w-md w-full p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md bg-white/20 dark:bg-gray-700/30 border border-white/30 dark:border-gray-600/50 transition-all duration-500 transform scale-100 animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">{authPanel === 'login' ? 'Welcome Back' : 'Join PeerLearn'}</h2>

              <form onSubmit={handleAuth} className="space-y-6">
                {authPanel === 'register' && (
                  <div>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-white/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-white/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-white/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-xl relative overflow-hidden transition duration-300 ${BRAND_COLOR.light} dark:${BRAND_COLOR.dark} focus:outline-none focus:ring-4 ${BRAND_COLOR.ring}`}
                >
                  {authPanel === 'login' ? 'Login' : 'Register'}
                  <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 hover:opacity-100"></span>
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <button
                  onClick={() => setAuthPanel(authPanel === 'login' ? 'register' : 'login')}
                  className={`${BRAND_COLOR.text} font-medium hover:underline transition duration-300`}
                >
                  {authPanel === 'login' ? "Need an account? Register" : "Already have an account? Login"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURE CAROUSEL */}
        <section className="py-20 bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Features Built For Peer Success</h2>
            <div className="flex overflow-x-auto py-4 scrollbar-hide space-x-6 md:justify-center md:flex-wrap">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. ABOUT SECTION (Scroll Trigger Slide Up) */}
        <section ref={aboutRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 transform ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <h2 className={`text-4xl font-bold text-gray-900 dark:text-white mb-6 ${BRAND_COLOR.text}`}>About PeerLearn</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              PeerLearn is a dedicated network built on the principle that the best way to learn is to teach, and the best way to be taught is by someone who recently navigated the same challenges. We facilitate organic, beneficial knowledge exchange across all academic levels.
            </p>
          </div>
        </section>

        {/* STATS SECTION */}
        <StatSection />

        {/* 4. HOW IT WORKS SECTION (Scroll Trigger Slide Up) */}
        <section ref={howRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 transform ${howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <h2 className={`text-4xl font-bold text-gray-900 dark:text-white mb-6 ${BRAND_COLOR.text}`}>How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Users size={30} className={BRAND_COLOR.text} />
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white my-3">1. Create Your Profile</h3>
                <p className="text-gray-600 dark:text-gray-400">List your subjects of expertise and the subjects where you need help.</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <CornerUpRight size={30} className={BRAND_COLOR.text} />
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white my-3">2. Get Matched</h3>
                <p className="text-gray-600 dark:text-gray-400">Our smart matcher finds the perfect learning partner for a mutual exchange.</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Clock size={30} className={BRAND_COLOR.text} />
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white my-3">3. Start Tutoring</h3>
                <p className="text-gray-600 dark:text-gray-400">Schedule a chat or video session and start the knowledge exchange.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. VIDEO PREVIEW */}
        <section className="py-20 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">See PeerLearn in Action</h2>
            <div className="relative mx-auto w-full max-w-3xl aspect-video rounded-2xl shadow-2xl overflow-hidden group">
              <img
                src="https://placehold.co/1280x720/6366f1/ffffff?text=PeerLearn+Platform+Preview"
                alt="Platform Use Case Preview"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                <PlayCircle size={64} className="text-white/80" />
              </div>
            </div>
          </div>
        </section>

        {/* 6. BENEFITS SECTION (Scroll Trigger Slide Up) */}
        <section ref={benefitsRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 transform ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <h2 className={`text-4xl font-bold text-gray-900 dark:text-white mb-6 ${BRAND_COLOR.text}`}>Benefits of Peer Teaching</h2>
            <ul className="space-y-4 text-lg text-gray-600 dark:text-gray-400 list-none">
              <li className="flex items-start">
                <Check className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${BRAND_COLOR.text}`} />
                <span>**Deeper Understanding:** Teaching a subject is the most effective way to master it yourself.</span>
              </li>
              <li className="flex items-start">
                <Check className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${BRAND_COLOR.text}`} />
                <span>**Boosted Confidence:** Gain self-assurance by successfully helping others and overcoming your own struggles.</span>
              </li>
              <li className="flex items-start">
                <Check className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${BRAND_COLOR.text}`} />
                <span>**Community Building:** Forge meaningful connections with students who share your academic journey.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 7. TESTIMONIALS */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Hear From Our Peers</h2>
            <div className="overflow-hidden relative">
              <div className="flex space-x-8 animate-slide-left hover:paused">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. CALL TO ACTION */}
        <section className="py-20 bg-indigo-600 dark:bg-purple-800 transition-colors duration-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-xl text-indigo-100 dark:text-purple-200 mb-8">Stop struggling alone. Start connecting, teaching, and learning today.</p>
            <button
              onClick={() => setAuthPanel('register')}
              className="px-10 py-4 text-lg font-bold text-white uppercase rounded-full shadow-2xl relative overflow-hidden transition duration-500 bg-indigo-800 dark:bg-purple-900 animate-glowing-btn"
            >
              Start Learning with Peers
              <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 hover:opacity-100"></span>
            </button>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">PeerLearn</h3>
              <p className="text-sm">The student-to-student tutoring network.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <a href="#" className="flex items-center hover:text-white transition duration-300 animate-icon-fade">
                <AtSign size={20} className="mr-1" /> Contact
              </a>
              <a href="#" className="flex items-center hover:text-white transition duration-300 animate-icon-fade" style={{ animationDelay: '0.2s' }}>
                <Lock size={20} className="mr-1" /> Privacy
              </a>
              <a href="#" className="flex items-center hover:text-white transition duration-300 animate-icon-fade" style={{ animationDelay: '0.4s' }}>
                <Globe size={20} className="mr-1" /> Terms
              </a>
              <a href="#" className="flex items-center hover:text-white transition duration-300 animate-icon-fade" style={{ animationDelay: '0.6s' }}>
                <svg className="w-5 h-5 fill-current mr-1" viewBox="0 0 24 24"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.405 7.876c-.722.321-1.503.536-2.316.634.832-.497 1.468-1.282 1.77-2.222-.782.464-1.648.8-2.56.98-.737-.785-1.787-1.277-2.951-1.277-2.229 0-4.04 1.812-4.04 4.04 0 .317.036.626.104.922-3.358-.168-6.335-1.778-8.328-4.218-.348.599-.548 1.296-.548 2.035 0 1.402.713 2.64 1.798 3.376-.662-.02-1.284-.202-1.825-.506v.05c0 1.96 1.396 3.597 3.253 3.966-.339.092-.697.14-1.066.14-.262 0-.516-.026-.764-.073.516 1.61 2.01 2.783 3.778 2.815-1.385 1.083-3.13 1.73-5.023 1.73-.327 0-.648-.019-.96-.056 1.794 1.15 3.923 1.824 6.208 1.824 7.45 0 11.528-6.173 11.528-11.528 0-.176-.004-.352-.009-.527.794-.572 1.48-1.283 2.022-2.09z" /></svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} PeerLearn. All rights reserved.
          </div>
        </div>
      </footer>

      <style global>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
          
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(calc(10px * var(--float-delay)), calc(20px * var(--float-delay))) scale(0.95); }
            50% { transform: translate(calc(-10px * var(--float-delay)), calc(-10px * var(--float-delay))) scale(1.05); }
            75% { transform: translate(calc(5px * var(--float-delay)), calc(15px * var(--float-delay))) scale(1); }
          }
          .animate-float { animation: float var(--float-duration) ease-in-out var(--float-delay) infinite alternate; }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
          .animate-fade-in-up { animation: fadeIn 0.8s ease-out forwards; }

          @keyframes puzzle-left {
            0% { transform: translateX(0); opacity: 0.5; }
            50% { transform: translateX(50px); opacity: 1; }
            100% { transform: translateX(0); opacity: 0.5; }
          }
          @keyframes puzzle-right {
            0% { transform: translateX(0); opacity: 0.5; }
            50% { transform: translateX(-50px); opacity: 1; }
            100% { transform: translateX(0); opacity: 0.5; }
          }
          @keyframes puzzle-connect {
            0% { opacity: 0; transform: scaleX(0); }
            50% { opacity: 1; transform: scaleX(1); }
            100% { opacity: 0; transform: scaleX(0); }
          }
          .animate-puzzle-left { animation: puzzle-left 3s infinite ease-in-out; }
          .animate-puzzle-right { animation: puzzle-right 3s infinite ease-in-out; }
          .animate-puzzle-connect { animation: puzzle-connect 3s 1.5s infinite ease-in-out; }

          @keyframes slide-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-slide-left { animation: slide-left 40s linear infinite; }
          .animate-slide-left:hover { animation-play-state: paused; }

          @keyframes avatar-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-avatar-bounce { animation: avatar-bounce 2s ease-in-out infinite alternate; }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15%); }
          }
          .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }

          @keyframes glowing-btn {
            0% { box-shadow: 0 0 5px #a78bfa, 0 0 10px #a78bfa; }
            50% { box-shadow: 0 0 20px #a78bfa, 0 0 40px #a78bfa; }
            100% { box-shadow: 0 0 5px #a78bfa, 0 0 10px #a78bfa; }
          }
          .animate-glowing-btn { animation: glowing-btn 3s infinite alternate; }

          @keyframes confetti {
            0% { opacity: 1; transform: translateY(-100vh) rotate(0deg) scale(1); }
            100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.5); }
          }
          .animate-confetti { animation: confetti 2.5s ease-in-out forwards; }
      `}</style>
      
    </div>
  );
};

export default Landing;