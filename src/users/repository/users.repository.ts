import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Id } from 'shared/common/schemas/id.schema';
import { CreateUser } from 'shared/users/schemas/create-user.schema';
import { GetUsersWithPaginationQuery } from 'shared/users/schemas/get-user-with-pagination-query.schema';
import { UpdateUser } from 'shared/users/schemas/update-user.schema';
import { InjectDrizzle } from 'src/drizzle/decorators/drizzle.decorator';
import { DrizzleDb } from 'src/drizzle/types/drizzle-db';
import { calculatePagination } from 'src/drizzle/utils/calculate-pagination';

import * as schema from '../../drizzle/db/schema';
import { mapUser } from '../mappers/users.mapper';

@Injectable()
export class UsersRepository {
	constructor(@InjectDrizzle() private readonly db: DrizzleDb) {}

	async findAll(getUsersWithPaginationQuery: GetUsersWithPaginationQuery) {
		const { page, limit, sortBy, order } = getUsersWithPaginationQuery;

		const orderBy = { [sortBy]: order };

		if (!page) {
			const result = await this.db.query.users.findMany({ orderBy });
			return result.map(mapUser);
		}

		return await this.db.transaction(async (tx) => {
			const total = await tx.$count(schema.users);
			if (total === 0) return { total, page, limit, data: [] };

			const { currentPage, offset } = calculatePagination(total, page, limit);

			const result = await tx.query.users.findMany({
				limit,
				offset,
				orderBy,
			});

			const data = result.map(mapUser);

			return { total, page: currentPage, limit, data };
		});
	}

	async findOne(id: Id) {
		const result = await this.db.query.users.findFirst({
			where: { id },
		});
		return mapUser(result);
	}

	async findWithPassword(id: Id) {
		return await this.db.query.users.findFirst({
			where: { id },
		});
	}

	async create(createUser: CreateUser) {
		const [inserted] = await this.db.insert(schema.users).values(createUser).returning();
		return mapUser(inserted);
	}

	async update(id: Id, updateUser: UpdateUser) {
		const [updated] = await this.db
			.update(schema.users)
			.set(updateUser)
			.where(eq(schema.users.id, id))
			.returning();
		return mapUser(updated);
	}

	async remove(id: Id) {
		const [result] = await this.db
			.delete(schema.users)
			.where(eq(schema.users.id, id))
			.returning();
		return mapUser(result);
	}
}
