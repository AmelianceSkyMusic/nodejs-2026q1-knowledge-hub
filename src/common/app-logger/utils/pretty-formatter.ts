import { isRequestLog } from '../types/request-log';

type ColorFn = (text: string | number) => string;

export type Colors = {
	reset: ColorFn;
	bold: ColorFn;
	dim: ColorFn;
	italic: ColorFn;
	underline: ColorFn;
	inverse: ColorFn;
	hidden: ColorFn;
	strikethrough: ColorFn;
	black: ColorFn;
	red: ColorFn;
	green: ColorFn;
	yellow: ColorFn;
	blue: ColorFn;
	magenta: ColorFn;
	cyan: ColorFn;
	white: ColorFn;
	gray: ColorFn;
	bgBlack: ColorFn;
	bgRed: ColorFn;
	bgGreen: ColorFn;
	bgYellow: ColorFn;
	bgBlue: ColorFn;
	bgMagenta: ColorFn;
	bgCyan: ColorFn;
	bgWhite: ColorFn;
	blackBright: ColorFn;
	redBright: ColorFn;
	greenBright: ColorFn;
	yellowBright: ColorFn;
	blueBright: ColorFn;
	magentaBright: ColorFn;
	cyanBright: ColorFn;
	whiteBright: ColorFn;
	bgBlackBright: ColorFn;
	bgRedBright: ColorFn;
	bgGreenBright: ColorFn;
	bgYellowBright: ColorFn;
	bgBlueBright: ColorFn;
	bgMagentaBright: ColorFn;
	bgCyanBright: ColorFn;
	bgWhiteBright: ColorFn;
};

export const getLevelColor = (levelNum: number, colors: Colors) => {
	if (levelNum >= 60) return colors.bgRedBright;
	if (levelNum >= 50) return colors.redBright;
	if (levelNum >= 40) return colors.yellowBright;
	if (levelNum >= 30) return colors.greenBright;
	if (levelNum >= 20) return colors.cyanBright;
	return colors.gray;
};

const LEVEL_LABELS: Record<number, string> = {
	10: 'VERBOSE',
	20: 'DEBUG',
	30: 'LOG',
	40: 'WARN',
	50: 'ERROR',
	60: 'FATAL',
};

export const customPrettifiers = {
	time: () => '',
	level: () => '',
};

const config = {
	colorizeDetails: false,
	showBody: true,
	showStackTrace: false,
	meta: {
		requestId: false,
		userId: true,
		context: false,
	},
};

interface LogObject extends Record<string, unknown> {
	level?: number;
	time?: number;
	type?: string;
	context?: string;
	stack?: string;
	err?: {
		stack?: string;
		message?: string;
	};
}

interface PrettifierExtras {
	colors: Colors;
}

export const messageFormat = (
	log: LogObject,
	messageKey: string,
	_levelLabel: string,
	extras: PrettifierExtras,
) => {
	const { colors } = extras as { colors: Colors };
	const msg = log[messageKey] ?? log.msg;

	if (msg === undefined && !log.type) return '';

	const levelNum = Number(log.level ?? 30);
	const label = LEVEL_LABELS[levelNum] || 'INFO';
	const baseColor = getLevelColor(levelNum, colors);

	const date = log.time ? new Date(log.time as number) : new Date();
	const time = date.toLocaleTimeString(undefined, { hour12: false });
	const ms = String(date.getMilliseconds()).padStart(3, '0');
	const timeStr = colors.reset(`[${time}.${ms}] `);
	const levelStr = baseColor(`${label}: `.padStart(9, ' '));

	const contextStr = log.context
		? levelNum === 10
			? colors.reset(`[${String(log.context)}]`)
			: levelNum === 50 || levelNum === 60
				? colors.redBright(`[${String(log.context)}]`)
				: colors.yellowBright(`[${String(log.context)}]`)
		: '';

	const prefix = `${timeStr}${levelStr}`;

	if (isRequestLog(msg)) {
		const logWithReq = log as { req?: { id?: string } };
		const reqId = msg.requestId || logWithReq.req?.id || 'unknown';
		const methodStr = msg.method.padStart(6, ' ');

		if (msg.type === 'in') {
			let details = '';
			if (msg.query && Object.keys(msg.query).length > 0) {
				const formattedQuery = JSON.stringify(msg.query, null, 2).replace(/\n/g, '\n  |  ');
				details += `\n  |  Query: ${formattedQuery}`;
			}
			if (msg.body && Object.keys(msg.body).length > 0) {
				const formattedBody = JSON.stringify(msg.body, null, 2).replace(/\n/g, '\n  |  ');
				details += `\n  |  Body: ${formattedBody}`;
			}
			const metaParts = [];
			if (config.meta.requestId) metaParts.push(colors.blue(`| ID: ${reqId}`));
			if (config.meta.context && contextStr) metaParts.push(contextStr);
			const metaStr = metaParts.length > 0 ? ` ${metaParts.join(' ')}` : '';

			const colorizedDetails = config.colorizeDetails
				? baseColor(details)
				: colors.gray(details);

			return `${prefix}${baseColor('-->')} ${colors.yellowBright(methodStr)} ${colors.greenBright(msg.url)}${metaStr}${config.showBody ? colorizedDetails : ''}`;
		}
		if (msg.type === 'out') {
			const statusColor =
				msg.status >= 500
					? colors.redBright
					: msg.status >= 400
						? colors.yellowBright
						: colors.greenBright;
			const metaParts = [];
			if (config.meta.requestId) metaParts.push(colors.blue(`| ID: ${reqId}`));
			if (config.meta.userId && msg.userId)
				metaParts.push(colors.magenta(`| User: ${msg.userId}`));
			if (config.meta.context && contextStr) metaParts.push(contextStr);
			const metaStr = metaParts.length > 0 ? ` ${metaParts.join(' ')}` : '';

			const reqTimeStr = msg.time ? ` ${colors.cyanBright(msg.time)}` : '';

			let outMsg = `${prefix}${baseColor('<--')} ${colors.yellowBright(methodStr)} ${colors.greenBright(msg.url)} ${statusColor(String(msg.status))}${reqTimeStr}${metaStr}`;

			if (msg.message) {
				const formattedMsg = String(msg.message).replace(/\n/g, '\n  |  ');
				const colorizedDetails = config.colorizeDetails
					? baseColor(`\n  |  ${formattedMsg}`)
					: colors.gray(`\n  |  ${formattedMsg}`);
				outMsg += config.showBody ? colorizedDetails : '';
			}

			if (config.showStackTrace) {
				const stack = log.stack || log.err?.stack || msg.stack;
				if (stack) {
					const formattedStack = String(stack).replace(/\n/g, '\n  |  ');
					outMsg += colors.gray(`\n  |  ${formattedStack}`);
				}
			}

			return outMsg;
		}
	}

	const contextPrefix = contextStr ? `${contextStr} ` : '';
	const mainMessage =
		typeof msg === 'object' && msg !== null ? JSON.stringify(msg, null, 2) : String(msg ?? '');

	let result = `${prefix}${contextPrefix}${baseColor(mainMessage)}`;

	if (config.showStackTrace) {
		const stack = log.stack || log.err?.stack;
		if (stack) {
			const formattedStack = String(stack).replace(/\n/g, '\n  |  ');
			result += colors.gray(`\n  |  ${formattedStack}`);
		}
	}

	return result;
};
