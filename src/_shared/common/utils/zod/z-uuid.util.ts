import { z } from 'zod';

import { err } from './err.util';

import { ERROR } from '../../constants/error';

type ZodParams = { message?: string };

export const zUuid = (params: ZodParams = err(ERROR.VALIDATION.INVALID_UUID)) => z.uuidv4(params);
