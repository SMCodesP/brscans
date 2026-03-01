import ky from 'ky';

const yurippe = ky.extend({
  prefixUrl: 'https://yurippe.vercel.app/api/',
});

export default yurippe;
