import { Module } from '@nestjs/common';
import { ArticlesModule } from 'src/articles/articles.module';
import { CommentsModule } from 'src/comments/comments.module';

import { UsersRepository } from './repository/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	imports: [ArticlesModule, CommentsModule],
})
export class UsersModule {}
