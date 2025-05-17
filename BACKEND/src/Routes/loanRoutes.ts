// routes/loanRoutes.ts
import express from 'express';
import { authenticateToken } from '../Middlewares/authMiddleware';
import { loanPredictionController } from '../Controllers/loanController';

const router = express.Router();

router.post('/predict', loanPredictionController);

export default router;
