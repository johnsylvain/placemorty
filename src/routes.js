import express from 'express';
import fs from 'fs';
import { appName, db } from './config';
import sharp from 'sharp';

const router = express.Router();
const imageFolder = './images';

function getRandomImage() {
  return new Promise((resolve, reject) => {
    return fs.readdir(imageFolder, (err, files) => {
      if (err) {
        reject(err)
      }
      let image = files
        .filter(file => {
          return !(/(^|\/)\.[^\/\.]/g).test(file)
        })[Math.floor(Math.random() * files.length)];
      resolve(image)
    })
  })
}

router.get('/', (req, res) => {

  res.render('index', {
    url: req.protocol + '://' + req.get('host') + req.originalUrl,
    title: appName
  })

});

router.get('/:width/:height', (req, res) => {
  let { width, height } = req.params;
  width = parseInt(width, 10);
  height = parseInt(height, 10);
  if(isNaN(width) || isNaN(height)) {
    res.send(404);
  }

  getRandomImage().then(image => {
    sharp('./images/' + image)
      .resize(width, height)
      .png()
      .toBuffer()
      .then(img => {
        res.set('Content-Type', 'image/png');
        res.send(img);
      })
  }).catch(err => console.error(err));

})

router.get('/g/:width/:height', (req, res) => {
  let { width, height } = req.params;
  width = parseInt(width, 10);
  height = parseInt(height, 10);
  if(isNaN(width) || isNaN(height)) {
    res.send(404);
  }

  getRandomImage().then(image => {
    sharp('./images/' + image)
      .resize(width, height)
      .greyscale()
      .png()
      .toBuffer()
      .then(img => {
        res.set('Content-Type', 'image/png');
        res.send(img);
      })
  }).catch(err => console.error(err));
})

export default router;
