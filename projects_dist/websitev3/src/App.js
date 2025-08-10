import Header from "./header/Header";
import Body from "./body/Body";
import Wip from "./components/Wip";
import Footer from "./footer/Footer";
// import Background from "./background/background";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import GamesPage from "./pages/games/GamesPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import SocialPage from "./pages/social/SocialPage";
import AboutPage from "./pages/about/AboutPage";
import Player from "./pages/player/Player";
import NotFound from "./pages/NotFound.js";

const App = () => {
  return ( 
    <div className="d-flex flex-column justify-content-between w-100 min-vh-100 background moving-bg">
      <Router>
        <Header />
        <Routes>
          <Route index element={<Navigate replace to="games" />} />
          <Route path="/" element={<Body />}>
            <Route path="player/:game" element={<Player />} />
            <Route path="games" element={<GamesPage />}>
              <Route path=":game" element={<GamesPage />} />
            </Route>
            <Route path="about" element={<AboutPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Wip/>
        <Footer />
      </Router>
    </div>
  );
};
/*

    <div className="d-flex flex-column justify-content-between w-100 min-vh-100">


      <Background/>
      <Header/>
      <Body/>
      <Footer/>
    </div>
*/
export default App;
