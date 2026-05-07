import { Test } from '@nestjs/testing';
import { AiThrottlerGuard } from 'src/common/guards/ai-throttler.guard';
import { vi } from 'vitest';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';

import { MOCK } from 'src/common/constants/mock';

import type { TestingModule } from '@nestjs/testing';

describe('AiController', () => {
	let controller: AiController;
	let service: AiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AiController],
			providers: [
				{
					provide: AiService,
					useValue: {
						summarizeArticle: vi.fn(),
						translateArticle: vi.fn(),
						analyzeArticle: vi.fn(),
						generateMessage: vi.fn(),
						getStatistics: vi.fn(),
					},
				},
			],
		})
			.overrideGuard(AiThrottlerGuard)
			.useValue({ canActivate: () => true })
			.compile();

		controller = module.get<AiController>(AiController);
		service = module.get<AiService>(AiService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('summarizeArticle', () => {
		it('should call service.summarizeArticle', async () => {
			const dto = { maxLength: 'short' as const };
			await controller.summarizeArticle({ id: MOCK.COMMON.ID }, dto);
			expect(service.summarizeArticle).toHaveBeenCalledWith(MOCK.COMMON.ID, dto);
		});
	});

	describe('translateArticle', () => {
		it('should call service.translateArticle', async () => {
			const dto = { targetLanguage: 'uk' };
			await controller.translateArticle({ id: MOCK.COMMON.ID }, dto);
			expect(service.translateArticle).toHaveBeenCalledWith(MOCK.COMMON.ID, dto);
		});
	});

	describe('analyzeArticle', () => {
		it('should call service.analyzeArticle', async () => {
			const dto = { task: 'review' as const };
			await controller.analyzeArticle({ id: MOCK.COMMON.ID }, dto);
			expect(service.analyzeArticle).toHaveBeenCalledWith(MOCK.COMMON.ID, dto);
		});
	});

	describe('generateMessage', () => {
		it('should call service.generateMessage', async () => {
			const dto = { message: 'Hello' };
			await controller.generateMessage({ userId: MOCK.COMMON.ID } as any, dto);
			expect(service.generateMessage).toHaveBeenCalledWith(MOCK.COMMON.ID, dto);
		});
	});

	describe('getStatistics', () => {
		it('should call service.getStatistics', async () => {
			await controller.getStatistics();
			expect(service.getStatistics).toHaveBeenCalled();
		});
	});
});
