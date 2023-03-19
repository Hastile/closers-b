const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

class DateUtil {
  constructor() {
    this.today = dayjs().tz('Asia/Seoul');
    this.last4Hour = this.today.startOf('day').add(4, 'hour');
    this.lastweek = this.today.set('day', 6).startOf('day').add(4, 'hour');
  }

  getToday() {
    return this.today.format('YYYY-MM-DD HH:mm:ss');
  }

  getLast4Hour() {
    const last4Hour = this.today.startOf('day').add(4, 'hour');
    return (this.today.get('hour') < 4 ? last4Hour.subtract(1, 'day') : last4Hour).format('YYYY-MM-DD HH:mm:ss');
  }

  getLastWeek() {
    const lastWeek = this.today.set('day', 6).startOf('day').add(4, 'hour');
    return (this.today.get('day') < 6 ? lastWeek.subtract(1, 'week') : this.today.get('hour') < 4 ? lastWeek.subtract(1, 'week') : lastWeek).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = new DateUtil();
