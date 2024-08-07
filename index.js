const schedule = require('node-schedule');
const {minuteScript} = require('./minuteScript.js');
const {hourScript} = require('./hourScript.js');

schedule.scheduleJob('* * * * *', minuteScript);

schedule.scheduleJob('0 * * * *', hourScript);

