
import { useDispatch, useSelector } from "react-redux";
import {  userActions, userSelectors } from "store/slices/user";

export const applyTheme = (scheme: "light" | "dark") => {
  const body = document.querySelector("body");
  if (!body) {
    // console.log("HTML body hasn't been found");
    return;
  }
  scheme === "light"
    ? body.classList.remove("dark")
    : body.classList.add("dark");
};
export const useColorScheme = () => {
  const colorScheme = useSelector(userSelectors.prefersColorScheme);
  const dispatch = useDispatch();
  const schemeSetter = (scheme: "light" | "dark") => {
    dispatch(userActions.setColorScheme(scheme));
    applyTheme(scheme);
  };
  return [colorScheme, schemeSetter] as const;
};

export default useColorScheme;
