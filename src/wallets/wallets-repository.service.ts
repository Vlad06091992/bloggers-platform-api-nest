import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

// type Wallets = { id: string; title: string };
// type Wallets = any[];
// type UsersWithWalletsType = { id: number; lastname: string; wallets: Wallets };
type UsersWithWalletsType = any;

@Injectable()
export class WalletsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }

  async findAll(firstName: string, lastName: string) {
    // return `This action returns all wallets`;
    const query = `
    SELECT w.*, u.*
    FROM public."Wallets" AS w
    LEFT JOIN "Users" AS u
    ON w."ownerId" = u."id"
    WHERE u."FirstName" like $1 AND u."LastName" like $2
      `;

    const queryUsers = `
          SELECT u.*
          FROM "Users" AS u
          LIMIT 2 OFFSET 0`;

    const queryWallets = `SELECT id, title, currency, "ownerId", balance
       FROM public."Wallets" as w
       WHERE w."ownerId" in (1,2)`;

    // const result = await this.dataSource.query(query, [
    //   `%${firstName}%`,
    //   `%${lastName}%`,
    // ]);
    console.log(queryWallets);

    // const result = await this.dataSource.query(queryUsers);
    const result = await this.dataSource.query(queryWallets, []);
    return result;
    return result.map((el) => ({
      id: el.id,
      title: el.title,
      currency: el.currency,
      owner: {
        id: el.ownerId,
        firstName: el.FirstName,
        lastName: el.LastName,
      },
    }));
  }

  async findOne(id: string) {
    console.log(id);

    // return `This action returns all wallets`;
    const result = await this.dataSource.query(
      `
   SELECT w.*, u.*
   FROM public."Wallets" as w
   LEFT JOIN "Users" as u
   ON w."ownerId" = u."id"
   WHERE w."id" = $1
    `,
      [id],
    );
    return result;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  // async findUsersWithWallets() {
  async findUsersWithWallets(): Promise<UsersWithWalletsType[]> {
    // const queryUsersWithWallets = `
    //           SELECT u.*,w.currency,w.title,w.balance,w.ownerId
    // FROM public."Users" as u
    // LEFT JOIN "Wallets" as w
    // ON w."ownerId" = u."id"
    // `;

    const queryUsersWithWallets = `
    SELECT ru.id AS userId, ru."LastName", w.id,w.title
    FROM (
      SELECT u.*
    FROM "Users" as u
    ORDER BY "id" asc
    Limit 2 OFFSET 0
  ) as ru
    LEFT JOIN "Wallets" as w
    ON ru."id" = w."ownerId"
`;

    //     const queryUsersWithWallets = `;
    //     SELECT u.* w.*
    // FROM public."Users" as u
    // LEFT JOIN "Wallets" as w
    // ON w."ownerId" = u."id"
    // `;
    type UserType = {
      userid: 1;
      LastName: string;
      id: string;
      title: string;
    };
    const result: UsersWithWalletsType[] = [];

    const rawResult = await this.dataSource.query(queryUsersWithWallets);

    const findedUsers = {};

    for (const user of rawResult) {
      const userWithWallets = {
        id: user.userid,
        lastname: user.LastName,
        wallets: [{ id: user.id, title: user.title }],
      };

      if (!findedUsers[user.userid]) {
        findedUsers[user.userid] = userWithWallets;
        result.push(userWithWallets);
      } else {
        findedUsers[user.userid].wallets.push({
          id: user.id,
          title: user.title,
        });
      }
    }
    return result;
  }
}
