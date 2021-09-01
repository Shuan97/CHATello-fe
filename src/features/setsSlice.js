import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkStatus } from "constants/status";

export const fetchAllSets = createAsyncThunk(
  "sets/fetchAllSets",
  ({ categoryUUID }, { extra, rejectWithValue }) =>
    extra.API.get(`sets`, {
      params: { categoryUUID },
    })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const fetchSetByUUID = createAsyncThunk(
  "sets/fetchSetByUUID",
  ({ setUUID }, { extra, rejectWithValue }) =>
    extra.API.get(`sets/${setUUID}`)
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

// export const fetchSetsByCategory = createAsyncThunk(
//   "sets/fetchSetsByCategory",
//   ({ categoryUUID }, { extra, rejectWithValue }) =>
//     extra.API.get(`sets/by-category/${categoryUUID}`)
//       .then((response) => response.data)
//       .catch((error) => rejectWithValue(error.response.data))
// );

export const createSet = createAsyncThunk(
  "sets/createSet",
  ({ name, description, categoryUUID }, { extra, rejectWithValue }) =>
    extra.API.post("sets/new", {
      name: name,
      description: description,
      categoryUUID: categoryUUID,
    })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const createQuestion = createAsyncThunk(
  "sets/createQuestion",
  (
    {
      questionText,
      description = null,
      setUUID,
      positiveOption,
      negativeOption_1,
      negativeOption_2,
      negativeOption_3,
    },
    { extra, rejectWithValue }
  ) =>
    extra.API.post("questions/new", {
      questionText: questionText,
      description: description,
      setUUID: setUUID,
    })
      .then((response) => {
        console.log(response.data.UUID);
        extra.API.post("options/new", {
          optionText: positiveOption,
          type: null,
          isPositive: true,
          questionUUID: response.data.UUID,
        })
          .then((response) => {
            return response.data;
          })
          .catch((error) => rejectWithValue(error.response.data));
        extra.API.post("options/new", {
          optionText: negativeOption_1,
          type: null,
          isPositive: false,
          questionUUID: response.data.UUID,
        })
          .then((response) => {
            return response.data;
          })
          .catch((error) => rejectWithValue(error.response.data));
        extra.API.post("options/new", {
          optionText: negativeOption_2,
          type: null,
          isPositive: false,
          questionUUID: response.data.UUID,
        })
          .then((response) => {
            return response.data;
          })
          .catch((error) => rejectWithValue(error.response.data));
        extra.API.post("options/new", {
          optionText: negativeOption_3,
          type: null,
          isPositive: false,
          questionUUID: response.data.UUID,
        })
          .then((response) => {
            return response.data;
          })
          .catch((error) => rejectWithValue(error.response.data));
        return response.data;
      })
      .catch((error) => rejectWithValue(error.response.data))
);

export const setsSlice = createSlice({
  name: "sets",
  initialState: {
    set: { UUID: null, name: null, description: null, questions: [] },
    sets: [],
    requestStatus: {
      set: thunkStatus.DEFAULT,
      sets: thunkStatus.DEFAULT,
      question: thunkStatus.DEFAULT,
    },
  },
  extraReducers: {
    // fetchAllSets
    [fetchAllSets.pending]: (state, action) => {
      state.requestStatus.sets = action.meta.requestStatus;
    },
    [fetchAllSets.fulfilled]: (state, action) => {
      state.sets = action.payload;
      state.requestStatus.sets = action.meta.requestStatus;
    },
    [fetchAllSets.rejected]: (state, action) => {
      state.requestStatus.sets = action.meta.requestStatus;
    },
    // fetchSetByUUID
    [fetchSetByUUID.pending]: (state, action) => {
      state.requestStatus.set = action.meta.requestStatus;
    },
    [fetchSetByUUID.fulfilled]: (state, action) => {
      state.set = action.payload;
      state.requestStatus.set = action.meta.requestStatus;
    },
    [fetchSetByUUID.rejected]: (state, action) => {
      state.requestStatus.set = action.meta.requestStatus;
    },
    // createSet
    [createSet.pending]: (state, action) => {
      state.requestStatus.set = action.meta.requestStatus;
    },
    [createSet.fulfilled]: (state, action) => {
      // state.set = action.payload;
      state.requestStatus.set = action.meta.requestStatus;
    },
    [createSet.rejected]: (state, action) => {
      state.requestStatus.set = action.meta.requestStatus;
    },
    // createQuestion
    [createQuestion.pending]: (state, action) => {
      state.requestStatus.question = action.meta.requestStatus;
    },
    [createQuestion.fulfilled]: (state, action) => {
      // state.question = action.payload;
      state.requestStatus.question = action.meta.requestStatus;
    },
    [createQuestion.rejected]: (state, action) => {
      state.requestStatus.question = action.meta.requestStatus;
    },
  },
});

export const selectSet = (state) => state.sets.set;
export const selectAllSets = (state) => state.sets.sets;

export default setsSlice.reducer;
