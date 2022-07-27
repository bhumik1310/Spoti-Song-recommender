// server.js
// where your node app starts

//packages
const express = require("express");
const axios = require("axios");
 
const { getAccessToken } = require("./spotify/auth");
const {searchArtist1, searchArtist2, searchArtist3, getRecommendations} = require("./spotify/actions")

const baseUrl = "https://api.spotify.com/v1"

const app = express(); // initialize an express instance called 'app'


if (!process.env.Spotify_clientID || !process.env.Spotify_clientSecret) {
  console.error("ERROR: Missing one or more critical Spotify environment variables. Check .env file");
}

app.use(express.json()); // set up the app to parse JSON request bodies




// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// return the public/index.html file when a GET request is made to the root path "/"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/recommendations", async (req, res) => {
  if(!req.body) {
    return res.status(400).send({ message: "Bad Request - must send a JSON body with artist names" })
  }
  
  const {artist1, artist2, artist3} = req.body
  
  if(!artist3 || !artist2 || !artist1) {
    return res.status(400).send({ message: "Bad Request - must pass artist names" })
  }
  
  
  let accessToken
  try{
    accessToken = await getAccessToken()
  } catch(err){
    console.error(err.message)
    return res.status(500).send({ message: "Something went wrong when fetching access token" })
  }
  
  const http = axios.create({ headers: { 'Authorization': `Bearer ${accessToken}` }})
  
  let artist1ID
  try{
    const result = await searchArtist1(http, {artist1})
    if(!result || !result.artists.items || !result.artists.items.length ) {
      return res.status(404).send({ message: `${artist1} not found.` })
    }
    
    // save the first search result's trackId to a variable
    artist1ID = result.artists.items[0].id
  }catch(err){
    console.error(err.message)
    return res.status(500).send({ message: "Error when searching for ${artist1}" })
  }
  
  let artist2ID
  try{
    const result = await searchArtist2(http, {artist2})
    if(!result || !result.artists.items || !result.artists.items.length ) {
      return res.status(404).send({ message: `${artist2} not found.` })
    }
    // save the first search result's trackId to a variable
    artist2ID = result.artists.items[0].id
  }catch(err){
    console.error(err.message)
    return res.status(500).send({ message: "Error when searching for ${artist2}" })
  }
  
  let artist3ID
  try{
    const result = await searchArtist3(http, {artist3})
    if(!result || !result.artists.items || !result.artists.items.length ) {
      return res.status(404).send({ message: `${artist3} not found.` })
    }
    
    // save the first search result's trackId to a variable
    artist3ID = result.artists.items[0].id
  }catch(err){
    console.error(err.message)
    return res.status(500).send({ message: "Error when searching for ${artist3}" })
  }
  
  try {
    const result = await getRecommendations(http, { artist1ID, artist2ID, artist3ID })
    // if no songs returned in search, send a 404 response
    if(!result.tracks || !result.tracks.length ) {
      return res.status(404).send({ message: "No recommendations found." })
    }
    return res.send(result)
    // Success! Send track recommendations back to client
    return res.send(result.tracks)
  } catch(err) {
    console.error(err.message)
    return res.status(500).send({ message: "Something went wrong when fetching recommendations" })
  }
  return res.send(result)
})
  
// start listening on a port provided by Glitch
app.listen(process.env.PORT, () => {
  console.log(`Example app listening at port ${process.env.PORT}`);
});
