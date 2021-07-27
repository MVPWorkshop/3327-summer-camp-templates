import { EErrorTypes } from '../types/error.types';
import { errorMessages } from '../constants/error.constants';

class BaseError extends Error {
  public type: EErrorTypes;

  constructor(errorType: EErrorTypes, message?: string) {
    super(message);

    this.type = errorType;
    this.message = message || errorMessages[errorType];
  }
}

export class UnknownError extends BaseError {
  constructor() {
    super(EErrorTypes.UNKNOWN_ERROR);
  }

}

export class NonEthereumBrowserError extends BaseError {
  constructor() {
    super(EErrorTypes.NON_ETHEREUM_BROWSER);
  }
}

export class Web3AccessRejected extends BaseError {
  constructor() {
    super(EErrorTypes.WEB3_ACCESS_REJECTED);
  }
}

export class Web3NotInitialised extends BaseError {
  constructor() {
    super(EErrorTypes.WEB3_NOT_INITIALISED);
  }
}

export class Web3NoAccountFound extends BaseError {
  constructor() {
    super(EErrorTypes.WEB3_NO_ACCOUNT_FOUND)
  }
}

export class AbiInvalid extends BaseError {
  constructor() {
    super(EErrorTypes.ABI_INVALID);
  }
}

export class Web3NoProviderFound extends BaseError {
  constructor() {
    super(EErrorTypes.WEB3_NO_PROVIDER_FOUND);
  }
}
export class Web3UserDeclinedSigning extends BaseError {
  constructor() {
    super(EErrorTypes.WEB3_USER_DECLINED_SIGNING);
  }
}

export class APIError extends BaseError {
  constructor(message?: string) {
    super(EErrorTypes.API_ERROR, message);
  }
}
