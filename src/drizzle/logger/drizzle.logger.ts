import type { Logger } from 'drizzle-orm/logger';
import type { AppLogger } from 'src/common/app-logger/app-logger.service';

const SQL_KEYWORDS_REGEX =
	/\b(select|from|where|insert into|values|returning|update|set|delete from|inner join|left join|and|or|order by|group by|limit|offset)\b/gi;

export class DrizzleLogger implements Logger {
	constructor(private readonly appLogger: AppLogger) {}

	logQuery(query: string, params: unknown[]): void {
		const formattedQuery = query.replaceAll(SQL_KEYWORDS_REGEX, '\n  $1');

		const message = `\n[SQL]:${formattedQuery}${
			params.length > 0 ? `\n[Params]:\n${JSON.stringify(params, null, 2)}` : ''
		}`;

		this.appLogger.verbose(message, DrizzleLogger.name);
	}
}
