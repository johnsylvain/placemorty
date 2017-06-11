import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import { port } from './utils/config';

const app = express();

app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'))

app.use('/', routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
