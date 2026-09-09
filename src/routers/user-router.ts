import { Router } from 'express';
import { cUser, getUsers } from '../controllers/users-controller.js';
const userRouter = Router();

userRouter.post('/v1/users', cUser);
userRouter.get('/v1/users', getUsers);
export default userRouter;
