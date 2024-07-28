import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidLikeStatus(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidLikeStatus',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value === 'None' || value === 'Like' || value === 'Dislike';
        },
        defaultMessage(args: ValidationArguments) {
          return 'likes value should be equal None|Like|Dislike';
        },
      },
    });
  };
}
