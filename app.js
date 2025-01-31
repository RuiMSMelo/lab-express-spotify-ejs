require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))



// Our routes go here:
app.get('/', (request, response) => {
    response.render('homepage')
})

app.get('/artist-search', (request, response) => {
    spotifyApi
      .searchArtists(request.query.artist)
      .then(data => {
        // console.log('The received data from the API: ', data.body)
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        const artistsResults = data.body.artists.items
        // console.log('the result of the search for artist:', artistsResults.images[0])
        response.render('artist-search-results',{artistsResults})
      })
      .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (request, response) => {
    const {artistId} = request.params
    spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
        const albumsResults = data.body.items
        console.log (albumsResults)
        response.render('albums',{albumsResults})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
