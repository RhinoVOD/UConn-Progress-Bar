const config    = require('./config.js');
const Twit      = require('twit');
const CronJob   = require('cron').CronJob;
const T = new Twit(config);

const days = 112;
const oneDay = 1000 * 60 * 60 * 24; //milliseconds in a day

const now = new Date();
const semesterEnd = new Date('December 15, 2019, 16:00:00');

const diff = now - semesterEnd;
const currentDay = Math.floor(diff/oneDay);
const currentPercent = currentDay / days * 100; //Calculate percentage of days passed


//Cronjob to initiate SendTweet function at 8 AM every day
new CronJob('0 08 * * *', function() {
    SendTweet(currentPercent, barStyle);
}, null, true, 'UTC');

//Create and post the progress tweet
function SendTweet(currentPercent) {
    const tweet = CreateBar(currentPercent) + ' ' + currentPercent.toFixed(2) + '% of the UConn semester has passed!';

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

/**
 * @return {string}
 */
function CreateBar(percent) {
    let yearBar = '';
    for(let i = 5; i < 100; i+= 5) {
        yearBar = (i < percent) ? yearBar + '▓' : yearBar + '░';
    }

    return yearBar
}



