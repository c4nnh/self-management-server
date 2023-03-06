import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const MustAppearWith = (
  otherField: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'mustAppearWith',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [otherField],
      options: {
        message: `${propertyName} and ${otherField} must appear together`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedProperty] = args.constraints;
          const relatedValue = args.object[relatedProperty];
          return (!value && !relatedValue) || (!!value && !!relatedValue);
        },
      },
    });
  };
};
