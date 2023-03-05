import { registerDecorator, ValidationOptions } from 'class-validator';
import * as moment from 'moment-timezone';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from '../constants';

export const IsDateWithoutTime = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateWithoutTime',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `Date must be in format ${DEFAULT_DATE_FORMAT}`,
        ...validationOptions,
      },
      validator: {
        validate(value: Date) {
          const validateDate = moment(value, DEFAULT_DATE_FORMAT);
          return validateDate.isValid();
        },
      },
    });
  };
};

export const IsTime = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTime',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `Time must be in format ${DEFAULT_TIME_FORMAT}`,
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          if (!/^((0[1-9])|(1[0-9])|2[0-3])(:[0-5][0-9]){2}$/.test(value)) {
            return false;
          }
          const validateTime = moment(value, DEFAULT_TIME_FORMAT);
          return validateTime.isValid();
        },
      },
    });
  };
};
