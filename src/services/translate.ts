export async function translateQuote(quote: string): Promise<string> {
  const res = await fetch(
    'https://ds2api-codes.vercel.app/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `Traduza a seguinte frase para português brasileiro de forma natural e fluida. Retorne APENAS a tradução, sem explicações ou aspas:\n\n${quote}`,
          },
        ],
      }),
    }
  );

  const data = await res.json();
  return data.choices[0].message.content.trim();
}
