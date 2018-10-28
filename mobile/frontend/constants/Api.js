API_URL = 'https://doggo.herokuapp.com/api/';

const formatAPILink = ((url) => {
  return API_URL + url;
});

export default {
  getAllSessions: formatAPILink('getAllSessions'),
  getCurrentUDCSessions: formatAPILink('getCurrentUDCSessions'),
}