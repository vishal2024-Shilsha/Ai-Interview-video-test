// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null, // optional: store user info
  isLoggedIn: false,
  role:"null"
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user,detail } = action.payload;
      state.token = token;
      state.user = user || null;
      state.isLoggedIn = true;
      // state.role=role;
      localStorage.setItem('user',JSON.stringify(detail))
      localStorage.setItem('token',token||null);
      localStorage.setItem('role',user||null)
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
