import express, { Router } from 'express';
import { 
    enroll, 
    myCurrentCourses, 
    unenroll 
} from '../controller/enrollmentsController.js';

const enrollment: Router = express.Router();

enrollment.get('/my_courses', myCurrentCourses);
enrollment.post('/', enroll);
enrollment.delete('/:course_id', unenroll);

export default enrollment;