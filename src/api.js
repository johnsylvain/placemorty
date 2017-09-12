import Analytic from './models/analytic';
import moment from 'moment';

export default function(app, passport) {
  app.get('/api/usage', (req, res) => {

    let today = moment().endOf('day');
    let lastWeek = moment(today).subtract(1, 'weeks');

    Analytic.find({
      created_at: { // get last week of usage
        $gte: lastWeek.toDate(),
        $lte: today.toDate()
      }
    }, (err, docs) => {
      if (err) throw err;

      res.json(docs.reverse());
    })
  })
}
