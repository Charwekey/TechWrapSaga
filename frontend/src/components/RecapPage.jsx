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
                const res = await axios.get(`https://accomplished-unity-production.up.railway.app/api/wraps/${id}`);
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
        if (!recapRef.current) return;

        try {
            // Generate canvas
            const canvas = await html2canvas(recapRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                allowTaint: false,
                logging: false
            });

            const fileName = `tech-wrapped-2025-${userData?.name || 'recap'}.png`;

            // Try direct download first (works on most desktop browsers)
            const dataUrl = canvas.toDataURL('image/png');

            // Create download link
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Download failed. Try taking a screenshot instead!");
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        // Try Web Share API first (native mobile sharing)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Tech Wrapped 2025',
                    text: 'Check out my Tech Wrapped 2025!',
                    url: url
                });
                return;
            } catch (err) {
                // User cancelled or share failed, fall through to clipboard
                if (err.name !== 'AbortError') {
                    console.log('Share failed:', err);
                }
            }
        }

        // Fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        } catch (err) {
            // Final fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert("Link copied to clipboard!");
            } catch (e) {
                alert("Please copy this link: " + url);
            }
            document.body.removeChild(textArea);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a2e' }}>
                <div className="text-center">
                    <div
                        className="inline-block w-12 h-12 border-4 rounded-full animate-spin mb-4"
                        style={{
                            borderColor: '#6b7280',
                            borderTopColor: 'transparent'
                        }}
                    />
                    <p className="text-xl font-medium" style={{ color: '#d1d5db' }}>
                        Generating your wrap...
                    </p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a2e' }}>
                <p className="text-xl" style={{ color: '#d1d5db' }}>Recap not found.</p>
            </div>
        );
    }

    const isGirly = userData.theme === 'girly';
    const isNeutral = userData.theme === 'neutral';
    const isHybrid = userData.theme === 'hybrid';

    // Render Girly Theme
    if (isGirly) {
        return (
            <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative" style={{ backgroundColor: '#fce4ec' }}>
                {/* Actions Bar */}
                <div className="fixed top-8 right-8 z-50 flex gap-3">
                    <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #f8bbd9', color: '#d81b60' }}>
                        <Share2 size={16} /> Share
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg" style={{ background: 'linear-gradient(135deg, #f48fb1 0%, #f06292 100%)', color: '#FFFFFF', boxShadow: '0 4px 15px rgba(244, 143, 177, 0.4)' }}>
                        <Download size={16} /> Download
                    </button>
                    <Link to="/" className="p-2.5 rounded-full transition-all flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #f8bbd9', color: '#d81b60' }}>
                        <Home size={20} />
                    </Link>
                </div>

                {/* The Girly Recap Card */}
                <div
                    ref={recapRef}
                    className="w-full max-w-[600px] p-6 rounded-3xl relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(180deg, #fce4ec 0%, #f8bbd9 30%, #f5c6d6 60%, #e8d5e0 100%)',
                        boxShadow: '0 20px 60px rgba(216, 27, 96, 0.15)'
                    }}
                >
                    {/* Floating Background Elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div style={{ position: 'absolute', top: '8%', left: '-5%', width: '180px', height: '80px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '50px', filter: 'blur(2px)' }} />
                        <div style={{ position: 'absolute', top: '5%', right: '-8%', width: '200px', height: '90px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '60px', filter: 'blur(3px)' }} />
                        <span style={{ position: 'absolute', top: '12%', left: '8%', fontSize: '20px', opacity: 0.7 }}>💗</span>
                        <span style={{ position: 'absolute', top: '18%', right: '12%', fontSize: '16px', opacity: 0.6 }}>💕</span>
                        <span style={{ position: 'absolute', top: '8%', left: '30%', fontSize: '12px', opacity: 0.8 }}>✦</span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                        <header className="text-center mb-6 pt-4">
                            <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2.8rem', fontWeight: '700', color: '#c2185b', marginBottom: '8px' }}>{userData.name}</h1>
                            <p style={{ fontSize: '1rem', color: '#d81b60', fontWeight: '500' }}>{userData.title} | 2025</p>
                        </header>

                        {/* Bento Box Layout */}
                        <div className="flex-1 flex flex-col gap-3">
                            {/* Row 1: Two cards side by side */}
                            <div className="grid grid-cols-2 gap-3">
                                <GirlyCard icon="📅" title="Tech Events Attended" items={userData.events_attended} type="text" />
                                <GirlyCard icon="💻" title="Projects Built" items={userData.projects} type="text" />
                            </div>

                            {/* Row 2: Full width card */}
                            <GirlyCard icon="🎤" title="Tech Events Spoken At" items={userData.events_spoken_at} type="text" size="full" />

                            {/* Row 3: Tech Stack - Full width gradient banner */}
                            {userData.tools_learned?.length > 0 && (
                                <div style={{ background: 'linear-gradient(90deg, #f8bbd9 0%, #f48fb1 40%, #ff8a80 70%, #ffab91 100%)', borderRadius: '24px', padding: '16px 20px', boxShadow: '0 4px 20px rgba(244, 143, 177, 0.3)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span style={{ fontSize: '16px' }}>🌱</span>
                                        <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.4rem', color: '#fff', fontWeight: '600' }}>Tech Stack Learned</h3>
                                    </div>
                                    <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{userData.tools_learned.join(', ')}</p>
                                </div>
                            )}

                            {/* Row 4: Two cards - Challenge and Overcome */}
                            <div className="grid grid-cols-5 gap-3">
                                <div className="col-span-2">
                                    <GirlyCard icon="⚡" title="Biggest Challenge" content={userData.challenges?.[0]} type="text" />
                                </div>
                                <div className="col-span-3">
                                    <GirlyCard icon="💪" title="How You Overcame It" content={userData.overcome_challenges?.[0]} type="text" />
                                </div>
                            </div>

                            {/* Row 5: Goals - Full width */}
                            {userData.goals_2026?.length > 0 && (
                                <div style={{ background: 'rgba(255, 255, 255, 0.85)', borderRadius: '24px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(216, 27, 96, 0.1)', border: '1px solid rgba(248, 187, 217, 0.4)' }}>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span style={{ fontSize: '14px' }}>✨</span>
                                        <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.5rem', color: '#c2185b', fontWeight: '600' }}>Goals for 2026</h3>
                                        <span style={{ fontSize: '14px' }}>✨</span>
                                    </div>
                                    <p style={{ color: '#6d4c5e', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{userData.goals_2026.join(', ')}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 text-center">
                            <p style={{ fontSize: '0.8rem', color: '#ad1457', fontWeight: '500', opacity: 0.7 }}>techwrapsaga.com ✨</p>
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-sm" style={{ color: '#c2185b' }}>TechWrapSaga 2025 💕</p>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');`}</style>
            </div>
        );
    }

    // Render Neutral Theme
    if (isNeutral) {
        return (
            <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative" style={{ backgroundColor: '#d8c4e0' }}>
                {/* Actions Bar */}
                <div className="fixed top-8 right-8 z-50 flex gap-3">
                    <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #c9a9d9', color: '#7b5a8c' }}>
                        <Share2 size={16} /> Share
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg" style={{ background: 'linear-gradient(135deg, #b388c2 0%, #9575a8 100%)', color: '#FFFFFF', boxShadow: '0 4px 15px rgba(156, 122, 165, 0.4)' }}>
                        <Download size={16} /> Download
                    </button>
                    <Link to="/" className="p-2.5 rounded-full transition-all flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #c9a9d9', color: '#7b5a8c' }}>
                        <Home size={20} />
                    </Link>
                </div>

                {/* The Neutral Recap Card */}
                <div ref={recapRef} className="w-full max-w-[600px] p-6 rounded-3xl relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #e8d5f0 0%, #d4bde3 20%, #c9b5d9 40%, #dfc9e8 60%, #e5d1eb 80%, #dbc5e4 100%)', boxShadow: '0 20px 60px rgba(123, 90, 140, 0.2)' }}>
                    {/* Background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div style={{ position: 'absolute', top: '15%', left: '-10%', width: '120%', height: '100px', background: 'linear-gradient(90deg, rgba(200, 175, 210, 0.4) 0%, rgba(230, 210, 240, 0.5) 50%, rgba(200, 175, 210, 0.4) 100%)', borderRadius: '100px', transform: 'rotate(-3deg)' }} />
                        <span style={{ position: 'absolute', top: '5%', right: '15%', fontSize: '14px', opacity: 0.9, color: '#fff' }}>✦</span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                        <header className="text-center mb-6 pt-4">
                            <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2.6rem', fontWeight: '700', color: '#8b6a9c', marginBottom: '8px' }}>{userData.name}</h1>
                            <p style={{ fontSize: '1rem', color: '#7b5a8c', fontWeight: '500' }}>{userData.title} | 2025</p>
                        </header>

                        {/* Bento Box Layout */}
                        <div className="flex-1 flex flex-col gap-3">
                            {/* Row 1: Two cards side by side */}
                            <div className="grid grid-cols-2 gap-3">
                                <NeutralCard icon="📅" title="Tech Events Attended" items={userData.events_attended} type="text" />
                                <NeutralCard icon="🎤" title="Tech Events Spoken At" items={userData.events_spoken_at} type="text" />
                            </div>

                            {/* Row 2: Projects - Full width */}
                            <NeutralCard icon="📁" title="Projects Built" items={userData.projects} type="text" size="full" />

                            {/* Row 3: Tech Stack */}
                            {userData.tools_learned?.length > 0 && (
                                <div style={{ background: 'rgba(255, 255, 255, 0.75)', borderRadius: '24px', padding: '16px 20px', boxShadow: '0 4px 15px rgba(123, 90, 140, 0.1)', border: '1px solid rgba(200, 175, 210, 0.3)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span style={{ fontSize: '16px' }}>⚙️</span>
                                        <h3 style={{ fontSize: '1rem', color: '#6d4c7d', fontWeight: '600' }}>Tech Stack Learned</h3>
                                    </div>
                                    <p style={{ color: '#5a4066', fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{userData.tools_learned.join(', ')}</p>
                                </div>
                            )}

                            {/* Row 4: Asymmetric - Challenge (smaller) + Overcome (wider) */}
                            <div className="grid grid-cols-5 gap-3">
                                <div className="col-span-2">
                                    <NeutralCard icon="⚡" title="Biggest Challenge" content={userData.challenges?.[0]} type="text" />
                                </div>
                                <div className="col-span-3">
                                    <NeutralCard icon="💪" title="How You Overcame It" content={userData.overcome_challenges?.[0]} type="text" />
                                </div>
                            </div>

                            {/* Row 5: Goals - Full width */}
                            {userData.goals_2026?.length > 0 && (
                                <div style={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: '24px', padding: '20px', boxShadow: '0 4px 15px rgba(123, 90, 140, 0.1)', border: '1px solid rgba(200, 175, 210, 0.3)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span style={{ fontSize: '16px' }}>🚀</span>
                                        <h3 style={{ fontSize: '1.1rem', color: '#6d4c7d', fontWeight: '600' }}>Goals for 2026</h3>
                                    </div>
                                    <p style={{ color: '#5a4066', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{userData.goals_2026.join(', ')}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 text-center">
                            <p style={{ fontSize: '0.8rem', color: '#8b6a9c', fontWeight: '500', opacity: 0.7 }}>techwrapsaga.com ✨</p>
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-sm" style={{ color: '#7b5a8c' }}>TechWrapSaga 2025 ✦</p>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');`}</style>
            </div>
        );
    }

    // Render Hybrid Theme - Dark Cosmic
    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative" style={{ backgroundColor: '#0d1321' }}>
            {/* Actions Bar */}
            <div className="fixed top-8 right-8 z-50 flex gap-3">
                <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#d1d5db' }}>
                    <Share2 size={16} /> Share
                </button>
                <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all" style={{ background: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)', color: '#FFFFFF', boxShadow: '0 4px 15px rgba(75, 85, 99, 0.4)' }}>
                    <Download size={16} /> Download
                </button>
                <Link to="/" className="p-2.5 rounded-full transition-all flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#d1d5db' }}>
                    <Home size={20} />
                </Link>
            </div>

            {/* The Hybrid Cosmic Recap Card */}
            <div
                ref={recapRef}
                className="w-full max-w-[600px] p-6 rounded-3xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, #1a2744 0%, #0f1a30 25%, #162035 50%, #1a2540 75%, #0d1525 100%)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Background - Nebula waves and stars */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{ position: 'absolute', top: '8%', left: '-20%', width: '140%', height: '120px', background: 'linear-gradient(90deg, transparent 0%, rgba(55, 65, 90, 0.6) 30%, rgba(75, 85, 110, 0.5) 50%, rgba(55, 65, 90, 0.6) 70%, transparent 100%)', borderRadius: '100px', transform: 'rotate(-5deg)' }} />
                    <div style={{ position: 'absolute', top: '45%', right: '-20%', width: '130%', height: '90px', background: 'linear-gradient(90deg, transparent 0%, rgba(50, 60, 85, 0.5) 30%, rgba(70, 80, 105, 0.4) 60%, transparent 100%)', borderRadius: '85px', transform: 'rotate(-4deg)' }} />
                    <span style={{ position: 'absolute', top: '3%', right: '20%', fontSize: '6px', opacity: 0.9, color: '#fff' }}>✦</span>
                    <span style={{ position: 'absolute', top: '20%', right: '10%', fontSize: '6px', opacity: 0.9, color: '#fff' }}>✦</span>
                    <span style={{ position: 'absolute', top: '50%', right: '5%', fontSize: '6px', opacity: 0.9, color: '#fff' }}>✦</span>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    <header className="text-center mb-6 pt-4">
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', fontWeight: '600', color: '#e5e7eb', letterSpacing: '2px', marginBottom: '8px' }}>{userData.name}</h1>
                        <p style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: '400', letterSpacing: '1px' }}>{userData.title} | 2025</p>
                    </header>

                    {/* Bento Box Layout */}
                    <div className="flex-1 flex flex-col gap-3">
                        {/* Row 1: Two cards side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <HybridCard icon="📅" title="Tech Events Attended" items={userData.events_attended} type="text" />
                            <HybridCard icon="🎤" title="Tech Events Spoken At" items={userData.events_spoken_at} type="text" />
                        </div>

                        {/* Row 2: Projects - Full width */}
                        <HybridCard icon="📁" title="Projects Built" items={userData.projects} type="text" size="full" />

                        {/* Row 3: Tech Stack - Full width */}
                        {userData.tools_learned?.length > 0 && (
                            <div style={{ background: 'rgba(55, 65, 85, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '16px 20px', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span style={{ fontSize: '16px' }}>🧰</span>
                                    <h3 style={{ fontSize: '1rem', color: '#e5e7eb', fontWeight: '600' }}>Tech Stack Learned</h3>
                                </div>
                                <p style={{ color: '#d1d5db', fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{userData.tools_learned.join(', ')}</p>
                            </div>
                        )}

                        {/* Row 4: Asymmetric - Challenge (smaller) + Overcome (wider) */}
                        <div className="grid grid-cols-5 gap-3">
                            <div className="col-span-3">
                                <HybridCard icon="⚡" title="Biggest Challenge" content={userData.challenges?.[0]} type="text" variant="light" />
                            </div>
                            <div className="col-span-3">
                                <HybridCard icon="💪" title="How You Overcame It" content={userData.overcome_challenges?.[0]} type="text" variant="light" />
                            </div>
                        </div>

                        {/* Row 5: Goals - Full width */}
                        {userData.goals_2026?.length > 0 && (
                            <div style={{ background: 'rgba(245, 245, 245, 0.9)', borderRadius: '20px', padding: '16px', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span style={{ fontSize: '14px' }}>🚀</span>
                                    <h3 style={{ fontSize: '0.95rem', color: '#374151', fontWeight: '600' }}>Goals for 2026</h3>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{userData.goals_2026.join(', ')}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 text-center">
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500', opacity: 0.8 }}>techwrapsaga.com ✦</p>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-sm" style={{ color: '#9ca3af' }}>TechWrapSaga 2025 ✦</p>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');`}</style>
        </div>
    );
};

// Girly Card Component - handles both arrays and strings
const GirlyCard = ({ icon, title, items, content, type, size }) => {
    // Handle arrays passed to type='text'
    let displayContent = content;
    if (type === 'text' && Array.isArray(items)) {
        displayContent = items.filter(Boolean).join(', ');
    }

    // Check if we have content to display
    if (type === 'list' && (!items || items.length === 0)) return null;
    if (type === 'text' && (!displayContent || (typeof displayContent === 'string' && !displayContent.trim()))) return null;

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '20px',
            padding: size === 'full' ? '16px 20px' : '14px 16px',
            boxShadow: '0 4px 15px rgba(216, 27, 96, 0.08)',
            border: '1px solid rgba(248, 187, 217, 0.3)',
            height: '100%'
        }}>
            <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '14px' }}>{icon}</span>
                <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.2rem', color: '#c2185b', fontWeight: '600' }}>{title}</h3>
            </div>
            {type === 'list' ? (
                <ul style={{ fontSize: '0.8rem', color: '#6d4c5e', paddingLeft: '0', margin: '0', listStyle: 'none' }}>
                    {items.map((item, i) => (
                        <li key={i} style={{ marginBottom: '3px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ color: '#f48fb1' }}>●</span>
                            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ fontSize: '0.8rem', color: '#6d4c5e', lineHeight: '1.4', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{displayContent}</p>
            )}
        </div>
    );
};

// Neutral Card Component - handles both arrays and strings
const NeutralCard = ({ icon, title, items, content, type, size }) => {
    // Handle arrays passed to type='text'
    let displayContent = content;
    if (type === 'text' && Array.isArray(items)) {
        displayContent = items.filter(Boolean).join(', ');
    }

    // Check if we have content to display
    if (type === 'list' && (!items || items.length === 0)) return null;
    if (type === 'text' && (!displayContent || (typeof displayContent === 'string' && !displayContent.trim()))) return null;

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.75)',
            borderRadius: '20px',
            padding: size === 'full' ? '16px 20px' : '14px 16px',
            boxShadow: '0 4px 15px rgba(123, 90, 140, 0.08)',
            border: '1px solid rgba(200, 175, 210, 0.3)',
            height: '100%'
        }}>
            <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '14px' }}>{icon}</span>
                <h3 style={{ fontSize: '0.95rem', color: '#6d4c7d', fontWeight: '600' }}>{title}</h3>
            </div>
            {type === 'list' ? (
                <ul style={{ fontSize: '0.8rem', color: '#5a4066', paddingLeft: '0', margin: '0', listStyle: 'none' }}>
                    {items.map((item, i) => (
                        <li key={i} style={{ marginBottom: '3px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ color: '#9c7aa5' }}>●</span>
                            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ fontSize: '0.8rem', color: '#5a4066', lineHeight: '1.4', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{displayContent}</p>
            )}
        </div>
    );
};

// Hybrid Card Component - handles both arrays and strings
const HybridCard = ({ icon, title, items, content, type, size, variant }) => {
    // Handle arrays passed to type='text'
    let displayContent = content;
    if (type === 'text' && Array.isArray(items)) {
        displayContent = items.filter(Boolean).join(', ');
    }

    // Check if we have content to display
    if (type === 'list' && (!items || items.length === 0)) return null;
    if (type === 'text' && (!displayContent || (typeof displayContent === 'string' && !displayContent.trim()))) return null;

    const isLight = variant === 'light';

    return (
        <div style={{
            background: isLight ? 'rgba(245, 245, 245, 0.9)' : 'rgba(55, 65, 85, 0.7)',
            backdropFilter: isLight ? 'none' : 'blur(10px)',
            borderRadius: '20px',
            padding: size === 'full' ? '16px 20px' : '14px 16px',
            border: isLight ? '1px solid rgba(209, 213, 219, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)',
            height: '100%'
        }}>
            <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '14px' }}>{icon}</span>
                <h3 style={{ fontSize: '0.95rem', color: isLight ? '#374151' : '#e5e7eb', fontWeight: '600' }}>{title}</h3>
            </div>
            {type === 'list' ? (
                <ul style={{ fontSize: '0.8rem', color: isLight ? '#4b5563' : '#d1d5db', paddingLeft: '0', margin: '0', listStyle: 'none' }}>
                    {items.map((item, i) => (
                        <li key={i} style={{ marginBottom: '3px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ color: isLight ? '#6b7280' : '#9ca3af' }}>●</span>
                            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ fontSize: '0.8rem', color: isLight ? '#4b5563' : '#d1d5db', lineHeight: '1.4', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{displayContent}</p>
            )}
        </div>
    );
};

export default RecapPage;