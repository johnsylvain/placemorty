import multer from 'multer';
import multerS3 from 'multer-s3';
import fs from 'fs';
import Image from './models/image';
import Analytic from './models/analytic';
import {
  appName, myCache, imageFolder
} from './config/config';
import {
  getRandomImage, cacheImageRequest, convertDimensionsToInt, resizeImage
} from './utils/helpers';


export default function routes(app, passport, s3, client) {

  let upload = multer({
    storage: multerS3({
      s3,
      bucket: 'placemorty',
      acl: 'public-read',
      metadata(req, file, cb) {
        cb(null, Object.assign({}, req.body))
      },
      key(req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })

  //========================
  // Begin Image Upload
  app.post('/upload', isLoggedIn, upload.single('file'), (req, res, next) => {
      let newImage = new Image();
      newImage.meta = req.file;

      newImage.save(err => {
        if (err) console.error(err);
        Image.findOne({ 'meta.key': newImage.meta.key }, (err, obj) => {
          if (err) console.error(err);
          let params = {
            Bucket: obj.meta.bucket,
            Key: obj.meta.key
          }
          s3.getObject(params, (err, d) => {
            let data = JSON.parse(JSON.stringify(d.Body, null, ' ')).data

            obj.data = new Buffer(data);
            obj.save(error => console.error(error))
          })
        })
      })


      res.redirect('/dashboard');
  })
  app.get('/delete/:key', isLoggedIn, (req, res) => {
    Image.findOneAndRemove({ 'meta.key': req.params.key }, function(err, obj) {
      let params = {
        Bucket: obj.meta.bucket,
        Key: obj.meta.key
      }
      s3.deleteObject(params, (error, data) => {
        if (error) return console.error(error);
        myCache.flushAll();
        res.redirect('/dashboard');
      })
    })
  })
  // End Image Upload
  //========================

  //========================
  // Begin Main Routes
  app.get('/', (req, res) => {
    res.render('index', {
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      title: appName,
      footer: true
    })
  });

  app.get('/:t?/:width/:height', convertDimensionsToInt, (req, res) => {
    let { width, height, t } = req.params;
    let type = '';

    if(t == 'g') type = 'b-w';
    else type = 'srgb';

    Analytic.findOneOrCreate(
      {dimensions: `${width}_${height}_${type}`}, 
      {dimensions: `${width}_${height}_${type}`}, 
      (err, doc) => {
        Analytic.findOneAndUpdate({_id: doc._id}, {$inc: {hits : 1}}).exec();
      }
    );

    client.get(`${width}x${height}_${type}`, (error, cachedImg) => {
      if(cachedImg) {
        res.set('Content-Type', 'image/png');
        res.send(cachedImg);
      } else {
        Image.random((err, image) => {
          resizeImage(image.data, width, height, type).then(img => {
            var expTime = 1 * 60 * 60; // expire cached image after 1 hour
            client.setex(`${width}x${height}_${type}`, expTime, img);
            res.set('Content-Type', 'image/png');
            res.send(img);
          }).catch(err => console.error(err))
        })
      }
    })

  });
  // End Main Routes
  //========================


  //========================
  // Begin Authentication
  app.get('/login', (req, res) => {
    res.render('login', {
      title: `Login - ${appName}`,
      footer: false
    })
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

  // app.get('/signup', (req, res) => {
  //   res.render('login', {title: `Login - ${appName}`})
  // });
  //
  // app.post('/signup', passport.authenticate('local-signup', {
  //   successRedirect: '/dashboard',
  //   failureRedirect: '/signup'
  // }))

  app.get('/dashboard', isLoggedIn, (req, res) => {
    Image.find({}, (err, images) => {
      res.render('dashboard', {
        user: req.user,
        title: `Dashboard - ${appName}`,
        footer: true,
        images
      });
    })
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  // End Authentication
  //========================


}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();

  res.redirect('/');
}
