import express from 'express';
import routes from './routes';
import { port } from './config';

const app = express();

app.set('view engine', 'pug')

app.use('/', routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
