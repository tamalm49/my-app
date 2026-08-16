import { Router } from 'express';
import { getAiResponse, streamChat } from '../controllers/ai-controller.js';
const aiRouter = Router();

aiRouter.post('/stream', streamChat);
aiRouter.post('/generate', getAiResponse);
export default aiRouter;
