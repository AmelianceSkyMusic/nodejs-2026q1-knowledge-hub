import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Id } from 'shared/common/schemas/id.schema';
import * as schema from 'src/drizzle/db/schema';
import { InjectDrizzle } from 'src/drizzle/decorators/drizzle.decorator';
import { DrizzleDb } from 'src/drizzle/types/drizzle-db';

@Injectable()
export class TokensRepository {
	constructor(@InjectDrizzle() private readonly db: DrizzleDb) {}

	async create(userId: Id, hashedToken: string) {
		await this.db
			.insert(schema.tokens)
			.values({ userId, token: hashedToken })
			.onConflictDoUpdate({
				target: schema.tokens.userId,
				set: { token: hashedToken },
			});
	}

	async findByUserId(userId: Id) {
		return await this.db.query.tokens.findFirst({
			where: { userId },
		});
	}

	async deleteByUserId(userId: Id) {
		await this.db.delete(schema.tokens).where(eq(schema.tokens.userId, userId));
	}
}
