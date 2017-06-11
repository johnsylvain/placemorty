import express from 'express';
import {
  appName, myCache
} from './utils/config';
import {
  getRandomImage, cacheImageRequest, convertDimensionsToInt, resizeImage
} from './utils/helpers';

const router = express.Router();

router.get('/', (req, res) => {

  res.render('index', {
    url: req.protocol + '://' + req.get('host') + req.originalUrl,
    title: appName
  })

});

router.get('/:t?/:width/:height', convertDimensionsToInt, (req, res) => {
  let { width, height, t } = req.params;
  let type = '';

  if(t == 'g') type = 'b-w';
  else type = 'srgb';

  let cachedImg = myCache.get(`${width}x${height}_${type}`);

  if(cachedImg) {
    res.set('Content-Type', 'image/png');
    res.send(cachedImg);
  } else {
    getRandomImage().then(image => {
      resizeImage(image, width, height, type).then(img => {
        res.set('Content-Type', 'image/png');
        res.send(img);
      }).catch(err => console.error(err))
    }).catch(err => console.error(err));
  }
});

export default router;
