import { graphql } from '@octokit/graphql';

const anilist = graphql.defaults({
  baseUrl: 'https://graphql.anilist.co',
});

export default anilist;
