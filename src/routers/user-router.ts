import { Router } from 'express';
import { getUsers } from '../controllers/users-controller.js';
const userRouter = Router();

userRouter.get('/users', getUsers);
export default userRouter;