const express = require('express');
const router = express.Router();


///////
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
//////

const { closersdb } = require('./mysql');

/* GET home page. */
router.post('/', async (req, res) => {
  const dateUtil = new DateUtil()
  console.log(req.body.accountName)
  const data = await closersdb(`SELECT * FROM characters`)
  // res.send(data)
  console.log(`현재 시간 : ${dateUtil.getToday()}`);
  console.log(`일일 초기화 시간 : ${dateUtil.getLast4Hour()}`);
  console.log(`주간 초기화 시간 : ${dateUtil.getLastWeek()}`);
  await closersdb(`DELETE FROM record WHERE time < '${dateUtil.getLast4Hour()}' AND dungeon IN (SELECT name FROM dungeons WHERE is_week = 0 and is_raid = 0)`);
  await closersdb(`DELETE FROM record WHERE time < '${dateUtil.getLastWeek()}' AND dungeon IN (SELECT name FROM dungeons WHERE is_week = 1 or is_raid = 1)`);
  res.send(data
      .sort((a, b) => {
          const p_rank = {
              '결전요원': 3,
              '결사대원': 3,
              '그림자요원': 3,
              '태스크포스': 2,
              '특수요원': 1,
              '특수대원': 1,
              '해결사': 1
          };
          if (b.level !== a.level) return b.level - a.level;
          if (p_rank[b.promotion] !== p_rank[a.promotion]) return p_rank[b.promotion] - p_rank[a.promotion];
          return b.combat - a.combat;
      })
      )
      
})

router.post('/db', async (req, res) => {
  const { name } = req.body
  res.send(await closersdb(`SELECT * FROM characters WHERE nickname = '${name}'`))
});

router.post('/db/check', async (req, res) => {
  const { name } = req.body
  res.send(await closersdb(`SELECT * FROM record WHERE \`character\` = '${name}'`))
});

router.post('/db/check/daily', async (req, res) => {
  const row = await closersdb(`SELECT * FROM record WHERE dungeon = '형상 복제자 저지 작전' or dungeon = '무한 엘리베이터'`)
  if (!row) res.sendStatus(500)
  res.send([row.filter(r => r.dungeon == '형상 복제자 저지 작전'), row.filter(r => r.dungeon == '무한 엘리베이터')]);
});

router.post('/db/check/write', async (req, res) => {
  const { name, dungeon } = req.body
  const row = await closersdb(`INSERT INTO record (\`character\`, dungeon) VALUES ('${name}', '${dungeon}')`)
  row ? res.sendStatus(200) : res.sendStatus(500)
});

router.post('/db/check/raid', async (req, res) => {
  const dateUtil = new DateUtil()
  const { name } = req.body
  const row = await closersdb(`SELECT * FROM record WHERE \`character\` = '${name}' AND dungeon IN (SELECT name FROM dungeons WHERE is_raid = 1)`)
  const count = [row.filter(r => r.dungeon == '기계왕 벨페고르'), row.filter(r => r.dungeon == '야수왕 베히모스')]
  row ? res.send({data : count, time: dateUtil.getLast4Hour()}) : res.sendStatus(500)
});

module.exports = router;
