import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { UserDto } from 'src/users/dto/user.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { SignupDto } from './dto/signup.dto';
import { TokensDto } from './dto/tokens.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@ApiOperation({
		summary: 'Signup',
		description: 'Successful signup',
	})
	@ZodResponse({ type: UserDto })
	@ApiCreatedResponse({ description: 'User is created' })
	@ApiBadRequestResponse({ description: 'Bad request!' })
	@HttpCode(HttpStatus.CREATED)
	signup(@Body() signupDto: SignupDto) {
		return this.authService.signup(signupDto);
	}

	@Post('login')
	@ApiOperation({
		summary: 'Login',
		description: 'Login and receive JWT tokens',
	})
	@ApiOkResponse({ description: 'Successful login', type: TokensDto })
	@ApiBadRequestResponse({ description: 'Bad request!' })
	@ApiForbiddenResponse({ description: 'Incorrect login or password' })
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: TokensDto })
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post('refresh')
	@ApiOperation({
		summary: 'Refresh token',
		description: 'Get new access and refresh tokens using a valid refresh token',
	})
	@ApiOkResponse({ description: 'New token pair', type: TokensDto })
	@ApiBadRequestResponse({ description: 'No refresh token provided' })
	@ApiForbiddenResponse({ description: 'Invalid or expired refresh token' })
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: TokensDto })
	refresh(@Body() refreshDto: RefreshDto) {
		return this.authService.refresh(refreshDto);
	}
}
