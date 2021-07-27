import {ThunkAction} from 'redux-thunk';
import {Action} from "redux";
import rootReducer from "./reducer";

export type RootState = ReturnType<typeof rootReducer>;

export type Thunk<R> = ThunkAction<R, RootState, undefined, Action>;

export interface ReduxAction<Type extends string, Payload extends object> extends Action<Type> {
  payload: Payload
}
