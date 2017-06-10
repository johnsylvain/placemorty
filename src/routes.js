import express from 'express';
import fs from 'fs';
import sharp from 'sharp';
import {
  appName, db, myCache
} from './config';

const router = express.Router();
const imageFolder = './images/';

function getRandomImage() {
  return new Promise((resolve, reject) => {
    return fs.readdir(imageFolder, (err, files) => {
      if (err) {
        reject(err)
      }
      let images = files
        .filter(file => {
          return !(/(^|\/)\.[^\/\.]/g).test(file)
        });
      resolve(images[Math.floor(Math.random() * images.length)])
    })
  })
}

function cacheImageRequest(image, w, h, type) {
  let key = `${w}x${h}-${type}`;
  myCache.set(key, image, 0)
}

function convertDimensionsToInt(req, res, next) {
  req.params.width = parseInt(req.params.width);
  req.params.height = parseInt(req.params.height);
  next();
};

router.get('/', (req, res) => {

  res.render('index', {
    url: req.protocol + '://' + req.get('host') + req.originalUrl,
    title: appName
  })

});

router.get('/:width/:height', convertDimensionsToInt, (req, res, next) => {
  let { width, height } = req.params;
  if(isNaN(width) || isNaN(height)) {
    res.send(404);
  }

  let cachedImg = myCache.get(`${width}x${height}-c`);

  if(cachedImg) {
    res.set('Content-Type', 'image/png');
    res.send(cachedImg);
  } else {
    getRandomImage().then(image => {
      sharp(imageFolder + image)
      .resize(width, height)
      .png()
      .toBuffer()
      .then(img => {
        cacheImageRequest(img, width, height, 'c');
        res.set('Content-Type', 'image/png');
        res.send(img);
      })
    }).catch(err => console.error(err));
  }


})

router.get('/g/:width/:height', convertDimensionsToInt, (req, res) => {
  let { width, height } = req.params;
  if(isNaN(width) || isNaN(height)) {
    res.send(404);
  }

  let cachedImg = myCache.get(`${width}x${height}-g`);


  if(cachedImg) {
    res.set('Content-Type', 'image/png');
    res.send(cachedImg);
  } else {
    getRandomImage().then(image => {
      sharp(imageFolder + image)
      .resize(width, height)
      .greyscale()
      .png()
      .toBuffer()
      .then(img => {
        cacheImageRequest(img, width, height, 'g');
        res.set('Content-Type', 'image/png');
        res.send(img);
      })
    }).catch(err => console.error(err));
  }

})

export default router;
