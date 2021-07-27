import { Router } from 'express';
import StatusRoute from './routes/status.route';
import { error } from './middlewares/error.middleware';
import AuthRoute from './routes/auth.route';
import { isAuthenticated } from './middlewares/authenticated.middleware';
import AuthValidator from './validators/auth.validator';
import SubscriptionValidator from './validators/subscription.validator';
import SubscriptionRoute from './routes/subscription.route';

const v1 = Router();

v1.get('/status', StatusRoute.getStatus);

// Auth
v1.post('/register', AuthValidator.validatePostRegister, AuthRoute.register);
v1.post('/login', AuthValidator.validatePostLogin, AuthRoute.login);
v1.post('/logout', isAuthenticated, AuthRoute.logout);
v1.get('/me', isAuthenticated, AuthRoute.me);

// Subscriptions
v1.post('/subscriptions/create', isAuthenticated, SubscriptionValidator.validatePostCreateSubscription, SubscriptionRoute.createSubscription);
v1.put('/subscriptions/cancel', isAuthenticated, SubscriptionRoute.cancelSubscription);

v1.use(error);

export default v1;
