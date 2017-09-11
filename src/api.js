import Analytic from './models/analytic';
import moment from 'moment';

export default function(app, passport) {
  app.get('/api/usage', (req, res) => {

    let today = moment().endOf('day');
    let lastWeek = moment(today).subtract(1, 'weeks');

    function dayOfWeekAsString(dayIndex) {
      return ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][dayIndex];
    }

    Analytic.find({
      created_at: { // get last week of usage
        $gte: lastWeek.toDate(),
        $lte: today.toDate()
      }
    }, (err, docs) => {
      if (err) throw err;

      let result = docs.reduce((acc, cur) => {
        if (acc[moment(cur.created_at).day()])
          acc[dayOfWeekAsString(moment(cur.created_at).day() - 1)] += cur.hits
        else
          acc[dayOfWeekAsString(moment(cur.created_at).day() - 1)] = cur.hits;

        return acc;
      }, {});

      res.json(result);
    })
  })
}
