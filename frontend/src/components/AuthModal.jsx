import React, { useState } from 'react';
import axios from 'axios';
import { login } from '../utils/auth';
import { X, Eye, EyeOff } from 'lucide-react';

const AuthModal = ({ onClose, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', title: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const url = isLogin
            ? 'http://localhost:5000/api/auth/login'
            : 'http://localhost:5000/api/auth/signup';

        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            const res = await axios.post(url, payload);

            login(res.data.token, res.data.user);
            onSuccess(res.data.user);
        } catch (err) {
            console.error('Auth Error:', err);
            const errorMsg = err.response?.data?.msg || err.response?.data || 'An error occurred';
            setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(44, 44, 44, 0.85)', backdropFilter: 'blur(8px)' }}>
            <div
                className="w-full max-w-md rounded-2xl relative shadow-2xl"
                style={{
                    backgroundColor: '#2C2C2C',
                    border: '1px solid rgba(0, 123, 255, 0.2)',
                    animation: 'fadeInScale 0.3s ease-out'
                }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-lg transition-all"
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
                    <X size={20} strokeWidth={2} />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-semibold mb-2 tracking-tight" style={{ color: '#F5F5F5' }}>
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h2>

                    <p className="text-sm mb-8" style={{ color: '#EAEAEA' }}>
                        {isLogin ? 'Enter your credentials to continue' : 'Get started with your new account'}
                    </p>

                    {error && (
                        <div
                            className="mb-6 p-4 rounded-lg text-sm"
                            style={{
                                backgroundColor: 'rgba(255, 57, 20, 0.1)',
                                border: '1px solid rgba(255, 57, 20, 0.3)',
                                color: '#FF9E8A'
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg px-4 py-3 text-sm transition-all outline-none"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#F5F5F5'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#007BFF';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
                                        Role <span style={{ color: '#EAEAEA' }}>(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Frontend Developer"
                                        onChange={handleChange}
                                        className="w-full rounded-lg px-4 py-3 text-sm transition-all outline-none"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#F5F5F5'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#007BFF';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg px-4 py-3 text-sm transition-all outline-none"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#F5F5F5'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#007BFF';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg px-4 py-3 pr-11 text-sm transition-all outline-none"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#F5F5F5'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#007BFF';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                                    style={{ color: '#EAEAEA' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#F5F5F5'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#EAEAEA'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-medium text-sm transition-all mt-8"
                            style={{
                                background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #007BFF 0%, #00FFFF 100%)',
                                color: '#FFFFFF',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: loading ? 'none' : '0 4px 15px rgba(0, 123, 255, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
                                }
                            }}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <p className="text-center text-sm" style={{ color: '#EAEAEA' }}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-medium ml-1 transition-colors"
                                style={{ color: '#00FFFF' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#007BFF'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#00FFFF'}
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default AuthModal;