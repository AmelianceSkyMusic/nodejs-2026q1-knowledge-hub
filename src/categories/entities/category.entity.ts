import type { Id } from 'src/_shared/common/schemas/id.schema';

export class CategoryEntity {
	id: Id;
	name: string;
	description: string;
}
