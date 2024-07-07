import { BadRequestException } from '@nestjs/common';

export const exceptionFactory = (errors) => {

  const errorForResponse: { message: string; field: string }[] = [];
  errors.forEach((el) => {
    const constraintsKeys = Object.keys(el.constraints);
    constraintsKeys.forEach((ckey) => {
      errorForResponse.push({
        message: el.constraints[ckey],
        field: el.property,
      });
    });
  });

  throw new BadRequestException(errorForResponse);
};
