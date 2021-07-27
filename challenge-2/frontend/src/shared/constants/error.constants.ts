import { DynamicObject } from '../types/util.types';
import { EErrorTypes } from '../types/error.types';

export const errorMessages: DynamicObject<string, EErrorTypes, true> = {
  [EErrorTypes.UNKNOWN_ERROR]: 'Sorry, an unknown error occurred',
  [EErrorTypes.WEB3_NO_PROVIDER_FOUND]: 'No wallet provider found, try installing metamask',
  [EErrorTypes.NON_ETHEREUM_BROWSER]: 'It seems like your browser doesn\'t support web3, try installing metamask',
  [EErrorTypes.WEB3_ACCESS_REJECTED]: 'User denied access to his wallet',
  [EErrorTypes.WEB3_NOT_INITIALISED]: 'Web3 hasn\'t been initialised',
  [EErrorTypes.WEB3_NO_ACCOUNT_FOUND]: 'No account found in the users wallet',
  [EErrorTypes.WEB3_USER_DECLINED_SIGNING]: 'Signing canceled',
  [EErrorTypes.ABI_INVALID]: 'Provided abi for contract is invalid',
  [EErrorTypes.API_ERROR]: 'Something went wrong'
};
