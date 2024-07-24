import { Inject } from '@nestjs/common';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QueryParams } from 'src/shared/common-types';

export class FindBlogsCommand {
  constructor(public params: QueryParams) {}
}

@CommandHandler(FindBlogsCommand)
export class FindBlogsHandler implements ICommandHandler<FindBlogsCommand> {
  constructor(@Inject() protected blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ params }: FindBlogsCommand) {
    return await this.blogsQueryRepository.findAll(params);
  }
}
