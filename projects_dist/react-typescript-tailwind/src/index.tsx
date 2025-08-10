import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./store";
import App from "./App";
import "./index.tailwind.css";
import { NotificationsContainer } from "components/notifications/Container";
import { applyTheme } from "hooks/useColorScheme";

const store = configureStore({});
applyTheme(store.getState().user.prefersColorScheme);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <NotificationsContainer />
      <App />
    </BrowserRouter>
  </Provider>
);
