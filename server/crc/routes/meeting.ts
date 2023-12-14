import { Router } from 'express';
import validateToken from './validate-token';
import { getMeetings } from '../controllers/meeting.controller';

const router = Router();

router.get('/',validateToken, getMeetings)

export default router;