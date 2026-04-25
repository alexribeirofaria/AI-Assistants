export interface IMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  provider?: string;
}
