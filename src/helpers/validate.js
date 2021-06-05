import Validator from 'validatorjs';
import * as c from 'src/constants';
import { isdev } from 'src/config';

const validationsDisabled = false;

const createValidation =
  ({ title, rules, attributeNames } = {}) =>
  (payload) => {
    if (validationsDisabled) {
      return null;
    }

    const result = new Validator(payload, rules);

    if (attributeNames) {
      result.setAttributeNames(attributeNames);
    }

    if (result.passes()) {
      return null;
    } else {
      isdev && console.log(`Validations from ${title}`, result.errors.all());
      return result.errors.all();
    }
  };

export const validateElement = createValidation({
  title: 'element',
  rules: {
    name: 'required',
    type: 'required',
    parentId: 'required',
    format: `required_if:type,${c.file}`,
  },
});

// converter
export const convertValidations = (validations) => {
  try {
    let convertedValidations = {};
    for (const entry in validations) {
      // we get an array in each validation, but only need the
      // first element
      convertedValidations[entry] = validations[entry][0];
    }
    return convertedValidations;
  } catch (err) {
    isdev &&
      console.error(
        'Error occured while converting validations! error => ',
        err,
      );
    return {};
  }
};
