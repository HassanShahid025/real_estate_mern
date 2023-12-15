import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  currentUser: {
    username: string;
    email: string;
    _id: string;
    avatar: string;
    [key: string]: unknown; 
  } | null,
  error: null | string,
  loading: boolean,
};


const initialState:initialStateType = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart : (state) => {
      state.loading = true;
    },
    updateUserSuccess : (state, action) => {
      state.currentUser = action.payload
      state.loading = false;
      state.error = null
    },
    updateUserFailure : (state,action) => {
      state.loading = false;
      state.error = action.payload
    }
  },
});

export const { signInFailure, signInStart, signInSuccess,updateUserStart,updateUserSuccess,updateUserFailure } = userSlice.actions;

export default userSlice.reducer;
