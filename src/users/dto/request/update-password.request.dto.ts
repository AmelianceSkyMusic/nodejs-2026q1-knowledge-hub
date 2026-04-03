import { IsNotEmpty, IsString } from 'class-validator';

import { ERROR } from 'src/common/constants/error';

export class UpdatePasswordRequestDto {
	@IsNotEmpty({ message: ERROR.PASSWORD.IS_EMPTY })
	@IsString({ message: ERROR.PASSWORD.IS_NOT_STRING })
	oldPassword: string;

	@IsNotEmpty({ message: ERROR.PASSWORD.IS_EMPTY })
	@IsString({ message: ERROR.PASSWORD.IS_NOT_STRING })
	newPassword: string;
}
