import type { Id } from '../types/id';

type BaseEntity = {
	id: Id;
};

export class BaseRepository<T extends BaseEntity> {
	protected data: T[] = [];

	findAll(): T[] {
		return this.data;
	}

	findOne(id: string): T | undefined {
		return this.data.find((dataEntity) => dataEntity.id === id);
	}

	create(data: T): T {
		this.data.push(data);
		return data;
	}

	update(id: string, updateData: Partial<T>): T | null {
		const index = this.data.findIndex((dataEntity) => dataEntity.id === id);
		if (index === -1) return null;

		this.data[index] = { ...this.data[index], ...updateData };
		return this.data[index];
	}

	remove(id: string): boolean {
		const index = this.data.findIndex((dataEntity) => dataEntity.id === id);
		if (index === -1) return false;

		this.data.splice(index, 1);
		return true;
	}
}
