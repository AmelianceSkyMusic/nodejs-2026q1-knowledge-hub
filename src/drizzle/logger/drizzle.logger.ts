import { Injectable, Logger as NestLogger } from '@nestjs/common';

import type { Logger } from 'drizzle-orm/logger';
import type { format } from 'sql-formatter';

type FormatFn = typeof format;

@Injectable()
export class DrizzleLogger implements Logger {
	private readonly logger = new NestLogger(DrizzleLogger.name);
	private formatFn: FormatFn | undefined;

	logQuery(query: string, params: unknown[]): void {
		let interpolated = query;
		for (let i = params.length - 1; i >= 0; i--) {
			const p = params[i];
			let value: string;
			if (p === null) value = 'NULL';
			else if (typeof p === 'boolean') value = p ? 'TRUE' : 'FALSE';
			else value = typeof p === 'string' ? `'${p}'` : String(p);

			interpolated = interpolated.replace(new RegExp(`\\$${i + 1}(?!\\d)`, 'g'), value);
		}

		const log = (fn = this.formatFn) => {
			try {
				const res = fn
					? fn(interpolated, { language: 'postgresql', keywordCase: 'upper' })
					: interpolated;
				const indented = res
					.replace(/"/g, '')
					.split('\n')
					.map((line) => `  ${line}`)
					.join('\n');
				this.logger.verbose(`Query:\n${indented}`);
			} catch {
				this.logger.verbose(`Query:\n  ${interpolated}`);
			}
		};

		if (this.formatFn) return log();

		import('sql-formatter')
			.then((m) => {
				this.formatFn = m.format;
				log();
			})
			.catch(() => log());
	}
}
