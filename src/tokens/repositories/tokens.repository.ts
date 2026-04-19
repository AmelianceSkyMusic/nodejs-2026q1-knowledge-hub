import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { Id } from 'shared/common/schemas/id.schema';
import * as schema from 'src/drizzle/db/schema';
import { InjectDrizzle } from 'src/drizzle/decorators/drizzle.decorator';
import { DrizzleDb } from 'src/drizzle/types/drizzle-db';

@Injectable()
export class TokensRepository {
	constructor(@InjectDrizzle() private readonly db: DrizzleDb) {}

	async create(userId: Id, token: string) {
		const hashedToken = await hash(token, 10);
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

	async deleteByUserId(userId: Id, token: string) {
		const isValid = await this.validate(userId, token);
		if (!isValid) return false;

		await this.db.delete(schema.tokens).where(eq(schema.tokens.userId, userId));
		return true;
	}

	async validate(userId: Id, token: string) {
		const sessionToken = await this.findByUserId(userId);
		if (!sessionToken) return false;
		return await compare(token, sessionToken.token);
	}
}
