import { call, put } from "redux-saga/effects";
import { setProjects, setFetched } from "../../redux/slices/projectsSlice";
import { requestGetProjects } from "../requests/projectsRequests";

export function* handleGetProjects(action) {
  try {
    yield put(setFetched(true));
    // Fetching data
    const response = yield call(requestGetProjects);
    // Setting data
    yield put(setProjects([...response]));
  } catch (error) {
    console.log(error);
  }
}
