

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  isAdmin: false,
  isSuperAdmin: false,
 isAuthenticated: false,
  user: {
    user_id: null,
    fullname: null,
    email: null,
    phone: null,
    profileImage: null,
    likedByCurrentUser: false,
    
  },
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, role, isAdmin, isSuperAdmin } = action.payload;

      state.token = token;
      state.role = role || null;
      state.isAdmin = isAdmin || false;
      state.isSuperAdmin = isSuperAdmin || false;
      state.isAuthenticated = true;
      state.user = {
        user_id: user.user_id || null,
        fullname: user.fullname || null,
        email: user.email || null,
        phone: user.phone || null,
        profileImage: user.profileImage || user.profileimage || null,
        likedByCurrentUser: user.likedByCurrentUser || false,
       
      };
    },

    updateUserProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
        profileImage:
          action.payload.profileImage ||
          action.payload.profileimage ||
          state.user.profileImage,
        likedByCurrentUser:
          action.payload.likedByCurrentUser ?? state.user.likedByCurrentUser,
      };
    },

    logout: (state) => {
      state.token = null;
      state.isAdmin = false;
      state.isSuperAdmin = false;
      state.role = null;
       state.isAuthenticated= false,
      state.user = {
        user_id: null,
        fullname: null,
        email: null,
        phone: null,
        profileImage: null,
        likedByCurrentUser: false,
       
      };
    },
  },
});

export const { setCredentials, updateUserProfile, logout } = userSlice.actions;
export default userSlice.reducer;
