import express, { Router } from 'express';
import { avgGrade, missingSubmissions, overdue, topStudents } from '../controller/analyticsController.js';

const analytics: Router = express.Router();

analytics.get('/topStudents', topStudents);
analytics.get('/avgGrade', avgGrade);
analytics.get('/:id', missingSubmissions);
analytics.get('overdue', overdue);

export default analytics;