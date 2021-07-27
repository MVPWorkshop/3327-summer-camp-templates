import { ValidatorsSchema } from 'express-validator/src/middlewares/schema';

// Wrapper for custom validator inside express validator schema
const customValidator = (validateFunction: (input: any) => boolean): ValidatorsSchema['custom'] => {
  return {
    options: input => {
      if (input !== undefined) {
        return validateFunction(input)
      } else {
        return true;
      }
    }
  }
};

// Function which takes array of strings and checks if input is one of the values
export const validateEnum = (enumArray: string[]) => customValidator((input) => {
  return enumArray.includes(input);
});

// Function which takes a map and checks if all elements of array included in the map
export const validateEnumList = (enumArray: string[]) => customValidator((input) => {
  let isValid = true;

  const enumMap = new Map<string, boolean>();

  enumArray.forEach(enumValue => {
    enumMap.set(enumValue, true);
  });

  (input as string[]).forEach(element => {
    if (typeof element === 'string') {
      // If enum not present in the map mark as false
      if (!enumMap.get(element)) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
  });

  return isValid;
});
