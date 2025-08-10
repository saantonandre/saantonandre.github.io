import projectsData from "./projects_data.json";

export const requestGetProjects =  async () =>{
  // "https://api.github.com/repos/saantonandre/saantonandre.github.io/contents/projects"
  // "/projects_data.json"
    const data = await fetch(
      "https://api.github.com/repos/saantonandre/saantonandre.github.io/contents/projects"
      )
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            console.log("API responded as expected")
            return data;
          } else {
            console.log("API responded, but unexpectedly")
            return projectsData;
          }
        })
        .catch((e) => {
            console.log("API call gone wrong:\n"+e)
            return projectsData;
        });
        console.log(data)
        return data;
}