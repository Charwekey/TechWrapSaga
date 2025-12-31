// Basic auth utility
export const login = (token, user) => {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
};

export const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
