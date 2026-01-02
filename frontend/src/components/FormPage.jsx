import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUser } from '../utils/auth';

const FormPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', title: '',
        events_attended: '', events_spoken_at: '', projects: '',
        tools_learned: '', challenges: '', overcome_challenges: '',
        goals_2026: '', theme: 'neutral'
    });
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = getUser();
        if (!currentUser) {
            navigate('/');
        } else {
            setUser(currentUser);
            setFormData(prev => ({
                ...prev,
                name: currentUser.name || '',
                title: currentUser.title || ''
            }));
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) throw new Error("Not authenticated");

            const splitAndTrim = (str) => str ? str.split(',').map(s => s.trim()) : [];

            const wrapData = {
                title: formData.title,
                events_attended: splitAndTrim(formData.events_attended),
                events_spoken_at: splitAndTrim(formData.events_spoken_at),
                projects: splitAndTrim(formData.projects),
                tools_learned: splitAndTrim(formData.tools_learned),
                challenges: splitAndTrim(formData.challenges),
                overcome_challenges: splitAndTrim(formData.overcome_challenges),
                goals_2026: splitAndTrim(formData.goals_2026),
                theme: formData.theme
            };

            const res = await axios.post('https://accomplished-unity-production.up.railway.app/api/wraps', wrapData, {
                headers: { 'auth-token': token }
            });

            navigate(`/recap/${res.data.id}`);
        } catch (error) {
            console.error('Wrap submission error:', error);
            console.log('Response status:', error.response?.status);
            console.log('Response data:', error.response?.data);
            console.log('Token used:', localStorage.getItem('auth-token')?.substring(0, 20) + '...');

            // Handle token expiration/invalid token
            if (error.response?.status === 400 || error.response?.status === 401) {
                const errorMsg = error.response?.data || 'Unknown error';
                alert(`Authentication error: ${errorMsg}\n\nPlease check the browser console (F12) for more details.`);
                localStorage.removeItem('auth-token');
                localStorage.removeItem('user');
                navigate('/');
                return;
            }
            alert('Error submitting form: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2C2C2C] text-white relative overflow-hidden">
            {/* Subtle animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2C] via-[#1a1a1a] to-[#2C2C2C] opacity-90"></div>

            {/* Subtle light effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#007BFF]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FFFF]/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
                {/* Header */}
                <header className="mb-16 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
                        Create Your 2025 Wrap
                    </h1>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto">
                        Document your journey, showcase your growth
                    </p>
                    <p className="text-sm text-amber-400/80 mt-2">
                        ✨ Kindly keep answers brief for the best recap experience
                    </p>
                </header>

                {/* Form Container */}
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-16">

                        {/* Section 1 */}
                        <section className="space-y-8">
                            <SectionHeader number="01" title="Developer Profile" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Jane Doe"
                                />
                                <InputGroup
                                    label="Role / Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Full Stack Developer"
                                />
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 2 */}
                        <section className="space-y-8">
                            <SectionHeader number="02" title="Growth & Achievements" />

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup
                                        label="Projects Built"
                                        name="projects"
                                        value={formData.projects}
                                        onChange={handleChange}
                                        type="textarea"
                                        placeholder="AI Chatbot, Portfolio V2, E-commerce Store"
                                    />
                                    <InputGroup
                                        label="Tech Stack / Tools Learnt"
                                        name="tools_learned"
                                        value={formData.tools_learned}
                                        onChange={handleChange}
                                        type="textarea"
                                        placeholder="Next.js 14, Docker, Rust, Framer Motion"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup
                                        label="Tech Events Attended"
                                        name="events_attended"
                                        value={formData.events_attended}
                                        onChange={handleChange}
                                        type="textarea"
                                        placeholder="React Conf, Local Meetups"
                                    />
                                    <InputGroup
                                        label="Tech Events Spoken At"
                                        name="events_spoken_at"
                                        value={formData.events_spoken_at}
                                        onChange={handleChange}
                                        type="textarea"
                                        placeholder="Lightning Talk on CSS"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 3 */}
                        <section className="space-y-8">
                            <SectionHeader number="03" title="Journey & Vision" />

                            <div className="space-y-6">
                                <InputGroup
                                    label="Biggest Challenge"
                                    name="challenges"
                                    value={formData.challenges}
                                    onChange={handleChange}
                                    type="textarea"
                                    placeholder="What was the hardest thing you faced this year?"
                                />
                                <InputGroup
                                    label="How You Overcame It"
                                    name="overcome_challenges"
                                    value={formData.overcome_challenges}
                                    onChange={handleChange}
                                    type="textarea"
                                    placeholder="How did you solve it?"
                                />
                                <InputGroup
                                    label="Goals for 2026"
                                    name="goals_2026"
                                    value={formData.goals_2026}
                                    onChange={handleChange}
                                    type="textarea"
                                    placeholder="What's next on your roadmap?"
                                />
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Section 4 */}
                        <section className="space-y-8">
                            <SectionHeader number="04" title="Theme Selection" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['girly', 'neutral', 'hybrid'].map(theme => (
                                    <button
                                        key={theme}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, theme })}
                                        className={`relative p-6 rounded-2xl border transition-all duration-300 ${formData.theme === theme
                                            ? 'border-[#007BFF] bg-[#007BFF]/5 shadow-lg shadow-[#007BFF]/20'
                                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-left space-y-2">
                                            <span className="block capitalize font-medium text-base text-white">
                                                {theme}
                                            </span>
                                            <span className="block text-sm text-gray-400">
                                                {theme === 'girly' && 'Soft pinks and playful vibes'}
                                                {theme === 'neutral' && 'Clean, minimal, professional'}
                                                {theme === 'hybrid' && 'Dark mode and neon accents'}
                                            </span>
                                        </div>
                                        {formData.theme === theme && (
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-[#007BFF] rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Submit Button */}
                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#007BFF] to-[#00FFFF] text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#007BFF]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Generating Your Wrap...' : 'Generate My Wrap'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ number, title }) => (
    <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#007BFF]/20 to-[#00FFFF]/20 border border-[#007BFF]/30">
            <span className="text-sm font-medium text-[#00FFFF]">{number}</span>
        </div>
        <h2 className="text-2xl font-medium text-white">{title}</h2>
    </div>
);

const InputGroup = ({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) => (
    <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
            {label}
        </label>
        {type === 'textarea' ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all duration-300"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/50 transition-all duration-300"
            />
        )}
    </div>
);

export default FormPage;