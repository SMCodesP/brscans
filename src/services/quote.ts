'use server';

import { cache } from 'react';
import anilist from './anilist';
import waifu from './waifu';

async function getQuote(tries = 3, repeated = 0): Promise<TQuote> {
  try {
    // const { data } = await waifu.get<{
    //   id: number;
    //   quote: string;
    //   anime: string;
    //   author: string;
    // }>('/quote');
    // const data = {
    //   quote: `A lesson without pain is meaningless. That's because no one can gain without sacrificing something. But by enduring that pain and overcoming it, he shall obtain a powerful, unmatched heart... A Fullmetal Heart.`,
    //   anime: `Fullmetal Alchemist`,
    //   author: `Edward Elric`,
    // };

    // const {
    //   Page: {
    //     characters: [character],
    //   },
    // } = await anilist<{
    //   Page: {
    //     characters: TChracter[];
    //   };
    // }>(
    //   `
    //   query ($search: String) {
    //     Page(page: 1, perPage: 1) {
    //       characters(search: $search) {
    //         image {
    //           large
    //           medium
    //         }
    //         media (perPage: 1) {
    //           edges {
    //             node {
    //               coverImage {
    //                 extraLarge
    //                 medium
    //                 color
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // `,
    //   {
    //     search: data.author,
    //   }
    // );

    // if (
    //   !character ||
    //   !data ||
    //   !character.media ||
    //   character.media.edges.length === 0
    // )
    //   throw new Error(`Incomplete`);

    // // const quoteTranslated = await translatte(data.quote, {
    // //   to: `pt`,
    // // });

    // if (character.media.edges[0].node.coverImage.color === null)
    //   throw new Error(`Not have color in banner of anime`);

    // console.log({
    //   quote: data.quote,
    //   character: data.author,
    //   image_character: character.image.large,
    //   image_character_medium: character.image.medium,
    //   anime: data.anime,
    //   image_anime:
    //     character.media.edges[0].node.coverImage.extraLarge,
    //   image_anime_medium:
    //     character.media.edges[0].node.coverImage.medium,
    //   color_anime:
    //     character.media.edges[0].node.coverImage.color || `#000000`,
    // });

    return {
      quote:
        'Uma lição sem dor não tem significado. Isso porque ninguém pode ganhar algo sem sacrificar alguma coisa. Mas, ao suportar essa dor e superá-la, ele obterá um coração poderoso e incomparável... Um Coração de Aço Completo.',
      character: 'Edward Elric',
      image_character:
        'https://s4.anilist.co/file/anilistcdn/character/large/b11-TA5Nuk7EDUZG.jpg',
      image_character_medium:
        'https://s4.anilist.co/file/anilistcdn/character/medium/b11-TA5Nuk7EDUZG.jpg',
      anime: 'Fullmetal Alchemist',
      image_anime:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx121-JUlbsyhTUNkk.png',
      image_anime_medium:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx121-JUlbsyhTUNkk.png',
      color_anime: '#e4bb43',
    };
  } catch (error) {
    console.log(error);
    // if (repeated < tries) {
    //   return await getQuote(tries, repeated + 1);
    // }
    throw new Error(`Error in getQuote`);
  }
}

export default cache(getQuote);
