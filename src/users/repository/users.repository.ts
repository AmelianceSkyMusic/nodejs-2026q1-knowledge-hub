import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<UserEntity> {}
