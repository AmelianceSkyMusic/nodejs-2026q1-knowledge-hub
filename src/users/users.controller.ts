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
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { Id } from 'src/common/types/id';

import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdatePasswordRequestDto } from './dto/request/update-password.request.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@Serialize(UserResponseDto)
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@Serialize(UserResponseDto)
	findOne(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.usersService.findOne(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Serialize(UserResponseDto)
	create(@Body() createUserDto: CreateUserRequestDto) {
		return this.usersService.create(createUserDto);
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@Serialize(UserResponseDto)
	updatePassword(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
		@Body() updatePasswordDto: UpdatePasswordRequestDto,
	) {
		return this.usersService.updatePassword(id, updatePasswordDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.usersService.remove(id);
	}
}
