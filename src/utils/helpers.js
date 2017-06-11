import sharp from 'sharp';
import fs from 'fs';
import { imageFolder, myCache } from './config';

export function getRandomImage() {
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

export function cacheImageRequest(image, w, h, t) {
  let key = `${w}x${h}_${t}`;
  myCache.set(key, image, 0)
}

export function convertDimensionsToInt(req, res, next) {
  req.params.width = parseInt(req.params.width);
  req.params.height = parseInt(req.params.height);
  let { width, height } = req.params;
  if(isNaN(width) || isNaN(height)) {
    res.send(404);
  }
  next();
};

export function resizeImage(i, w, h, type) {
  return new Promise((resolve, reject) => {
    return sharp(imageFolder + i)
      .resize(w, h)
      .toColourspace(type)
      .png()
      .toBuffer()
      .then(img => {
        cacheImageRequest(img, w, h, type);
        resolve(img)
      })
      .catch(err => reject(err))
  })
}
