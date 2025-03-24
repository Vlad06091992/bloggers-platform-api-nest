import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostsEntity } from 'src/features/posts/entity/posts.entity';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions.entity';
import { UsersEntity } from 'src/features/users/entities/users.entity';

export class PostsReactionsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostsReactions)
    protected postsReactionsRepository: Repository<PostsReactions>,
    @InjectRepository(PostsEntity)
    protected postsRepository: Repository<PostsEntity>,
  ) {}

  async getLikeRecord(userId: string | null, postId: string) {
    const res = await this.postsReactionsRepository
      .createQueryBuilder('pr')
      .select('pr')
      .where('pr.user = :userId', { userId })
      .andWhere('pr.post = :postId', { postId })
      .getOne();
    return res;
  }

  async getNewestLikes() {
    const res = await this.postsRepository
      .createQueryBuilder('p')
      .select()
      // .select([])
      .addSelect((qb1) =>
        qb1
          .select(
            `jsonb_agg(json_build_object('login', prs."login", 'userId', prs."userId", 'addedAt', prs."addedAt")) as newestLikes`,
          )
          .from((qb2) => {
            return qb2
              .select('*')
              .addSelect((qb3) => {
                return qb3
                  .select('u.login')
                  .from(UsersEntity, 'u')
                  .where('pr.userId = u.id');
              }, 'login')
              .from(PostsReactions, 'pr')
              .where('p.id = pr.postId')
              .andWhere(`pr.likeStatus = 'Like'`)
              .orderBy('pr.addedAt', 'DESC')
              .limit(3);
          }, 'prs'),
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostsReactions" WHERE "likeStatus" ='Like' AND "postId" = "p"."id" )`,
        'likesCount',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostsReactions" WHERE "likeStatus" ='Dislike' AND "postId" = "p"."id" )`,
        'dislikesCount',
      )
      // .addSelect(
      //   `(SELECT pr."likeStatus" as "myStatus" FROM "PostsReactions" WHERE "likeStatus" ='Dislike' AND "postId" = "p"."id"
      //    AND pr."userId" ='${userId}' )`,
      //   'dislikesCount',
      // )
      .getRawMany();

    //  ;
    return res;
  }

  async getLikesInfoForPosts(postId: string, userId: string | null) {
    //  ;

    const result = await this.postsRepository
      .createQueryBuilder('p')
      .select('p.id')
      .addSelect((qb) => {
        return qb
          .select('COUNT(*)')
          .from(PostsReactions, 'pr') // from(entity class, alias)
          .where("pr.likeStatus = 'Like'")
          .andWhere('p.id = pr.postId');
      }, 'likesCount') // указываем, что это поле likesCount
      .addSelect((qb) => {
        return qb
          .select('COUNT(*)')
          .from(PostsReactions, 'prs') // from(entity class, alias)
          .where("prs.likeStatus = 'Dislike'")
          .andWhere('p.id = prs.postId');
      }, 'dislikesCount'); // указываем, что это поле likesCount

    if (userId) {
      result.addSelect((qb) => {
        const res = qb.select('prss.likeStatus').from(PostsReactions, 'prss'); // from(entity class, alias)

        res.where(`prss.user = '${userId}'`);

        return res;
      }, 'myStatus'); // указываем, что это поле likesCount
    }

    const resp = await result.getMany();
    //  ;
    return resp;
  }

  async getLikesCount(postId: string) {
    const query = `
    SELECT count(*)
    FROM public."PostsReactions"
    WHERE "postId" = $1 AND "likeStatus" = 'Like'`;
    return await this.dataSource.query(query, [postId]);
  }

  async getDislikesCount(postId: string) {
    const query = `
    SELECT count(*)
    FROM public."PostsReactions"
    WHERE "postId" = $1 AND "likeStatus" = 'Dislike'`;
    return await this.dataSource.query(query, [postId]);
  }
}
