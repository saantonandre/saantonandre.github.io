import { createSlice } from "@reduxjs/toolkit";

export const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    list: [],
    fetched: false
  },
  reducers: {
    getProjects() {},
    setProjects(state, action) {
      return { ...state, list: action.payload };
    },
    setFetched(state, action) {
      return { ...state, fetched: action.payload };
    },
  },
});

export const { getProjects, setProjects, setFetched } = projectsSlice.actions;
export default projectsSlice.reducer;
