import { cache } from 'react';

import { deepseek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';

export const translate = cache(async (text: string) => {
  const description = await generateText({
    model: deepseek('deepseek-chat'),
    prompt: `Translate the following text to Portuguese (WITHOUT COMMENTS OR ANOTHERS TEXT, BUT KEEP HTML TAGS AND STRUCTURE): ${text}`,
    temperature: 1.3,
  });

  return description.text;
});
