import {
  addHexPrefix,
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  isValidSignature,
  pubToAddress
} from 'ethereumjs-util';
import { AuthorizationError, CustomValidationError, InvalidRequestError } from './errors.util';
import { IWeb3LoginPayload } from '../types/auth.types';
import moment from 'moment';
import { CONFIG } from '../config';

export function verifySignature(payload: IWeb3LoginPayload): void {
  const signedAt = moment.unix(payload.timestamp);
  const diff = moment().diff(signedAt, 'seconds');

  // Signature invalid
  if (diff > +CONFIG.SIGNATURE_EXPIRATION_SEC) {
    throw new AuthorizationError('Signature expired');
  }
}

export function getSignatureParams(payload: string, signature: string) {
  const signatureParams = fromRpcSig(signature);

  // If not a valid signature on homestead or later hard fork throw new error
  if (!isValidSignature(signatureParams.v, signatureParams.r, signatureParams.s, true)) {
    throw new InvalidRequestError('Invalid signature');
  }

  // Hash the payload that was signed
  const payloadHash = hashPersonalMessage(Buffer.from(payload));
  // Extract the public key using the hash and the signature
  const pubKey: Buffer = ecrecover(payloadHash, signatureParams.v, signatureParams.r, signatureParams.s);
  // Getting the address using the public key
  const address: string = addHexPrefix(pubToAddress(pubKey).toString('hex'));

  return {
    pubKey,
    address
  }
}

export interface IDeserializedPayload {
  parsed: IWeb3LoginPayload,
  string: string
}

export function deserializeWeb3Payload(payload: string): IDeserializedPayload {
  const stringifiedPayload = Buffer.from(payload, 'base64').toString();
  const parsedPayload = JSON.parse(stringifiedPayload);

  return {
   parsed: parsedPayload as IWeb3LoginPayload,
   string: stringifiedPayload
  }
}
