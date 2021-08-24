import { Nullable } from '../types/util.types';

export function classes(...args: Nullable[]) {
  let className = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] && typeof args[i] === 'string') {
      className += args[i] + ' ';
    }
  }

  return className;
}
