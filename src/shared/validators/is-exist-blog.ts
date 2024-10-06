import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CommandBus } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { FindBlogCommand } from 'src/features/blogs/application/use-cases/find-blog';
import { isValidUUIDv4 } from 'src/utils';

@ValidatorConstraint({ name: 'IsExistBlog', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(@Inject() protected commandBus: CommandBus) {}

  async validate(blogId: string) {
    if (!isValidUUIDv4(blogId)) return false;
    const isExistBlog = await this.commandBus.execute(
      new FindBlogCommand(blogId),
    );
    return !!isExistBlog;
  }

  defaultMessage() {
    return 'blog is not exist';
  }
}
