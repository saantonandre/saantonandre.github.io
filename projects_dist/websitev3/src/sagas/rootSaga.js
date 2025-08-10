import {takeLatest } from "redux-saga/effects";
import { handleGetProjects} from "./handlers/projectsHandler"
import {getProjects} from "../redux/slices/projectsSlice";

export function* watcherSaga(){
    yield takeLatest(getProjects.type, handleGetProjects)
}