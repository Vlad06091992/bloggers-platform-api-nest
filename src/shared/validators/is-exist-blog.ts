import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { Blog } from 'src/features/blogs/domain/blogs-schema';
import { CommandBus } from '@nestjs/cqrs';
import { FindBlogsCommand } from 'src/features/blogs/application/use-cases/find-blogs';
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

  defaultMessage(args: ValidationArguments) {
    return 'blog is not exist';
  }
}
