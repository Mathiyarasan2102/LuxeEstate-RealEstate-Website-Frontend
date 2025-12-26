import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        if (user === 'undefined') return null;
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};

const initialState = {
    user: getUserFromStorage(),
    token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
