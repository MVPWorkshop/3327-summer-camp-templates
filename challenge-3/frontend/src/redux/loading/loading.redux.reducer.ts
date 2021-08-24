/**
 * This reducer is used for controlling loading state of the specific action or bach of actions
 */
import { RootState } from '../redux.types'
import { AnyAction, Reducer } from 'redux'
import { DynamicObject } from '../../shared/types/util.types';

export type LoadingState = DynamicObject<boolean>;

const initialState: LoadingState = {
};

export const loadingReduxReducer: Reducer<LoadingState, AnyAction> = (state = initialState, action) => {
  const { type } = action;
  const matches = /(.*)_(REQUEST|SUCCESS|ERROR)/.exec(type);
  // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
  if (!matches) {
    return {
      ...state
    }
  }

  const requestName = matches[1];
  const requestState = matches[2];

  return {
    ...state,
    // Store whether a request is happening at the moment or not
    // e.g. will be true when receiving SOME_ACTION_REQUEST
    //      and false when receiving SOME_ACTION_SUCCESS / SOME_ACTION_FAILURE
    [requestName]: requestState === 'REQUEST'
  }
};

export const createLoadingSelector = (actions: string[]) => (state: RootState) => {
  return actions.some((requestName) => {
    return state.loading[requestName]
  })
};

export default loadingReduxReducer;
