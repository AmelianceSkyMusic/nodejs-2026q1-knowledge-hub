//* https://aistudio.google.com/rate-limit
//* Limits current as of 2026-05-07_19-29
//* gemini-2.5-flash — stable prod (5 RPM, 250K TPM, 20 RPD)
//* gemini-3-flash-preview — next gen, use instead gemini-2.5-flash when it will be stable (5 RPM, 250K TPM, 20 RPD)
//* gemini-3.1-flash-lite — rsschool, better results (15 RPM, 250K TPM, 500 RPD)
//* gemini-3.1-flash-lite-preview — rsschool, better results (15 RPM, 250K TPM, 500 RPD)
export const MODELS = {
	GEMINI: {
		//* Text-out models
		'gemini-2.5-flash': {
			model: 'gemini-2.5-flash',
			rpm: 5,
			tpm: 250_000,
			rpd: 20,
		},
		'gemini-2.5-pro': {
			model: 'gemini-2.5-pro',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-2.0-flash': {
			model: 'gemini-2.0-flash',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-2.0-flash-001': {
			model: 'gemini-2.0-flash-001',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-2.0-flash-lite-001': {
			model: 'gemini-2.0-flash-lite-001',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-2.0-flash-lite': {
			model: 'gemini-2.0-flash-lite',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-flash-latest': {
			model: 'gemini-flash-latest',
			rpm: 5,
			tpm: 250_000,
			rpd: 20,
		},
		'gemini-flash-lite-latest': {
			model: 'gemini-flash-lite-latest',
			rpm: 10,
			tpm: 250_000,
			rpd: 20,
		},
		'gemini-pro-latest': {
			model: 'gemini-pro-latest',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-2.5-flash-lite': {
			model: 'gemini-2.5-flash-lite',
			rpm: 10,
			tpm: 250_000,
			rpd: 20,
		},
		'gemini-3-pro-preview': {
			model: 'gemini-3-pro-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-3-flash-preview': {
			model: 'gemini-3-flash-preview',
			rpm: 5,
			tpm: 250_000,
			rpd: 20,
		},
		'gemini-3.1-pro-preview': {
			model: 'gemini-3.1-pro-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-3.1-pro-preview-customtools': {
			model: 'gemini-3.1-pro-preview-customtools',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-3.1-flash-lite-preview': {
			//* Use for prod for students
			model: 'gemini-3.1-flash-lite-preview',
			rpm: 15,
			tpm: 250_000,
			rpd: 500,
		},
		'gemini-3.1-flash-lite': {
			model: 'gemini-3.1-flash-lite',
			rpm: 15,
			tpm: 250_000,
			rpd: 500,
		},

		//* Multi-modal generative models
		'gemini-2.5-flash-preview-tts': {
			model: 'gemini-2.5-flash-preview-tts',
			rpm: 3,
			tpm: 10_000,
			rpd: 10,
		},
		'gemini-2.5-pro-preview-tts': {
			model: 'gemini-2.5-pro-preview-tts',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-2.5-flash-image': {
			model: 'gemini-2.5-flash-image',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-3-pro-image-preview': {
			model: 'gemini-3-pro-image-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'nano-banana-pro-preview': {
			model: 'nano-banana-pro-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-3.1-flash-image-preview': {
			model: 'gemini-3.1-flash-image-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'lyria-3-clip-preview': {
			model: 'lyria-3-clip-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'lyria-3-pro-preview': {
			model: 'lyria-3-pro-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-3.1-flash-tts-preview': {
			model: 'gemini-3.1-flash-tts-preview',
			rpm: 3,
			tpm: 10_000,
			rpd: 10,
		},
		'imagen-4.0-generate-001': {
			model: 'imagen-4.0-generate-001',
			rpm: 25,
			tpm: 0,
			rpd: 0,
		},
		'imagen-4.0-ultra-generate-001': {
			model: 'imagen-4.0-ultra-generate-001',
			rpm: 25,
			tpm: 0,
			rpd: 0,
		},
		'imagen-4.0-fast-generate-001': {
			model: 'imagen-4.0-fast-generate-001',
			rpm: 25,
			tpm: 0,
			rpd: 0,
		},
		'veo-2.0-generate-001': {
			model: 'veo-2.0-generate-001',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'veo-3.0-generate-001': {
			model: 'veo-3.0-generate-001',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'veo-3.0-fast-generate-001': {
			model: 'veo-3.0-fast-generate-001',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'veo-3.1-generate-preview': {
			model: 'veo-3.1-generate-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'veo-3.1-fast-generate-preview': {
			model: 'veo-3.1-fast-generate-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'veo-3.1-lite-generate-preview': {
			model: 'veo-3.1-lite-generate-preview',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},

		//* Other models (Embedding, etc.)
		'gemini-embedding-001': {
			model: 'gemini-embedding-001',
			rpm: 100,
			tpm: 30_000,
			rpd: 1_000,
		},
		'gemini-embedding-2-preview': {
			model: 'gemini-embedding-2-preview',
			rpm: 100,
			tpm: 30_000,
			rpd: 1_000,
		},
		'gemini-embedding-2': {
			model: 'gemini-embedding-2',
			rpm: 100,
			tpm: 30_000,
			rpd: 1_000,
		},
		aqa: {
			model: 'aqa',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-robotics-er-1.5-preview': {
			model: 'gemini-robotics-er-1.5-preview',
			rpm: 10,
			tpm: 250_000,
			rpd: 20,
		},
		'gemini-robotics-er-1.6-preview': {
			model: 'gemini-robotics-er-1.6-preview',
			rpm: 5,
			tpm: 250_000,
			rpd: 20,
		},
		'gemini-2.5-computer-use-preview-10-2025': {
			model: 'gemini-2.5-computer-use-preview-10-2025',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},

		//* Live API models
		'gemini-2.5-flash-native-audio-latest': {
			model: 'gemini-2.5-flash-native-audio-latest',
			rpm: Infinity,
			tpm: 1_000_000,
			rpd: Infinity,
		},
		'gemini-2.5-flash-native-audio-preview-09-2025': {
			model: 'gemini-2.5-flash-native-audio-preview-09-2025',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-2.5-flash-native-audio-preview-12-2025': {
			model: 'gemini-2.5-flash-native-audio-preview-12-2025',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemini-3.1-flash-live-preview': {
			model: 'gemini-3.1-flash-live-preview',
			rpm: Infinity,
			tpm: 65_000,
			rpd: Infinity,
		},

		//* Agents
		'deep-research-max-preview-04-2026': {
			model: 'deep-research-max-preview-04-2026',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'deep-research-preview-04-2026': {
			model: 'deep-research-preview-04-2026',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'deep-research-pro-preview-12-2025': {
			model: 'deep-research-pro-preview-12-2025',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},

		//* Other models
		'gemma-3-1b-it:unavailable': {
			model: 'gemma-3-1b-it',
			rpm: 30,
			tpm: 15_000,
			rpd: 14_400,
		},
		'gemma-3-4b-it:unavailable': {
			model: 'gemma-3-4b-it',
			rpm: 30,
			tpm: 15_000,
			rpd: 14_400,
		},
		'gemma-3-12b-it:unavailable': {
			model: 'gemma-3-12b-it',
			rpm: 30,
			tpm: 15_000,
			rpd: 14_400,
		},
		'gemma-3-27b-it:unavailable': {
			model: 'gemma-3-27b-it',
			rpm: 30,
			tpm: 15_000,
			rpd: 14_400,
		},
		'gemma-3n-e4b-it:unavailable': {
			model: 'gemma-3n-e4b-it',
			rpm: 0,
			tpm: 0,
			rpd: 0,
		},
		'gemma-3n-e2b-it:unavailable': {
			model: 'gemma-3n-e2b-it',
			rpm: 30,
			tpm: 15_000,
			rpd: 14_400,
		},
		'gemma-4-26b-a4b-it': {
			model: 'gemma-4-26b-a4b-it',
			rpm: 15,
			tpm: Infinity,
			rpd: 1_500,
		},
		'gemma-4-31b-it': {
			model: 'gemma-4-31b-it',
			rpm: 15,
			tpm: Infinity,
			rpd: 1_500,
		},
	},
} as const;

export type GeminiModels = keyof typeof MODELS.GEMINI;
