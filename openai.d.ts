declare module 'openai' {
    export function create(params: any): Promise<any>;
    export let apiKey: string;
  }
  