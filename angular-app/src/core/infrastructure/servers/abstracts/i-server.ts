export interface ChatMessage {
  role: string;
  content: string;
}

export interface ModelDescriptor {
  id: string;
  name?: string;
}

export interface TextCompletionChoice {
  message?: {
    content?: string | null;
  };
  text?: string | null;
}

export interface TextCompletionResponse {
  content?: string | Array<{ text?: string; content?: string }>;
  text?: string;
  choices?: TextCompletionChoice[];
  model?: string;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface IServer {
  chat?: {
    completions: {
      create: (params: {
        model: string;
        messages: ChatMessage[];
        max_tokens?: number;
      }) => Promise<TextCompletionResponse>;
    };
  };
  messages?: {
    create: (params: {
      model: string;
      messages: ChatMessage[];
      max_tokens?: number;
    }) => Promise<TextCompletionResponse>;
  };
  chats?: {
    create: (params: { model: string }) => {
      sendMessage: (
        prompt: string,
        config: { max_output_tokens: number }
      ) => Promise<TextCompletionResponse>;
    };
  };
  invoke?: (messages: ChatMessage[]) => Promise<TextCompletionResponse>;
  models: {
    list: () => Promise<{ data: ModelDescriptor[] }>;
  };
}
