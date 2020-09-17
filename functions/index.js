const rp = require('request');
const cheerio = require('cheerio');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.fetchPuzzle = functions.https.onRequest((req, response) => {
    response.set('Access-Control-Allow-Origin', "*")
    const url = 'http://www.xwordinfo.com/Crossword?date=' + req.query.date;
    rp({
        method: 'GET',
        url: url,
        headers: {
            'User-Agent': 'Mozilla compatible'
        }
    }, (err, res, body) => {
    
        if (err) return console.error(err);
        let $ = cheerio.load(body);
    
        response.json(
            {
                'crossword': cheerio.html($('#PuzTable')),
                'downHints': cheerio.html($('#DCluesPan')),
                'acrossHints': cheerio.html($('#ACluesPan'))
            }
        )
        response.end();
    });
});