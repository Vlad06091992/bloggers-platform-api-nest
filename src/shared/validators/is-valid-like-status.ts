import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidLikeStatus(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isValidLikeStatus',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return value === 'None' || value === 'Like' || value === 'Dislike';
        },
        defaultMessage() {
          return 'comments-likes value should be equal None|Like|Dislike';
        },
      },
    });
  };
}
