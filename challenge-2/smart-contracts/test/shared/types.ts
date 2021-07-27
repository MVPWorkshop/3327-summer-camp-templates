export type DynamicObject<
  Value = any,
  Key extends (string | number | symbol) = string,
  AllKeysRequired = true
  > = AllKeysRequired extends true ?
  { [K in Key]: Value } :
  { [K in Key]?: Value };
