const axios = require("axios");
const qs = require("qs");

const getAccessToken = async () => {
  const spotify_access_token_url = "https://accounts.spotify.com/api/token";
  const encodedToken = Buffer.from(
    process.env.Spotify_clientID + ":" + process.env.Spotify_clientSecret
  ).toString("base64");

  const data = qs.stringify({
    grant_type: "client_credentials",
  });

  const authOptions = {
    method: "post",
    url: spotify_access_token_url,
    headers: {
      Authorization: `Basic ${encodedToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  };

  return axios(authOptions).then((res) => res.data.access_token);
};

module.exports = { getAccessToken };
