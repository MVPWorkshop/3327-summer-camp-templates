import { BigNumber } from 'ethers';

export function tenPower(pow: number): BigNumber {
  const bnPow = BigNumber.from(pow);
  return BigNumber.from(10).pow(bnPow);
}

export function keys<O extends object>(obj: O): (keyof O)[] {
  return Object.keys(obj) as (keyof O)[];
}
