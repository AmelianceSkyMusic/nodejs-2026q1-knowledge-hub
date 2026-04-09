import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiExtraModels,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	getSchemaPath,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { IdParamDto } from 'src/_shared/common/dto/id-param.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersWithPaginationQueryDto } from './dto/get-user-with-pagination-query.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDto } from './dto/user.dto';
import { UsersWithPaginationDto } from './dto/users-with-pagination.dto';
import { UsersService } from './users.service';

import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('User')
@ApiExtraModels(UsersWithPaginationDto)
@Controller('user')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiOperation({
		summary: 'Get all users',
		description: 'Gets all users.',
	})
	@ApiOkResponse({
		description: 'Successful operation',
		schema: {
			oneOf: [
				{ $ref: getSchemaPath(UserDto), type: 'array' },
				{ $ref: getSchemaPath(UsersWithPaginationDto) },
			],
		},
	})
	@HttpCode(HttpStatus.OK)
	findAll(
		@Query()
		getUsersWithPaginationQueryDto: GetUsersWithPaginationQueryDto,
	) {
		const result = this.usersService.findAll(getUsersWithPaginationQueryDto);
		if ('data' in result) return UsersWithPaginationDto.create(result);
		return result.map((user) => UserDto.create(user));
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get single user by id', description: 'Gets single user by id' })
	@ApiOkResponse({ description: 'Successful operation', type: UserDto })
	@ApiBadRequestResponse({ description: 'Bad request. UserId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'User was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'User id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: UserDto })
	findOne(@Param() { id: userId }: IdParamDto) {
		return this.usersService.findOne(userId);
	}

	@Post()
	@ApiOperation({
		summary: 'Create user',
		description: 'Creates a new user (admin only)',
	})
	@ApiCreatedResponse({ description: 'User is created', type: UserDto })
	@ApiBadRequestResponse({ description: 'Bad request. Body does not contain required fields' })
	@HttpCode(HttpStatus.CREATED)
	@ZodResponse({ type: UserDto })
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Put(':id')
	@ApiOperation({
		summary: 'Update user password',
		description: 'Update user password by ID',
	})
	@ApiOkResponse({ description: 'The user has been updated', type: UserDto })
	@ApiBadRequestResponse({ description: 'Bad request. UserId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'User was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'User id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: UserDto })
	updatePassword(
		@Param() { id: userId }: IdParamDto,
		@Body() updatePasswordDto: UpdatePasswordDto,
	) {
		return this.usersService.updatePassword(userId, updatePasswordDto);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete user',
		description:
			"Deletes user by ID. Sets authorId to null on articles, deletes user's comments.",
	})
	@ApiNoContentResponse({ description: 'Deleted successfully' })
	@ApiBadRequestResponse({ description: 'Bad request. UserId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'User was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'User id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Param() { id: userId }: IdParamDto) {
		return this.usersService.remove(userId);
	}
}
