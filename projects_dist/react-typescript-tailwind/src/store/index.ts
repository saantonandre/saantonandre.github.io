import { applyMiddleware } from "redux"
import createSagaMiddleware from "redux-saga"
import runAllSagas from "./sagas"
import { configureStore as toolkitConfigureStore } from "@reduxjs/toolkit"
import { rootReducer } from "./reducers"


export const configureStore = (preloadedState: any) => {

  const sagaMiddleware = createSagaMiddleware()
  const middlewares: any = [sagaMiddleware]

  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]


  const store = toolkitConfigureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
    enhancers: enhancers,
  })
  sagaMiddleware.run(runAllSagas);
  

  return store
}