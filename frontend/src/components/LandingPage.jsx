import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Terminal, Cpu, Share2, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import { getUser, logout } from '../utils/auth';

const LandingPage = () => {
    const navigate = useNavigate();
    const [showAuth, setShowAuth] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    const handleAuthSuccess = (userData) => {
        setUser(userData);
        setShowAuth(false);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: '#2C2C2C' }}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute rounded-full opacity-20 blur-3xl animate-pulse"
                    style={{
                        top: '10%',
                        left: '5%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, #007BFF 0%, transparent 70%)',
                        animation: 'float 20s ease-in-out infinite'
                    }}
                />
                <div
                    className="absolute rounded-full opacity-20 blur-3xl animate-pulse"
                    style={{
                        bottom: '10%',
                        right: '5%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, #00FFFF 0%, transparent 70%)',
                        animation: 'float 25s ease-in-out infinite',
                        animationDelay: '5s'
                    }}
                />
            </div>

            {/* Navbar */}
            <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-50 relative">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
                        <Terminal size={24} style={{ color: '#007BFF' }} />
                    </div>
                    <span className="font-semibold text-xl tracking-tight" style={{ color: '#F5F5F5' }}>
                        TechWrapSaga
                    </span>
                </div>
                {user && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #007BFF 0%, #00FFFF 100%)',
                                    color: '#FFFFFF'
                                }}
                            >
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="hidden md:block text-sm" style={{ color: '#EAEAEA' }}>
                                {user?.name?.split(' ')[0] || 'User'}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg transition-all"
                            style={{ color: '#EAEAEA' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = '#F5F5F5';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#EAEAEA';
                            }}
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center">
                <div className="max-w-5xl mx-auto space-y-8">
                    <h1
                        className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
                        style={{
                            color: '#F5F5F5',
                            animation: 'fadeInUp 0.8s ease-out'
                        }}
                    >
                        Your 2025 TechWrapSaga
                    </h1>

                    <p
                        className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                        style={{
                            color: '#EAEAEA',
                            animation: 'fadeInUp 0.8s ease-out 0.2s both'
                        }}
                    >
                        Celebrate your coding journey. Visualize your growth, projects, and stack in a shareable aesthetic recap.
                    </p>

                    <div style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
                        {!user ? (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="px-8 py-4 rounded-lg font-medium text-base transition-all inline-flex items-center gap-2"
                                style={{
                                    background: 'linear-gradient(135deg, #007BFF 0%, #00FFFF 100%)',
                                    color: '#FFFFFF',
                                    boxShadow: '0 4px 20px rgba(0, 123, 255, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 123, 255, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 123, 255, 0.3)';
                                }}
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/form')}
                                className="px-8 py-4 rounded-lg font-medium text-base transition-all inline-flex items-center gap-2"
                                style={{
                                    background: 'linear-gradient(135deg, #007BFF 0%, #00FFFF 100%)',
                                    color: '#FFFFFF',
                                    boxShadow: '0 4px 20px rgba(0, 123, 255, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 123, 255, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 123, 255, 0.3)';
                                }}
                            >
                                Create Your Recap
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full pb-16"
                    style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
                >
                    <FeatureCard
                        icon={<Cpu size={24} style={{ color: '#007BFF' }} />}
                        title="Track Progress"
                        description="Input your tech events, projects, and new tools learned throughout the year."
                    />
                    <FeatureCard
                        icon={<Terminal size={24} style={{ color: '#00FFFF' }} />}
                        title="Choose Theme"
                        description="Select from multiple design styles to match your personal brand."
                    />
                    <FeatureCard
                        icon={<Share2 size={24} style={{ color: '#007BFF' }} />}
                        title="Share Recap"
                        description="Export a beautiful visual summary perfect for social media."
                    />
                </div>
            </div>

            {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(30px, -30px); }
                    66% { transform: translate(-20px, 20px); }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="p-8 rounded-xl transition-all duration-300"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 8px 30px rgba(0, 123, 255, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="mb-5 p-3 w-fit rounded-lg"
                style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}
            >
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#F5F5F5' }}>
                {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#EAEAEA' }}>
                {description}
            </p>
        </div>
    );
};

export default LandingPage;