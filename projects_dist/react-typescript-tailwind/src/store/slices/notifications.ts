import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/reducers";
import { PostNotification, ToastNotification } from "types/notifications";

const initialState = {
  toasts: [] as ToastNotification[],
  posts: [] as PostNotification[],
};
export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addToast: (
      state,
      { payload }: PayloadAction<Omit<ToastNotification, "id">>
    ) => {
      state.toasts.push({
        ...payload,
        id: crypto.randomUUID?.() || ((Math.random() * 100000) | 0).toString(),
      });
      return state;
    },
    removeToast: (state, { payload }: PayloadAction<string>) => {
      state.toasts.splice(
        state.toasts.findIndex((t) => t.id === payload),
        1
      );
      return state;
    },
    addPost: (
      state,
      { payload }: PayloadAction<Omit<PostNotification, "id">>
    ) => {
      state.posts.push({
        ...payload,
        id: crypto.randomUUID?.() || ((Math.random() * 100000) | 0).toString(),
      });
      return state;
    },
    removePost: (state, { payload }: PayloadAction<string>) => {
      state.posts.splice(
        state.toasts.findIndex((t) => t.id === payload),
        1
      );
      return state;
    },
    removeAllPosts: (state) => {
      state.posts = [];
      return state;
    },
  },
});

export const notificationsSelectors = {
  toasts: (state: RootState) => state.notifications.toasts,
  posts: (state: RootState) => state.notifications.posts,
};

const { actions, reducer } = notificationsSlice;
export { reducer, actions as notificationsActions };
