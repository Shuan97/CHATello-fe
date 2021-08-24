import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkStatus } from "constants/status";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  (_, { extra, rejectWithValue }) =>
    extra.API.get("categories")
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const fetchCategoryByUUID = createAsyncThunk(
  "categories/fetchCategoryByUUID",
  ({ categoryUUID }, { extra, rejectWithValue }) =>
    extra.API.get(`categories/${categoryUUID}`)
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  ({ name, description, image }, { extra, rejectWithValue }) =>
    extra.API.post("categories/new", {
      name: name,
      description: description,
      image: image,
    })
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data))
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    selectedCategory: { UUID: null, name: null },
    category: { UUID: null, name: null, description: null, articles: [] },
    categories: [],
    requestStatus: {
      category: thunkStatus.DEFAULT,
      categories: thunkStatus.DEFAULT,
    },
  },
  reducers: {
    setCategoryInfo: (state, action) => {
      state.selectedCategory = action.payload.selectedCategory;
    },
  },
  extraReducers: {
    // fetchCategories
    [fetchCategories.pending]: (state, action) => {
      state.requestStatus.categories = action.meta.requestStatus;
    },
    [fetchCategories.fulfilled]: (state, action) => {
      state.categories = action.payload;
      state.requestStatus.categories = action.meta.requestStatus;
    },
    [fetchCategories.rejected]: (state, action) => {
      state.requestStatus.categories = action.meta.requestStatus;
    },
    // fetchCategoryByUUID
    [fetchCategoryByUUID.pending]: (state, action) => {
      state.requestStatus.category = action.meta.requestStatus;
    },
    [fetchCategoryByUUID.fulfilled]: (state, action) => {
      state.category = action.payload;
      state.requestStatus.category = action.meta.requestStatus;
    },
    [fetchCategoryByUUID.rejected]: (state, action) => {
      state.requestStatus.category = action.meta.requestStatus;
    },
    // createCategory
    [createCategory.pending]: (state, action) => {
      state.requestStatus.categories = action.meta.requestStatus;
    },
    [createCategory.fulfilled]: (state, action) => {
      state.categories.push(action.payload);
      state.requestStatus.categories = action.meta.requestStatus;
    },
    [createCategory.rejected]: (state, action) => {
      state.requestStatus.categories = action.meta.requestStatus;
    },
  },
});

export const { setCategoryInfo } = categoriesSlice.actions;

export const selectSelectedCategory = (state) =>
  state.categories.selectedCategory;
export const selectCategoryWithArticles = (state) => state.categories.category;
export const selectCategories = (state) => state.categories?.categories;
// export const selectCategories = (state) => {
//   let x = state.categories?.categories;
//   return x.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
// };

export default categoriesSlice.reducer;
