export type Content = {
	parts: Part[];
	role?: 'user' | 'model';
};

export type Part = TextPart | InlineDataPart | FunctionCallPart | FunctionResponsePart;

export type TextPart = {
	text: string;
};

export type InlineDataPart = {
	inlineData: {
		mimeType: string;
		data: string;
	};
};

export type FunctionCallPart = {
	functionCall: {
		name: string;
		args: Record<string, unknown>;
	};
};

export type FunctionResponsePart = {
	functionResponse: {
		name: string;
		response: Record<string, unknown>;
	};
};
