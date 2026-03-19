import express from 'express';
import { getLibraryStats } from '../controllers/publicController.js';

const router = express.Router();

router.get('/stats', getLibraryStats);

export default router;
