import { Module } from '@nestjs/common';
import { TestingController } from 'src/features/testing/testing.controller';
import { TestingService } from 'src/features/testing/testing.service';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/features/users/domain/user-schema';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
  ],
  controllers: [TestingController],
  providers: [TestingService, UsersRepository, CommentsRepository],
})
export class TestModule {}
