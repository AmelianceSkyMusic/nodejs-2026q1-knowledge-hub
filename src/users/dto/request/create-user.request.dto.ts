import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { trim } from 'src/common/utils/dto-transform/trim';

import { UserRole } from '../../types/user-role';

import { USER_ROLES } from '../../constants/user-role';
import { ERROR } from 'src/common/constants/error';

export class CreateUserRequestDto {
	@IsNotEmpty({ message: ERROR.LOGIN.IS_EMPTY })
	@IsString({ message: ERROR.LOGIN.IS_NOT_STRING })
	@Transform(trim)
	login: string;

	@IsNotEmpty({ message: ERROR.PASSWORD.IS_EMPTY })
	@IsString({ message: ERROR.PASSWORD.IS_NOT_STRING })
	@Transform(trim)
	password: string;

	@IsOptional()
	@IsString({ message: ERROR.ROLE.IS_NOT_STRING })
	@IsEnum(USER_ROLES, { message: ERROR.ROLE.INVALID })
	role?: UserRole = 'viewer';
}
