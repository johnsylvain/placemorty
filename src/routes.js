import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import mime from 'mime';
import Image from './models/image';
import {
  appName, myCache, imageFolder
} from './config/config';
import {
  getRandomImage, cacheImageRequest, convertDimensionsToInt, resizeImage
} from './utils/helpers';

let upload = multer({ dest: 'images/' });

export default function routes(app, passport) {

  //========================
  // Begin Image Upload
  app.post('/upload', isLoggedIn, upload.single('file'), (req, res, next) => {
      let newImage = new Image();

      newImage.fileName = req.file.filename;
      newImage.save(err => {
        if (err) console.error(err);
      })

      res.redirect('/dashboard');
  })
  app.get('/delete/:fileId', isLoggedIn, (req, res) => {
    Image.find({ fileName: req.params.fileId }).remove(function() {
      fs.unlink(imageFolder + req.params.fileId, () => {
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

    let cachedImg = myCache.get(`${width}x${height}_${type}`);

    if(cachedImg) {
      res.set('Content-Type', 'image/png');
      res.send(cachedImg);
    } else {
      Image.random((err, image) => {
        resizeImage(image.fileName, width, height, type).then(img => {
          res.set('Content-Type', 'image/png');
          res.send(img);
        }).catch(err => console.error(err))
      })
    }
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
