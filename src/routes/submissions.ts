import express, { Router } from 'express';
import { authorize } from '../middleware/authorization.js';
import { 
    createSubmission, 
    getAssignmentSubmissions, 
    getMySubmissions, 
    gradeSubmission 
} from '../controller/submissionsController.js';

const submission: Router = express.Router();

submission.post('/', authorize('student'), createSubmission);
submission.get('/my_submissions', authorize('student'), getMySubmissions);
submission.get('/:assignmentId', authorize('admin', 'instructor'), getAssignmentSubmissions);
submission.patch('/:id/grade', authorize('admin', 'instructor'), gradeSubmission);

export default submission;