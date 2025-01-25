'use server';

import { cache } from 'react';
import * as translatte from 'translatte';
import Client from 'waifu.it';
import anilist from './anilist';
import waifu from './waifu';

async function getQuote(tries = 3, repeated = 0): Promise<TQuote> {
  try {
    // const waifuIt = new Client(process.env.WAIFU_IT);

    const { data } = await waifu.get<{
      id: number;
      quote: string;
      anime: string;
      author: string;
    }>('/quote');

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
        search: data.author,
      }
    );

    if (
      !character ||
      !data ||
      !character.media ||
      character.media.edges.length === 0
    )
      throw new Error(`Incomplete`);

    // const quoteTranslated = await translatte(data.quote, {
    //   to: `pt`,
    // });

    if (character.media.edges[0].node.coverImage.color === null)
      throw new Error(`Not have color in banner of anime`);

    return {
      quote: data.quote,
      character: data.author,
      image_character: character.image.large,
      image_character_medium: character.image.medium,
      anime: data.anime,
      image_anime:
        character.media.edges[0].node.coverImage.extraLarge,
      image_anime_medium:
        character.media.edges[0].node.coverImage.medium,
      color_anime:
        character.media.edges[0].node.coverImage.color || `#000000`,
    };
  } catch (error) {
    if (repeated < tries) {
      return await getQuote(tries, repeated + 1);
    }
    throw new Error(`Error in getQuote`);
  }
}

export default cache(getQuote);
