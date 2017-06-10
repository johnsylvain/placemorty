import express from 'express';
import { appName } from './config';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    url: req.protocol + '://' + req.get('host') + req.originalUrl,
    title: appName
  })
})

export default router;
