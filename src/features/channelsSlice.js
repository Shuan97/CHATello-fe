import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkStatus } from "constants/status";

export const fetchTextChannels = createAsyncThunk(
  "channels/fetchAllChannels",
  (_, { extra, rejectWithValue }) =>
    extra.API.get("channels")
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);
export const createChannel = createAsyncThunk(
  "channels/createChannel",
  ({ name }, { extra, rejectWithValue }) =>
    extra.API.post("channels/new", {
      name: name,
    })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    channelUUID: null,
    channelName: null,
    textChannels: [],
    requestStatus: {
      textChannels: thunkStatus.DEFAULT,
    },
  },
  reducers: {
    setChannelInfo: (state, action) => {
      state.channelUUID = action.payload.channelUUID;
      state.channelName = action.payload.channelName;
    },
  },
  extraReducers: {
    // fetchTextChannels
    [fetchTextChannels.pending]: (state, action) => {
      state.requestStatus.textChannels = action.meta.requestStatus;
    },
    [fetchTextChannels.fulfilled]: (state, action) => {
      state.textChannels = action.payload;
      state.requestStatus.textChannels = action.meta.requestStatus;
    },
    [fetchTextChannels.rejected]: (state, action) => {
      state.requestStatus.textChannels = action.meta.requestStatus;
    },
    // createChannel
    [createChannel.pending]: (state, action) => {
      state.requestStatus.textChannels = action.meta.requestStatus;
    },
    [createChannel.fulfilled]: (state, action) => {
      state.textChannels.push(action.payload);
      state.requestStatus.textChannels = action.meta.requestStatus;
    },
    [createChannel.rejected]: (state, action) => {
      state.requestStatus.textChannels = action.meta.requestStatus;
    },
  },
});

export const { setChannelInfo } = channelsSlice.actions;

export const selectChannelUUID = (state) => state.channels.channelUUID;
export const selectChannelName = (state) => state.channels.channelName;
export const selectTextChannels = (state) => {
  let x = state.channels?.textChannels;
  return x.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
};

export default channelsSlice.reducer;
