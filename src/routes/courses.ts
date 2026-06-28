import express, { Router } from 'express';
import { 
    createCourse, 
    deleteCourse, 
    editCourse, 
    getAllCourses, 
    getCourseById, 
    getCourseEnrollmentCounts 
} from '../controller/coursesController.js';
import { authorize } from '../middleware/authorization.js';

const course: Router = express.Router();

course.get('/', getAllCourses);
course.get('/enrollment_counts', getCourseEnrollmentCounts);
course.get('/:id', getCourseById);
course.post('/', authorize('admin', 'instructor'), createCourse);
course.patch('/:id', authorize('admin', 'instructor'), editCourse);
course.delete('/:id', authorize('admin'), deleteCourse);

export default course;
