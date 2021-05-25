import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history, { pushHistoryAsync } from "utils/history";
import { showToast } from "utils/toast";

export const authUser = createAsyncThunk(
  "user/authUser",
  ({ email, password }, { extra, rejectWithValue }) =>
    extra.API.post("auth/login", {
      email: email,
      password: password,
    })
      .then((response) => response?.data)
      .catch((error) => rejectWithValue(error.response?.data))
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  (_, { extra, rejectWithValue, dispatch }) =>
    extra.API.get("auth/profile")
      .then((response) => {
        showToast("Successfully logged in!");
        return response.data;
      })
      .catch((error) => {
        dispatch(logout());
        return rejectWithValue(error.response.data);
      })
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    token: null,
    requestStatus: {
      data: {},
      token: {},
    },
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      state.token = null;
      localStorage.removeItem("token");
      history.push("/login");
    },
    setToken: (state) => {
      state.token = localStorage.getItem("token") || null;
    },
  },
  extraReducers: {
    // authUser
    [authUser.pending]: (state, action) => {
      state.requestStatus.token = action.meta.requestStatus;
    },
    [authUser.fulfilled]: (state, action) => {
      const { token } = action.payload;
      localStorage.setItem("token", token);
      state.token = token;
      state.requestStatus.token = action.meta.requestStatus;
    },
    [authUser.rejected]: (state, action) => {
      localStorage.removeItem("token");
      state.token = null;
      state.requestStatus.token = action.meta.requestStatus;
    },

    // fetchUserProfile
    [fetchUserProfile.pending]: (state, action) => {
      state.requestStatus.data = action.meta.requestStatus;
    },
    [fetchUserProfile.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.requestStatus.data = action.meta.requestStatus;
      pushHistoryAsync("/");
    },
    [fetchUserProfile.rejected]: (state, action) => {
      state.requestStatus.data = action.meta.requestStatus;
    },
  },
});

export const { login, logout, setToken } = userSlice.actions;

export const selectUser = (state) => state.user.data;
export const selectToken = (state) => state.user.token;

export default userSlice.reducer;
