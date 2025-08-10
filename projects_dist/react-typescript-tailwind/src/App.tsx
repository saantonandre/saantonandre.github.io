import Pages from "pages";
import MainLayout from "layouts/Main";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="main" />} />
      <Route path="" element={<MainLayout />}>
        <Route path="main" element={<Pages.Main />} />
      </Route>
    </Routes>
  );
}

export default App;
