import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { Id } from 'src/common/types/id';

import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdatePasswordRequestDto } from './dto/request/update-password.request.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UsersService } from './users.service';

import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('User')
@Controller('user')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiOperation({
		summary: 'Get all users',
		description: 'Gets all users.',
	})
	@ApiOkResponse({ description: 'Successful operation', type: [UserResponseDto] })
	@HttpCode(HttpStatus.OK)
	@Serialize(UserResponseDto)
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':userId')
	@ApiOperation({ summary: 'Get single user by id', description: 'Gets single user by id' })
	@ApiOkResponse({ description: 'Successful operation', type: UserResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. UserId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'User was not found' })
	@ApiParam({
		name: 'userId',
		required: true,
		description: 'User id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@Serialize(UserResponseDto)
	findOne(
		@Param(
			'userId',
			new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
		)
		userId: Id,
	) {
		return this.usersService.findOne(userId);
	}

	@Post()
	@ApiOperation({
		summary: 'Create user',
		description: 'Creates a new user (admin only)',
	})
	@ApiCreatedResponse({ description: 'User is created', type: UserResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. Body does not contain required fields' })
	@HttpCode(HttpStatus.CREATED)
	@Serialize(UserResponseDto)
	create(@Body() createUserRequestDto: CreateUserRequestDto) {
		return this.usersService.create(createUserRequestDto);
	}

	@Put(':userId')
	@ApiOperation({
		summary: 'Update user password',
		description: 'Update user password by ID',
	})
	@ApiOkResponse({ description: 'The user has been updated', type: UserResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. UserId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'User was not found' })
	@ApiParam({
		name: 'userId',
		required: true,
		description: 'User id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@Serialize(UserResponseDto)
	updatePassword(
		@Param(
			'userId',
			new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
		)
		userId: Id,
		@Body() updatePasswordRequestDto: UpdatePasswordRequestDto,
	) {
		return this.usersService.updatePassword(userId, updatePasswordRequestDto);
	}

	@Delete(':userId')
	@ApiOperation({
		summary: 'Delete user',
		description:
			"Deletes user by ID. Sets authorId to null on articles, deletes user's comments.",
	})
	@ApiNoContentResponse({ description: 'Deleted successfully' })
	@ApiBadRequestResponse({ description: 'Bad request. UserId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'User was not found' })
	@ApiParam({
		name: 'userId',
		required: true,
		description: 'User id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Param(
			'userId',
			new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
		)
		userId: Id,
	) {
		return this.usersService.remove(userId);
	}
}
