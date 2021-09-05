import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChannelTypeEnum } from "constants/enums";
import { thunkStatus } from "constants/status";

export const fetchTextChannels = createAsyncThunk(
  "channels/fetchTextChannels",
  (_, { extra, rejectWithValue }) =>
    extra.API.get("channels")
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);
export const createChannel = createAsyncThunk(
  "channels/createChannel",
  ({ name, type }, { extra, rejectWithValue }) =>
    extra.API.post("channels/new", {
      name: name,
      type: type,
    })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    channelUUID: null,
    channelName: null,
    currentChannel: {},
    textChannels: [],
    voiceChannels: [],
    requestStatus: {
      textChannels: thunkStatus.DEFAULT,
      voiceChannels: thunkStatus.DEFAULT,
    },
  },
  reducers: {
    setChannelInfo: (state, action) => {
      const { UUID, name, type } = action.payload;
      state.currentChannel = { UUID, name, type };
    },
    setChannelParticipants: (state, action) => {
      const { participants } = action.payload;
      state.voiceChannels.forEach((channel) => {
        channel.participants = participants.filter(
          (participant) => channel.UUID === participant.channelUUID
        );
      });
    },
  },
  extraReducers: {
    // fetchTextChannels
    [fetchTextChannels.pending]: (state, action) => {
      state.requestStatus.textChannels = action.meta.requestStatus;
      state.requestStatus.voiceChannels = action.meta.requestStatus;
    },
    [fetchTextChannels.fulfilled]: (state, action) => {
      const data = action.payload;
      state.textChannels = data.filter(
        (channel) => channel.type === ChannelTypeEnum.TEXT
      );
      state.voiceChannels = data.filter(
        (channel) => channel.type === ChannelTypeEnum.VOICE
      );
      state.requestStatus.textChannels = action.meta.requestStatus;
      state.requestStatus.voiceChannels = action.meta.requestStatus;
    },
    [fetchTextChannels.rejected]: (state, action) => {
      state.requestStatus.textChannels = action.meta.requestStatus;
      state.requestStatus.voiceChannels = action.meta.requestStatus;
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

export const { setChannelInfo, setChannelParticipants } = channelsSlice.actions;

export const selectCurrentChannel = (state) => state.channels.currentChannel;
export const selectTextChannels = (state) => {
  let x = state.channels?.textChannels;
  return x.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
};
export const selectVoiceChannels = (state) => {
  let x = state.channels?.voiceChannels;
  return x.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
};

export default channelsSlice.reducer;
