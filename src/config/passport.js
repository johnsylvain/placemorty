import { Strategy } from 'passport-local';
import User from '../models/user';

export default function configPassport(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, username, password, done) => {
    process.nextTick(function() {
      User.findOne({ 'local.username': username }, (err, user) => {

        if (err) return done(err);

        if (user) {
          return done(null, false);
        } else {

          let newUser = new User();

          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(err => {
            if (err) throw err;
            return done(null, newUser)
          })

        }
      })
    })
  }));

  passport.use('local-login', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, username, password, done) {
    User.findOne({'local.username': username}, (err, user) => {
      if (err) return done(err);

      if (!user)
        return done(null, false);

      if (!user.validPassword(password))
        return done(null, false);

      return done(null, user);
    })
  }
  ))
}
