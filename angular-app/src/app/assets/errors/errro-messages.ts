export const ERROR_MESSAGES = {
  DEFAULT: 'Erro inesperado'
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;
