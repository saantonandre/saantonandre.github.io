import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/reducers";

export const getScheme = () => {
  const themes = ["light", "dark"];
  const storageItem = localStorage.getItem("prefers-color-scheme");
  const isValid = (string: string): string is "light" | "dark" =>
    themes.includes(string);
  const storageScheme =
    storageItem && isValid(storageItem) ? storageItem : null;
  const prefersDarkTheme = !!window.matchMedia("(prefers-color-scheme: dark)")
    .matches;
  return storageScheme ? storageScheme : prefersDarkTheme ? "dark" : "light";
};
const initialState = {
  prefersColorScheme: getScheme() as "light" | "dark",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setColorScheme: (state, { payload }: PayloadAction<"dark" | "light">) => {
      localStorage.setItem("prefers-color-scheme", payload);
      state.prefersColorScheme = payload;
      return state;
    },
  },
});

export const userSelectors = {
  prefersColorScheme: (state: RootState) => state.user.prefersColorScheme,
};

const { actions, reducer } = userSlice;
export { reducer, actions as userActions };
