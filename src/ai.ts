import fetch from 'node-fetch';
import { INTELLIGENCE_API_KEY } from './config';
import { ChatMessage } from './types';

export async function askAI(messages: ChatMessage[], sumvol: number): Promise<string> {
  const response = await fetch('https://api.intelligence.io.solutions/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${INTELLIGENCE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-R1-0528',
      messages,
      temperature: 0.7,
      stream: false,
      max_completion_tokens: sumvol
    })
  });

  if (!response.ok) throw new Error(`Помилка API: ${response.statusText}`);

  const data: any = await response.json();
  return data.choices?.[0]?.message?.content || '🤷‍♂️ Не знаю що відповісти...';
}
