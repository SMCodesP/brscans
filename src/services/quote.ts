'use server';

import { cache } from 'react';
import anilist from './anilist';
import yurippe from './waifu';

type TYurippeQuote = {
  _id: string;
  character: string;
  show: string;
  quote: string;
};

type TChracter = {
  image: {
    large: string;
    medium: string;
  };
  media: {
    edges: {
      node: {
        coverImage: {
          extraLarge: string;
          medium: string;
          color: string | null;
        };
      };
    }[];
  };
};

async function translateQuote(quote: string): Promise<string> {
  const res = await fetch(
    'https://ds2api-blond.vercel.app/v1/chat/completions',
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

async function getQuote(tries = 3, repeated = 0): Promise<TQuote> {
  try {
    const quotes = await yurippe
      .get('quotes', { searchParams: { random: 1 } })
      .json<TYurippeQuote[]>();

    const data = quotes[0];

    const [
      translatedQuote,
      {
        Page: {
          characters: [character],
        },
      },
    ] = await Promise.all([
      translateQuote(data.quote),
      anilist<{
        Page: {
          characters: TChracter[];
        };
      }>(
        `
        query ($search: String) {
          Page(page: 1, perPage: 1) {
            characters(search: $search) {
              image {
                large
                medium
              }
              media (perPage: 1) {
                edges {
                  node {
                    coverImage {
                      extraLarge
                      medium
                      color
                    }
                  }
                }
              }
            }
          }
        }
      `,
        {
          search: data.character,
        }
      ),
    ]);

    if (
      !character ||
      !data ||
      !character.media ||
      character.media.edges.length === 0
    )
      throw new Error(`Incomplete`);

    if (character.media.edges[0].node.coverImage.color === null)
      throw new Error(`Not have color in banner of anime`);

    return {
      quote: translatedQuote,
      character: data.character,
      image_character: character.image.large,
      image_character_medium: character.image.medium,
      anime: data.show,
      image_anime:
        character.media.edges[0].node.coverImage.extraLarge,
      image_anime_medium:
        character.media.edges[0].node.coverImage.medium,
      color_anime:
        character.media.edges[0].node.coverImage.color || `#000000`,
    };
  } catch (error) {
    console.log(error);
    if (repeated < tries) {
      return await getQuote(tries, repeated + 1);
    }
    throw new Error(`Error in getQuote`);
  }
}

export default cache(getQuote);
