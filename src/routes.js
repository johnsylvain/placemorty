import {
  appName, myCache
} from './utils/config';
import {
  getRandomImage, cacheImageRequest, convertDimensionsToInt, resizeImage
} from './utils/helpers';

export default function routes(app, passport) {
  app.get('/', (req, res) => {

    res.render('index', {
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      title: appName
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
      getRandomImage().then(image => {
        resizeImage(image, width, height, type).then(img => {
          res.set('Content-Type', 'image/png');
          res.send(img);
        }).catch(err => console.error(err))
      }).catch(err => console.error(err));
    }
  });

  app.get('/login', (req, res) => {
    res.render('login', {title: `Login - ${appName}`})
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

  app.get('/signup', (req, res) => {
    res.render('login', {title: `Login - ${appName}`})
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
  }))

  app.get('/dashboard', isLoggedIn, (req, res) => {
    res.render('dashboard', {
      user: req.user,
      title: `Dashboard - ${appName}`
    });
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })

}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();

  res.redirect('/');
}
