'use server';

import { cache } from 'react';
import * as translatte from 'translatte';
import Client from 'waifu.it';
import anilist from './anilist';

async function getQuote(): Promise<TQuote> {
  try {
    const waifuIt = new Client(process.env.WAIFU_IT);

    const response = await waifuIt.getQuote();

    const {
      Page: {
        characters: [character],
      },
    } = await anilist<{
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
        search: response.author,
      }
    );

    if (
      !character ||
      !response ||
      !character.media ||
      character.media.edges.length === 0
    )
      throw new Error(`Incomplete`);

    const quoteTranslated = await translatte(response.quote, {
      to: `pt`,
    });

    if (character.media.edges[0].node.coverImage.color === null)
      throw new Error(`Not have color in banner of anime`);

    return {
      quote:
        response.quote.length > 1000
          ? `${quoteTranslated.text}…`
          : quoteTranslated.text,
      character: response.author,
      image_character: character.image.large,
      image_character_medium: character.image.medium,
      anime: response.anime,
      image_anime:
        character.media.edges[0].node.coverImage.extraLarge,
      image_anime_medium:
        character.media.edges[0].node.coverImage.medium,
      color_anime:
        character.media.edges[0].node.coverImage.color || `#000000`,
    };
  } catch (error) {
    // eslint-disable-next-line no-return-await
    return await getQuote();
  }
}

export default cache(getQuote);
