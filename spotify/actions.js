const baseUrl = "https://api.spotify.com/v1";

const searchArtist1 = async (http, { artist1 }) => {
  const config = {
    method: "get",
    url: `${baseUrl}/search?q=artist:${artist1}&type=artist`
  };

  return http(config).then(res => res.data);
};

const searchArtist2 = async (http, { artist2 }) => {
  const config = {
    method: "get",
    url: `${baseUrl}/search?q=artist:${artist2}&type=artist`
  };

  return http(config).then(res => res.data);
};

const searchArtist3 = async (http, { artist3 }) => {
  const config = {
    method: "get",
    url: `${baseUrl}/search?q=artist:${artist3}&type=artist`
  };

  return http(config).then(res => res.data);
};

const getRecommendations = async (
  http,
  { artist1ID, artist2ID, artist3ID }
) => {
  const config = {
    method: "get",
    url: `${baseUrl}/recommendations?seed_artists=${artist1ID},${artist2ID},${artist3ID}`
  };

  return http(config).then(res => res.data);
};

module.exports = {
  searchArtist1,
  searchArtist2,
  searchArtist3,
  getRecommendations
};
