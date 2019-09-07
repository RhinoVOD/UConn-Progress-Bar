const config = require('./config.js')
const Twit = require('twit')
const CronJob = require('cron').CronJob
const T = new Twit(config)

/**
 * Creates a CronJob to run the program at 8 AM, every day.
 */
const CreateCronJob = new CronJob('0 11 * * *', function () {
  SendTweet()
}, null, true, 'EST')

/**
 * Creates the Tweet used for progressing the bar.
 */
function CreateTweet () {
  const maxDays = 112
  const oneDay = 1000 * 60 * 60 * 24
  const semesterEndDate = new Date('December 15, 2019, 16:00:00')
  const currentDate = new Date()

  const remainingTime = currentDate - semesterEndDate
  const currentDay = Math.floor(remainingTime / oneDay)
  const currentPercent = 100 + currentDay / maxDays * 100
  return `${CreateBar(currentPercent)} ${currentPercent.toFixed(2)}% of the UConn semester has passed!`
}

/**
 * Generates the bar used for progression.
 */
function CreateBar (percent) {
  let yearBar = ''
  for (let i = 5; i < 100; i += 5) {
    yearBar = (i < percent) ? yearBar + '▓' : yearBar + '░'
  }

  return yearBar
}

/**
 * Sends the Tweet off to Twitter to be posted.
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

CreateCronJob()
