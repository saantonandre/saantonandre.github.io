import PageHeader from "../PageHeader";
import { useSelector, useDispatch } from "react-redux";
import { getProjects } from "../../redux/slices/projectsSlice";
import { useEffect } from "react";
import ProjectsList from "./ProjectsList";
const ProjectsPage = () => {
  const projects = useSelector((state) => state.projects.list);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!projects.length) {
      dispatch(getProjects());
    }
  });

  return (
    <>
      <PageHeader section="projects" />
      <div className="d-block">
        <div className="d-flex flex-row flex-wrap gap-3 p-3">
          {projects === [] && <i className="spinner-border" role="status" />}
          <ProjectsList projects={projects} />
        </div>
      </div>
    </>
  );
};
export default ProjectsPage;
