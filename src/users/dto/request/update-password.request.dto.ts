import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { ERROR } from 'src/common/constants/error';

export class UpdatePasswordRequestDto {
	@ApiProperty()
	@IsNotEmpty({ message: ERROR.PASSWORD.IS_EMPTY })
	@IsString({ message: ERROR.PASSWORD.IS_NOT_STRING })
	oldPassword: string;

	@ApiProperty()
	@IsNotEmpty({ message: ERROR.PASSWORD.IS_EMPTY })
	@IsString({ message: ERROR.PASSWORD.IS_NOT_STRING })
	newPassword: string;
}
