import { graphql } from '@octokit/graphql';
import { cache } from 'react';

const anilist = graphql.defaults({
  baseUrl: 'https://graphql.anilist.co',
});

export const searchManga = cache(async (search: string) => {
  const {
    Page: {
      media: [manga],
    },
  } = await anilist<{
    Page: {
      media: TAnilistManga[];
    };
  }>(
    `query ($search: String!) {
      Page {
        media(search: $search, type: MANGA) {
          id
          title {
            romaji
            english
            native
          }
          bannerImage
          description(asHtml: false)
          averageScore
          characters {
            nodes {
              name {
                alternative
                full
                native
              }
            }
          }
          siteUrl
          staff {
            nodes {
              name {
                full
                native
                alternative
              }
              image {
                large
                medium
              }
              submissionNotes
              primaryOccupations
            }
          }
        }
      }
    }`,
    {
      search,
    }
  );

  return manga;
});

export default anilist;
