import { Injectable } from '@nestjs/common';
import { Id } from 'shared/common/schemas/id.schema';
import { CreateUser } from 'shared/users/schemas/create-user.schema';
import { GetUsersWithPaginationQuery } from 'shared/users/schemas/get-user-with-pagination-query.schema';
import { UpdateUser } from 'shared/users/schemas/update-user.schema';
import { PrismaService } from 'src/prisma/prisma.service';

import { mapUser } from '../mappers/users.mapper';

@Injectable()
export class UsersRepository {
	constructor(private prisma: PrismaService) {}

	async findAll(getUsersWithPaginationQuery: GetUsersWithPaginationQuery) {
		const { page, limit, sortBy, order } = getUsersWithPaginationQuery;

		if (!page) {
			const result = await this.prisma.user.findMany({ orderBy: { [sortBy]: order } });
			return result.map(mapUser);
		}

		return await this.prisma.$transaction(async (tx) => {
			const total = await tx.user.count();
			if (total === 0) return { total, page, limit, data: [] };

			const pages = Math.ceil(total / limit) || 1;
			const currentPage = Math.min(Math.max(1, page), pages);
			const offset = (currentPage - 1) * limit;

			const result = await tx.user.findMany({
				skip: offset,
				take: limit,
				orderBy: { [sortBy]: order },
			});

			const data = result.map(mapUser);

			return { total, page: currentPage, limit, data };
		});
	}

	async findOne(id: Id) {
		const result = await this.prisma.user.findUnique({ where: { id } });
		if (!result) return null;
		return mapUser(result);
	}

	async findWithPassword(id: Id) {
		return await this.prisma.user.findUnique({ where: { id } });
	}

	async create(createUser: CreateUser) {
		const result = await this.prisma.user.create({ data: createUser });
		return mapUser(result);
	}

	async update(id: Id, updateUser: UpdateUser) {
		const result = await this.prisma.user.update({ data: updateUser, where: { id } });
		return mapUser(result);
	}

	async remove(id: Id) {
		return await this.prisma.user.delete({ where: { id } });
	}
}
