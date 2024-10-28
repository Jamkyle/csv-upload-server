import express from 'express';
import { csvFileMiddleware } from '@/middlewares/csvFileMiddleware';
import { csvFileController } from '@/controllers/csvFileController';

const router = express.Router();

router.post('/upload', csvFileMiddleware, csvFileController);

export default router;