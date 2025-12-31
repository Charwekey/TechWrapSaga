import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { Download, Share2, Home } from 'lucide-react';

const RecapPage = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const recapRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/wraps/${id}`);
                setUserData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDownload = async () => {
        if (recapRef.current) {
            try {
                const canvas = await html2canvas(recapRef.current, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null,
                });
                const link = document.createElement('a');
                link.download = `tech-wrapped-2025-${userData?.name || 'recap'}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (err) {
                console.error("Export failed", err);
                alert("Failed to generate image. Please try again.");
            }
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2C2C2C' }}>
                <div className="text-center">
                    <div
                        className="inline-block w-12 h-12 border-4 rounded-full animate-spin mb-4"
                        style={{
                            borderColor: '#007BFF',
                            borderTopColor: 'transparent'
                        }}
                    />
                    <p className="text-xl font-medium" style={{ color: '#F5F5F5' }}>
                        Generating your wrap...
                    </p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2C2C2C' }}>
                <p className="text-xl" style={{ color: '#F5F5F5' }}>Recap not found.</p>
            </div>
        );
    }

    const themeClass = `theme-${userData.theme || 'neutral'}`;

    return (
        <div className={`min-h-screen ${themeClass} p-4 md:p-8 flex flex-col items-center justify-center relative`} style={{ backgroundColor: '#2C2C2C' }}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute rounded-full opacity-10 blur-3xl"
                    style={{
                        top: '5%',
                        left: '10%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, #007BFF 0%, transparent 70%)',
                        animation: 'float 25s ease-in-out infinite'
                    }}
                />
                <div
                    className="absolute rounded-full opacity-10 blur-3xl"
                    style={{
                        bottom: '10%',
                        right: '10%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, #00FFFF 0%, transparent 70%)',
                        animation: 'float 30s ease-in-out infinite',
                        animationDelay: '5s'
                    }}
                />
            </div>

            {/* Actions Bar */}
            <div className="fixed top-8 right-8 z-50 flex gap-3">
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#F5F5F5'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <Share2 size={16} /> Share
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all"
                    style={{
                        background: 'linear-gradient(135deg, #007BFF 0%, #00FFFF 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
                    }}
                >
                    <Download size={16} /> Download
                </button>
                <Link
                    to="/"
                    className="p-2.5 rounded-lg transition-all flex items-center justify-center"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#F5F5F5'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                >
                    <Home size={20} />
                </Link>
            </div>

            {/* The Recap Card */}
            <div
                ref={recapRef}
                className={`w-full max-w-[500px] aspect-[9/16] md:aspect-auto md:min-h-[900px] p-8 rounded-2xl relative overflow-hidden flex flex-col gap-6 text-center ${themeClass}`}
                style={{
                    background: userData.theme === 'girly'
                        ? 'linear-gradient(135deg, #fceff9 0%, #f5e3e6 100%)'
                        : userData.theme === 'hybrid'
                            ? 'radial-gradient(circle at top, #1e1b4b, #0f172a)'
                            : '#F5F5F5',
                    border: '1px solid rgba(0, 123, 255, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}
            >
                {/* Background Decor - Replaced emojis with subtle shapes */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 z-0">
                    <div
                        className="absolute rounded-full"
                        style={{
                            top: '10%',
                            left: '10%',
                            width: '60px',
                            height: '60px',
                            background: 'radial-gradient(circle, rgba(0, 123, 255, 0.3) 0%, transparent 70%)'
                        }}
                    />
                    <div
                        className="absolute rounded-full"
                        style={{
                            top: '20%',
                            right: '15%',
                            width: '40px',
                            height: '40px',
                            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)'
                        }}
                    />
                    <div
                        className="absolute rounded-full"
                        style={{
                            bottom: '25%',
                            left: '20%',
                            width: '50px',
                            height: '50px',
                            background: 'radial-gradient(circle, rgba(0, 123, 255, 0.2) 0%, transparent 70%)'
                        }}
                    />
                </div>

                {/* Content */}
                <div className={`relative z-10 flex flex-col h-full ${userData.theme === 'neutral' ? 'text-gray-900' : 'text-white'}`}>
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${userData.theme === 'girly' ? 'text-pink-600' : ''}`}>
                            {userData.name}
                        </h1>
                        <p className="text-lg opacity-80">{userData.title} | 2025</p>
                    </header>

                    {/* Sections */}
                    <div className="flex-1 flex flex-col gap-4 justify-center">
                        <SectionCard title="Tech Events Attended" items={userData.events_attended} theme={userData.theme} />

                        <div className="grid grid-cols-2 gap-4">
                            <SectionCard title="Projects" items={userData.projects} theme={userData.theme} />
                            <SectionCard title="Events Spoken At" items={userData.events_spoken_at} theme={userData.theme} />
                        </div>

                        <SectionCard title="New Tools" items={userData.tools_learned} theme={userData.theme} pill />

                        {/* Challenges & Growth Section */}
                        <div
                            className="p-5 rounded-xl transition-all"
                            style={{
                                backgroundColor: userData.theme === 'girly'
                                    ? 'rgba(255, 255, 255, 0.6)'
                                    : userData.theme === 'hybrid'
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                border: userData.theme === 'girly'
                                    ? '1px solid rgba(236, 72, 153, 0.3)'
                                    : userData.theme === 'hybrid'
                                        ? '1px solid rgba(168, 85, 247, 0.3)'
                                        : '1px solid rgba(0, 123, 255, 0.2)',
                                color: userData.theme === 'neutral' ? '#1F2937' : '#FFFFFF'
                            }}
                        >
                            {userData.challenges?.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-semibold text-sm uppercase opacity-70 mb-2 tracking-wide">The Challenge</h3>
                                    <p className="text-sm font-medium leading-relaxed">"{userData.challenges[0]}"</p>
                                    {userData.overcome_challenges?.length > 0 && (
                                        <p className="text-xs opacity-80 mt-2 leading-relaxed">How I Overcame It: {userData.overcome_challenges[0]}</p>
                                    )}
                                </div>
                            )}

                            {userData.lessons_learned?.length > 0 && (
                                <div>
                                    <div className="w-full h-px bg-current opacity-20 my-3"></div>
                                    <h3 className="font-semibold text-sm uppercase opacity-70 mb-2 tracking-wide">Lesson Learned</h3>
                                    <p className="text-sm italic leading-relaxed">"{userData.lessons_learned[0]}"</p>
                                </div>
                            )}
                        </div>

                        {userData.growth_journey?.length > 0 && (
                            <SectionCard title="Growth Journey" items={userData.growth_journey} theme={userData.theme} />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {userData.goals_2026?.length > 0 && (
                                <div
                                    className="p-4 rounded-xl transition-all"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <h3 className="font-semibold text-sm mb-2">2026 Goals</h3>
                                    <p className="text-xs opacity-90 leading-relaxed">{userData.goals_2026.join(', ')}</p>
                                </div>
                            )}
                            {userData.final_wrap?.length > 0 && (
                                <div
                                    className="p-4 rounded-xl transition-all"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <h3 className="font-semibold text-sm mb-2">Final Word</h3>
                                    <p className="text-xs opacity-90 italic leading-relaxed">"{userData.final_wrap[0]}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 text-sm opacity-50" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        techwrapsaga.com
                    </div>
                </div>
            </div>

            <p className="mt-8 text-sm relative z-10" style={{ color: '#EAEAEA' }}>
                TechWrapSaga 2025
            </p>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(30px, -30px); }
                    66% { transform: translate(-20px, 20px); }
                }
            `}</style>
        </div>
    );
};

const SectionCard = ({ title, items, theme, pill }) => {
    if (!items || items.length === 0) return null;

    const cardStyle = {
        backgroundColor: theme === 'girly'
            ? 'rgba(255, 255, 255, 0.6)'
            : theme === 'hybrid'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.8)',
        border: theme === 'girly'
            ? '1px solid rgba(236, 72, 153, 0.3)'
            : theme === 'hybrid'
                ? '1px solid rgba(168, 85, 247, 0.3)'
                : '1px solid rgba(0, 123, 255, 0.2)',
        color: theme === 'neutral' ? '#1F2937' : '#FFFFFF'
    };

    return (
        <div className="rounded-xl p-5 transition-all" style={cardStyle}>
            <h3 className="font-semibold text-base mb-3">{title}</h3>
            {pill ? (
                <div className="flex flex-wrap justify-center gap-2">
                    {items.map((item, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <ul className="text-sm space-y-1.5 text-left">
                    {items.slice(0, 4).map((item, i) => (
                        <li key={i} className="opacity-90 leading-relaxed">• {item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecapPage;