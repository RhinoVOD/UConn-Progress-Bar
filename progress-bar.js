const config = require('./config.js')
const Twit = require('twit')
const CronJob = require('cron').CronJob
const T = new Twit(config)

/**
 * A CronJob to run the program at 11 AM every Monday, Wednesday, and Friday
 */
new CronJob('0 11 * * 1,3,5', function () {
  SendTweet()
}, null, true, 'EST')

/**
 * Creates the next progress tweet to be posted
 * maxDays: Days between the start and end day
 * semesterEndDate: Final day of the semester
 */
function CreateTweet () {
  const maxDays = 98
  const oneDay = 1000 * 60 * 60 * 24
  const semesterEndDate = new Date('December 7, 2020, 11:00:00')
  const currentDate = new Date()

  const remainingTime = currentDate - semesterEndDate
  const currentDay = Math.floor(remainingTime / oneDay)
  const currentPercent = 100 + currentDay / maxDays * 100
  return `${CreateBar(currentPercent)} ${currentPercent.toFixed(2)}% of the UConn semester has passed!`
}

/**
 * Creates the progress bar
 */
function CreateBar (percent) {
  let yearBar = ''
  for (let i = 5; i < 100; i += 5) {
    yearBar = (i < percent) ? yearBar + '▓' : yearBar + '░'
  }

  return yearBar
}

/**
 * Sends the Tweet to Twitter to be posted
 */
function SendTweet () {
  const tweet = CreateTweet()
  T.post('statuses/update', { status: tweet }, tweeted)

  // Callback for when the tweet is sent
  function tweeted (err, data, response) {
    if (err) {
      console.log(err)
    } else {
      console.log('Success: ' + data.text)
    }
  }
}
