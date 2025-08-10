const ProjectsList = ({ projects = [] }) => {
  return (
    <>
      {projects.map((project) => {
        return (
          <a
            rel="noreferrer"
            target="_blank"
            href={"/projects/" + project.name}
            style={{ height: "10rem", width: "10rem" }}
            key={`${project.name}-card`}
            role="button"
            className="d-flex justify-content-center align-items-center card bg-fadeblack flex-grow-1"
          >
            <div className="bg-black w-100 fs-5 text-center">
              {project.name}
            </div>
          </a>
        );
      })}
    </>
  );
};
export default ProjectsList;
