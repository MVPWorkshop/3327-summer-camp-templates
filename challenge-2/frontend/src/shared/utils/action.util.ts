import { Action } from 'redux';

class ActionUtil {
  public static requestAction<T extends string>(actionType: T): Action<string> {
    return {
      type: `${actionType}_REQUEST`
    }
  }

  public static successAction<T extends string>(actionType: T): Action<string> {
    return {
      type: `${actionType}_SUCCESS`
    }
  }

  public static errorAction<T extends string>(actionType: T): Action<string> {
    return {
      type: `${actionType}_ERROR`
    }
  }
}

export default ActionUtil;
