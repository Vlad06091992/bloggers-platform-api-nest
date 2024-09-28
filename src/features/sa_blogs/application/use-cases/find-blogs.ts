import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequiredParamsValuesForBlogs } from 'src/shared/common-types';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';

export class FindBlogsCommand {
  constructor(public params: RequiredParamsValuesForBlogs) {}
}

@CommandHandler(FindBlogsCommand)
export class FindBlogsHandler implements ICommandHandler<FindBlogsCommand> {
  constructor(@Inject() protected blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ params }: FindBlogsCommand) {
    return await this.blogsQueryRepository.findAll(params);
  }
}
