interface BaseLog {
	method: string;
	url: string;
	requestId: string;
}

interface IncomingLog extends BaseLog {
	type: 'in';
	query: Record<string, unknown>;
	body: Record<string, unknown>;
}

interface OutgoingLog extends BaseLog {
	type: 'out';
	status: number;
	time: string;
}

export type RequestLog = IncomingLog | OutgoingLog;

export function isRequestLog(message: unknown): message is RequestLog {
	return (
		typeof message === 'object' &&
		message !== null &&
		'type' in message &&
		(message['type'] === 'in' || message['type'] === 'out')
	);
}
