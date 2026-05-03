export type Tool = {
	functionDeclarations?: FunctionDeclaration[];
	codeExecution?: Record<string, never>;
};

export type FunctionDeclaration = {
	name: string;
	description?: string;
	parameters?: Record<string, unknown>;
};

export type ToolConfig = {
	functionCallingConfig?: {
		mode?: 'AUTO' | 'ANY' | 'NONE';
		allowedFunctionNames?: string[];
	};
};
