const {google} = require('googleapis');
require('dotenv').config()
const keys = require('./keys.json')
const runDiscogsSearch = require('./discogs.js').runDiscogsSearch

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)

client.authorize(err => {
    if(err){
        console.log(err)
        return
    } else {
        console.log('connected')
        gsrun(client)
    }
})

async function gsrun(cl){
    const gsapi = google.sheets({version: 'v4', auth: cl})

    const options = {
        spreadsheetId: process.env.SPREAD_SHEET_ID,
        range: 'B10'
    }
    
    let data = await gsapi.spreadsheets.values.get(options)
    
    let dataArray = data.data.values[0][0]
    console.log(dataArray)

    const discogsResults = await runDiscogsSearch(dataArray)
    console.log('Results: ' + discogsResults)
   

   const updateOptions = {
    spreadsheetId: process.env.SPREAD_SHEET_ID,
    range: 'Q2',
    valueInputOption: 'USER_ENTERED',
    resource: { values: [discogsResults] }
    }

    let response = (await gsapi.spreadsheets.values.update(updateOptions)).config.data
    console.log(response)
    
}
