import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';

import { prepareAiResponse } from './prepare-ai-response';

import type { z } from 'zod';

export function parseAiResponse<T>(schema: z.ZodSchema<T>, raw: string): T {
	try {
		const sanitized = prepareAiResponse(raw);
		const parsed = JSON.parse(sanitized) as unknown;
		return schema.parse(parsed);
	} catch {
		throw new ServiceUnavailableError('AI error');
	}
}
