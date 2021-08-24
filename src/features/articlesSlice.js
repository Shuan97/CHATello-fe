import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkStatus } from "constants/status";

export const fetchArticleByUUID = createAsyncThunk(
  "articles/fetchArticleByUUID",
  ({ articleUUID }, { extra, rejectWithValue }) =>
    extra.API.get(`articles/${articleUUID}`)
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const createArticle = createAsyncThunk(
  "articles/createArticle",
  ({ title, body, categoryUUID }, { extra, rejectWithValue }) =>
    extra.API.post("articles/new", {
      title: title,
      body: body,
      categoryUUID: categoryUUID,
    })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    article: { UUID: null, title: null, body: null },
    requestStatus: {
      article: thunkStatus.DEFAULT,
    },
  },
  extraReducers: {
    // fetchArticleByUUID
    [fetchArticleByUUID.pending]: (state, action) => {
      state.requestStatus.article = action.meta.requestStatus;
    },
    [fetchArticleByUUID.fulfilled]: (state, action) => {
      state.article = action.payload;
      state.requestStatus.article = action.meta.requestStatus;
    },
    [fetchArticleByUUID.rejected]: (state, action) => {
      state.requestStatus.article = action.meta.requestStatus;
    },
    // createArticle
    [createArticle.pending]: (state, action) => {
      state.requestStatus.article = action.meta.requestStatus;
    },
    [createArticle.fulfilled]: (state, action) => {
      // state.article = action.payload;
      state.requestStatus.article = action.meta.requestStatus;
    },
    [createArticle.rejected]: (state, action) => {
      state.requestStatus.article = action.meta.requestStatus;
    },
  },
});

export const selectArticle = (state) => state.articles.article;

export default articlesSlice.reducer;
