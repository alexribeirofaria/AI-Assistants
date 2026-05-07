export function toErrorMessage(error: any): string {
  if (error instanceof Error && typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  if (typeof error === 'number' || typeof error === 'boolean' || typeof error === 'bigint') {
    return `${error}`;
  }

  if (error && typeof error === 'object') {
    const maybeName = (error as { name?: any }).name;
    const maybeMessage = (error as { message?: any }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return typeof maybeName === 'string' && maybeName.trim()
        ? `${maybeName}: ${maybeMessage}`
        : maybeMessage;
    }

    const json = safeJsonStringify(error);
    if (json && json !== '{}') {
      return json;
    }

    if (typeof maybeName === 'string' && maybeName.trim()) {
      return maybeName;
    }
  }

  return 'Erro desconhecido ao executar o prompt.';
}

function safeJsonStringify(value: any): string | null {
  const seen = new WeakSet<object>();

  try {
    return JSON.stringify(value, (_key, currentValue: any) => {
      if (typeof currentValue === 'object' && currentValue !== null) {
        if (seen.has(currentValue)) {
          return '[Circular]';
        }
        seen.add(currentValue);
      }
      return currentValue;
    });
  } catch {
    return null;
  }
}
