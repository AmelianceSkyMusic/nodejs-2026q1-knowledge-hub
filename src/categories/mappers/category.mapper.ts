import type { Category } from 'shared/categories/schemas/category.schema';
import type { CategoryEntity } from 'src/drizzle/db/schema';

export class CategoryMapper {
	static toCategory(raw: CategoryEntity): Category {
		return {
			id: raw.id,
			name: raw.name,
			description: raw.description,
		};
	}

	static toCategories(raw: CategoryEntity[]): Category[] {
		return raw.map(this.toCategory);
	}
}
