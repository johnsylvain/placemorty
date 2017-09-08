import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import compression from 'compression';
import responseTime from 'response-time';

import configDB from './config/database';
import configPassport from './config/passport';
import s3 from './config/aws';
import { port, client } from './config/config';

require('dotenv').config();

mongoose.connect(configDB.url)
configPassport(passport);
const app = express();

app.use(compression());
app.use(responseTime());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.static('images'));

app.use(session({secret: 'wubbalubbadubdub'}));
app.use(passport.initialize());
app.use(passport.session());

// init routes
require('./api').default(app);
require('./routes').default(app, passport, s3, client);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
