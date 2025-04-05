import ky from 'ky';

const waifu = ky.extend({
  prefixUrl: 'https://waifu.it/api/v4',
  headers: {
    Authorization: process.env.WAIFU_IT,
  },
});

export default waifu;
