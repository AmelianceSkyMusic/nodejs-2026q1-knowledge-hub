import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Id } from 'shared/common/schemas/id.schema';
import { UpdateUser } from 'shared/users/schemas/update-user.schema';
import { InjectDrizzle } from 'src/drizzle/decorators/drizzle.decorator';
import { DrizzleDb } from 'src/drizzle/types/drizzle-db';
import { calculatePagination } from 'src/drizzle/utils/calculate-pagination';

import * as schema from '../../drizzle/db/schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersWithPaginationQueryDto } from '../dto/get-user-with-pagination-query.dto';

@Injectable()
export class UsersRepository {
	constructor(@InjectDrizzle() private readonly db: DrizzleDb) {}

	async findAll(getUsersWithPaginationQueryDto: GetUsersWithPaginationQueryDto) {
		const { page, limit, sortBy, order } = getUsersWithPaginationQueryDto;

		const orderBy = { [sortBy]: order };

		if (!page) return await this.db.query.users.findMany({ orderBy });

		return await this.db.transaction(async (tx) => {
			const total = await tx.$count(schema.users);
			if (total === 0) return { total, page, limit, data: [] };

			const { currentPage, offset } = calculatePagination(total, page, limit);

			const result = await tx.query.users.findMany({
				limit,
				offset,
				orderBy,
			});

			return { total, page: currentPage, limit, data: result };
		});
	}

	async findOne(id: Id) {
		return await this.db.query.users.findFirst({
			where: { id },
		});
	}

	async findOneByLoginWithPassword(login: string) {
		return await this.db.query.users.findFirst({
			where: { login },
		});
	}

	async findWithPassword(id: Id) {
		return await this.db.query.users.findFirst({
			where: { id },
		});
	}

	async create(createUserDto: CreateUserDto) {
		const [inserted] = await this.db.insert(schema.users).values(createUserDto).returning();
		return inserted;
	}

	async update(id: Id, updateUser: UpdateUser) {
		const [updated] = await this.db
			.update(schema.users)
			.set(updateUser)
			.where(eq(schema.users.id, id))
			.returning();
		return updated;
	}

	async remove(id: Id) {
		const [result] = await this.db
			.delete(schema.users)
			.where(eq(schema.users.id, id))
			.returning();
		return result;
	}
}
