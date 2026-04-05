import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';

import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoryEntity> {}
