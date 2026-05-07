import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';

import { prepareAiResponse } from './prepare-ai-response';

import type { z } from 'zod';

export function parseAiResponse<T>(schema: z.ZodSchema<T>, raw: string): T {
	const sanitized = prepareAiResponse(raw);
	const jsonMatch = sanitized.match(/\{[\s\S]*\}/);
	const jsonString = jsonMatch ? jsonMatch[0] : sanitized;

	let parsed: unknown;
	try {
		parsed = JSON.parse(jsonString);
	} catch {
		throw new ServiceUnavailableError('AI response format error');
	}

	try {
		return schema.parse(parsed);
	} catch {
		return parsed as T;
	}
}
