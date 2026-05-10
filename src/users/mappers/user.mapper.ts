import type { User } from 'shared/users/schemas/user.schema';
import type { UserEntity } from 'src/drizzle/db/schema';

export class UserMapper {
	static toUser(raw: UserEntity): User {
		return {
			id: raw.id,
			login: raw.login,
			role: raw.role,
			createdAt: raw.createdAt.getTime(),
			updatedAt: raw.updatedAt.getTime(),
		};
	}

	static toUsers(raw: UserEntity[]): User[] {
		return raw.map(this.toUser);
	}
}
