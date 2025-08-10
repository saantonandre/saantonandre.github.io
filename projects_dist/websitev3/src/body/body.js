import { useNavigate, useLocation, Outlet } from "react-router-dom";
const Body = () => {
  const category = useLocation().pathname.split("/")[1]
  const sections = ["games", "projects", "social", "about"];
  let navigate = useNavigate();
  const imagesPath = "/images/";
  return (
    <div className="container d-flex flex-column py-5">
      {/* Pages icons */}
      <div className="d-flex overflow-hidden">
        {sections.map((section,i) => {
          return (
            <img
              key={`${section}-fold`}
              alt={`${section} folder icon`}
              role="button"
              className={`position-relative transition folder-icon ${
                category === section ? "top-0" : "top-25"
              }`}
              style={{zIndex:category === section ? 100:sections.length*2-i}}
              src={[
                imagesPath,
                section,
                category === section ? "-fold_active.png" : "-fold.png",
              ].join("")}
              onClick={() => navigate("/" + section)}
            />
          );
        })}
      </div>
      <div className="bg-blackblue bg-opacity-75 text-white p-4">
        {/* Page body */}
        <Outlet />
      </div>
    </div>
  );
};
export default Body;
