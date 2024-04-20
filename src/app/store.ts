import { applyMiddleware, combineReducers, createStore } from "redux";
import { chatReducer } from "../chat-reducer";
import { thunk } from "redux-thunk";

let rootState = combineReducers({
  chat: chatReducer,
});
export type AppRootState = ReturnType<typeof rootState>;

//@ts-ignore
export const store = createStore(rootState, applyMiddleware(thunk));
