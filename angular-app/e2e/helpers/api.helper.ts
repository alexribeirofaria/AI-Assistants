import { test, request, APIRequestContext, expect } from '@playwright/test';
import { environment } from '../../environments/environment';

export class ApiHelper {
  private baseUrl = environment.BASE_URL;

  async getRequestContext(): Promise<APIRequestContext> {
    return await request.newContext({ baseURL: this.baseUrl });
  }

  async postChat(message: string, provider: string = 'openai', model: string = 'gpt-4'): Promise<{ status: number, body: any }> {
    const ctx = await this.getRequestContext();
    const response = await ctx.post('/assistant', {
      data: {
        message,
        provider,
        model
      }
    });
    let body: any = {};
    try {
      body = await response.json();
    } catch {
      body = { error: 'Failed to parse JSON' };
    }
    return {
      status: response.status(),
      body
    };
  }

  async getHealth(): Promise<{ status: number, body: any }> {
    const ctx = await this.getRequestContext();
    const response = await ctx.get('/health');
    let body: any = {};
    try {
      body = await response.json();
    } catch {
      body = { error: 'Failed to parse JSON' };
    }
    return {
      status: response.status(),
      body
    };
  }

  async getModels(provider: string = 'openai'): Promise<{ status: number, body: any }> {
    const ctx = await this.getRequestContext();
    const response = await ctx.get('/models?provider=' + provider);
    let body: any = {};
    try {
      body = await response.json();
    } catch {
      body = { error: 'Failed to parse JSON' };
    }
    return {
      status: response.status(),
      body
    };
  }
}
