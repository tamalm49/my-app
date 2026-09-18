import { Router } from 'express'
import { callbackHandler, login, logout } from '../controllers/auth-controller.js';

const authRouter = Router();

authRouter.get('/login', login);
authRouter.get('/v1/sso/redirect', callbackHandler);
authRouter.get('/logout', logout);
export default authRouter;

