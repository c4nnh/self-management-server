import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import * as moment from 'moment-timezone';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from '../constants';

export const IsDateWithoutTime = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateWithoutTime',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be in format ${DEFAULT_DATE_FORMAT}`,
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

export const IsDateAfterOtherField = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateAfterOtherField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: `${propertyName} must be after ${property}`,
        ...validationOptions,
      },
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const [relatedProperty] = args.constraints;
          const relatedValue = moment(args.object[relatedProperty]);
          if (!relatedValue || !relatedValue.isValid()) {
            return false;
          }
          return moment(value).isAfter(relatedValue);
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
        message: `${propertyName} must be in format ${DEFAULT_TIME_FORMAT}`,
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

export const IsTimeBeforeOtherField = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTimeBeforeOtherField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: `${propertyName} must be before ${property}`,
        ...validationOptions,
      },
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedProperty] = args.constraints;
          const relatedValue = moment(
            args.object[relatedProperty],
            DEFAULT_TIME_FORMAT,
          );
          return moment(value, DEFAULT_TIME_FORMAT).isBefore(relatedValue);
        },
      },
    });
  };
};
