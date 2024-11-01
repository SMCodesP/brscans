import axios from 'axios';

const waifu = axios.create({
  baseURL: 'https://waifu.it/api/v4',
  headers: {
    Authorization: process.env.WAIFU_IT,
  },
});

export default waifu;
