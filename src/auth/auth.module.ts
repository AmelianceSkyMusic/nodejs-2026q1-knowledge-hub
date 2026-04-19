import { Module } from '@nestjs/common';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [UsersModule, TokensModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
