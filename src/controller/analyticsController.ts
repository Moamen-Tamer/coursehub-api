import type { Request, Response, NextFunction } from "express";
import type { statusError } from "../model.js";

export const topStudents = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client!;

        const result = await db.query(
            `SELECT u.first_name || ' ' || u.last_name AS student_name,
                    ROUND(AVG(s.grade), 2) AS avg_grade,
                    COUNT(s.id) AS submissions_graded
             FROM users u
             JOIN submissions s
             ON s.student_id = u.id
             WHERE urole = 'student'
             AND s.grade IS NOT NULL
             GROUP BY u.id, u.first_name, u.last_name
             ORDER BY avg_grade DESC
             LIMIT 10`
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const avgGrade = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client!;

        const result = await db.query(
            `SELECT c.title AS course_title,
                    COUNT(s.id) AS total_submissions,
                    ROUND(AVG(s.grade), 2) AS average_grade
             FROM submissions s
             JOIN courses c
             ON s.course_id = c.id
             WHERE grade IS NOT NULL
             GROUP BY c.id, c.title
             ORDER BY average_grade DESC
             LIMIT 10`
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const missingSubmissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const assignmentId = Number(req.params.id);
        
        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            const error = new Error(`assignment id must be a positive integer`) as statusError;
            error.status = 400;
        
            throw error;
        }

        const db = req.client!;

        const result = await db.query(
            `SELECT u.id,
                    u.first_name || ' ' || u.last_name AS student_name,
                    u.email
             FROM users u
             JOIN enrollments e
             ON u.id = e.student_id
             WHERE e.course_id = (
                SELECT course_id 
                FROM assignments 
                WHERE id = $1
             )
             AND u.role = 'student'
             AND NOT EXISTS (
                SELECT 1
                FROM submissions s
                WHERE s.student_id = u.id
                AND s.assignment_id = $1
             )`,
            [assignmentId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const overdue = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client!;

        const result = await db.query(
            `SELECT a.title AS assignment_title,
                    a.due_date,
                    u.first_name || ' ' || u.last_name AS student_name,
                    CASE 
                        WHEN s.id IS NOT NULL THEN 'submitted'
                        WHEN a.due_date < NOW() THEN 'overdue'
                        ELSE 'pending'
                    END AS status
             FROM assignments a
             JOIN courses c
             ON c.id = a.course_id
             JOIN enrollments e
             ON e.course_id = c.id
             JOIN users u
             ON u.id = e.student_id
             LEFT JOIN submissions s
             ON s.assignment_id = a.id
             AND s.student_id = u.id
             ORDER BY a.due_date, u.first_name`
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};