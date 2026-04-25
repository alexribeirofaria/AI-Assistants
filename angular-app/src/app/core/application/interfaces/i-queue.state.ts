export interface QueueState {
  tasks: Array<{ kind: 'message'; payload: string }>;
}
