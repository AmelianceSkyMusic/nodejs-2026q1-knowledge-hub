import { GenerateMessageDto } from './generate-message.dto';

describe('GenerateMessageDto', () => {
	const payload = {
		message: 'Say hello',
	};

	it('should be defined', () => {
		expect(new GenerateMessageDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = GenerateMessageDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if message is missing', () => {
		const result = GenerateMessageDto.schema.safeParse({});
		expect(result.success).toBe(false);
	});
});
