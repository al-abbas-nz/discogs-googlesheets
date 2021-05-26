
const Discogs = require('disconnect').Client
require('dotenv').config()
const db = new Discogs('MyUserAgent/1.0', {
	consumerKey: process.env.CONSUMER_KEY, 
	consumerSecret: process.env.CONSUMER_SECRET
}).database()

// search discogs with a barcode
// retrieve masterId and coverImage (url)
// store coverImage url in a variable to post to google sheet
// use masterId to search for trackList
// post trackList to google sheet


const discogsSearch = async (albumBarcode) => {
    
    let tracklistArray =[]
    let albumDataArray = []

    try {
        const masterDetails = await db.search(albumBarcode)

        const masterId = masterDetails.results[0].master_id

        const albumTitle = masterDetails.results[0].title

        const getAlbumData = await db.getMaster(masterId)

        let tracklistData = getAlbumData.tracklist
        let imageUrl = getAlbumData.images[0].uri

        tracklistData.map(track => {
            tracklistArray.push(track.position + ' ' + track.title)
            })

        albumDataArray.push(tracklistArray)
        albumDataArray.push(imageUrl)
        return [imageUrl]

    } catch (error){
        console.log(error)
    }
}

async function runDiscogsSearch(barcode) {
  const data = await discogsSearch(barcode);
  return data
}

runDiscogsSearch('603497860173')

module.exports = {
    runDiscogsSearch
}