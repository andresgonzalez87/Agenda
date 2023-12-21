import { Router } from 'express';
import validateToken from './validate-token';
import { deleteMeeting, getMeetings, newMeeting } from '../controllers/meeting.controller';

const router = Router();

router.get('/',validateToken, getMeetings)
router.post('/newmeeting', validateToken, newMeeting);
router.delete('/:id', validateToken, deleteMeeting);

export default router;