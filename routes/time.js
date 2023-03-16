const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const today = dayjs().tz('Asia/Seoul');

const last4Hour = today.startOf('day').add(4, 'hour');

const lastweek = today.set('day', 6).startOf('day').add(4, 'hour');

module.exports = {
    last4Hour: (today.get('hour') < 4 ? last4Hour.subtract(1, 'day') : last4Hour).format('YYYY-MM-DD HH:mm:ss'),
    lastweek: (today.get('day') < 6 ? lastweek.subtract(1, 'week') : today.get('hour') < 4 ? lastweek.subtract(1, 'week') : lastweek).format('YYYY-MM-DD HH:mm:ss')
}