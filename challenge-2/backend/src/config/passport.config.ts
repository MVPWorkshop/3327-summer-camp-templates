import passport from 'passport';
import passportLocal from 'passport-local';
import { AuthenticationError } from '../utils/errors.util';
import AuthService from '../services/auth.service';
import { deserializeWeb3Payload } from '../utils/auth.util';
import { IUserEntity, mapUserEntity } from '../entities/user.entity';

const LocalStrategy = passportLocal.Strategy;

// serializeUser determines which data of the user object should be stored in the session.
passport.serializeUser((user: IUserEntity, done) => {
  done(undefined, user);
});

// Used to retrieve the object from the session. That data will be filled in req.user
passport.deserializeUser(async (user: IUserEntity, done) => {
  if (user) {
    return done(undefined, user);
  } else {
    return done(new AuthenticationError(), undefined);
  }
});

async function authenticate(signature: string, payload: string, done: any) {
  try {
    const user = await AuthService.login(deserializeWeb3Payload(payload), signature);

    return done(undefined, mapUserEntity(user));
  } catch (error) {
    return done(new AuthenticationError(), undefined);
  }
}

const strategy = new LocalStrategy({
  usernameField: 'signature',
  passwordField: 'payload'
}, authenticate);

passport.use(strategy);
