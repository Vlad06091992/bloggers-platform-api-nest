import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotOnlySpaces(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isNotOnlySpaces',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === 'string' && !/^\s*$/.test(value);
        },
        defaultMessage() {
          return 'String should not consist only of spaces';
        },
      },
    });
  };
}
