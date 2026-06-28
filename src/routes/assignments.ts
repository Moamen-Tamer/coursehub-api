import express, { Router } from 'express';
import { authorize } from '../middleware/authorization.js';
import { 
    createAssignments, 
    deleteAssignments, 
    editAssignments, 
    getAssignments 
} from '../controller/assignmentsController.js';

const assignment: Router = express.Router();

assignment.get('/', authorize('student'), getAssignments);
assignment.post('/', authorize('admin', 'instructor'), createAssignments);
assignment.patch('/:id', authorize('admin', 'instructor'), editAssignments);
assignment.delete('/:id', authorize('admin', 'instructor'), deleteAssignments);

export default assignment;