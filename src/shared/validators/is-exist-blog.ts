import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CommandBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FindBlogCommand } from 'src/features/blogs/application/use-cases/find-blog';

@ValidatorConstraint({ name: 'IsExistBlog', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(@Inject() protected commandBus: CommandBus) {}

  async validate(blogId: string) {
    const isExistBlog = await this.commandBus.execute(
      new FindBlogCommand(blogId),
    );
    return !!isExistBlog;
  }

  defaultMessage() {
    return 'blog is not exist';
  }
}
