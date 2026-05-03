import { MessageDto } from './message.dto';

describe('MessageDto', () => {
	const payload = {
		message: 'Hello',
	};

	it('should be defined', () => {
		expect(new MessageDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = MessageDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if message is missing', () => {
		const result = MessageDto.schema.safeParse({});
		expect(result.success).toBe(false);
	});
});
