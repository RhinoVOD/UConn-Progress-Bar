var Twit = require('twit');
var config = require('./config.js');
var T = new Twit(config);

const days = 112;

const now = new Date();

const CronJob = require('cron').CronJob;

var SemesterEnd = new Date('December 15, 2019, 16:00:00');

const diff = now - SemesterEnd;

const oneDay = 1000 * 60 * 60 * 24;

const currentDay = Math.floor(diff/oneDay);

//calculates the current percent of days passed now
const currentPercent = currentDay / days * 100;


//with the use of this cronjob, this function will be used at 8 AM every day
new CronJob('0 08 * * *', function() {
    tweeter(currentPercent, barStyle);
}, null, true, 'UTC');

//the function to create the tweet and post it
function tweeter(currentPercent) {
    var tweet = createBar(currentPercent) + ' ' + currentPercent.toFixed(2) + '% of the Uconn semester has passed!';

    T.post('statuses/update', { status: tweet }, tweeted);

    // Callback for when the tweet is sent
    function tweeted(err, data, response) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success: ' + data.text);
        }
    }
}

function createBar(percent) {
    var yearBar = '';
    for(var i = 5; i < 100; i+= 5) {
        yearBar = (i < percent) ? yearBar + '▓' : yearBar + '░';
    }

    return yearBar
}



