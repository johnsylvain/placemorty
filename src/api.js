import Analytic from './models/analytic';

export default function(app, passport) {
  app.get('/api/usage', (req, res) => {
    Analytic.find({}, (err, docs) => {
      if (err) throw err;
      res.json(docs);
    })
  })
}
