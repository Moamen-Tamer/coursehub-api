import type { Request, Response, NextFunction } from "express";
import type { statusError } from "../model.js";

export const createSubmission = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.body.assignment_id || !req.body.content) {
            const error = new Error(`assignment id and content are required`) as statusError;
            error.status = 400;
            
            throw error;
        }

        const assignmentId = Number(req.body.assignment_id);

        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            const error = new Error(`assignment id must be a positive integer`) as statusError;
            error.status = 400;
        
            throw error;
        }

        const db = req.client!;

        const assignmentExists = await db.query(
            `SELECT 1
             FROM assignments
             WHERE id = $1`,
            [assignmentId]
        );

        if ((assignmentExists.rowCount ?? 0) === 0) {
            const error = new Error(`assignment doesn't exist`) as statusError;
            error.status = 404;
        
            throw error;
        }

        const submissionExists = await db.query(
            `SELECT 1 
             FROM submissions
             WHERE assignment_id = $1
             AND student_id = $2`,
            [assignmentId, req.user.id]
        );

        if ((submissionExists.rowCount ?? 0) > 0) {
            const error = new Error(`submission already exists`) as statusError;
            error.status = 409;
        
            throw error;
        }

        const result = await db.query(
            `INSERT INTO submissions (tenant_id, assignment_id, student_id, content)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.user.tenant_id, assignmentId, req.user.id, req.body.content]
        );

        res.status(201).json({
            message: `submission created successfully`,
            submission: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const getMySubmissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client!;

        const result = await db.query(
            `SELECT s.id AS submission_id,
                    s.assignment_id,
                    a.title AS assignment_title,
                    s.content,
                    s.grade,
                    s.submitted_at
             FROM submissions s
             JOIN assignments a
             ON s.assignment_id = a.id
             WHERE s.student_id = $1
             ORDER BY s.submitted_at DESC`,
            [req.user.id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const getAssignmentSubmissions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const assignmentId = Number(req.params.assignment_id);

        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            const error = new Error(`assignment id must be a positive integer`) as statusError;
            error.status = 400;
        
            throw error;
        }

        const db = req.client!;

        const assignmentExists = await db.query(
            `SELECT 1
             FROM assignments
             WHERE id = $1`,
            [assignmentId]
        );

        if ((assignmentExists.rowCount ?? 0) === 0) {
            const error = new Error(`assignment doesn't exist`) as statusError;
            error.status = 404;
        
            throw error;
        }

        const result = await db.query(
            `SELECT sub.id AS submission_id,
                    assign.title AS assignment_title,
                    course.title AS course_title,
                    sub.student_id,
                    student.first_name || ' ' || student.last_name AS student_name,
                    student.email,
                    sub.content,
                    sub.grade,
                    sub.submitted_at
             FROM submissions sub
             JOIN assignments assign
             ON sub.assignment_id = assign.id
             JOIN users student
             ON sub.student_id = student.id
             JOIN courses course
             ON assign.course_id = course.id
             WHERE sub.assignment_id = $1
             ORDER BY sub.submitted_at DESC`,
            [assignmentId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const gradeSubmission = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const submissionId = Number(req.params.id);

        if (!Number.isInteger(submissionId) || submissionId <= 0) {
            const error = new Error(`submission id must be a positive integer`) as statusError;
            error.status = 400;
        
            throw error;
        }

        const db = req.client!;

        const submissionExists = await db.query(
            `SELECT 1
             FROM submissions
             WHERE id = $1`,
            [submissionId]
        );

        if ((submissionExists.rowCount ?? 0) === 0) {
            const error = new Error(`submission doesn't exist`) as statusError;
            error.status = 404;
        
            throw error;
        }

        const grade = Number(req.body.grade);

        if (!Number.isInteger(grade) || grade < 0 || grade > 100) {
            const error = new Error(`grade must be an integer between 0 and 100`) as statusError;
            error.status = 400;
        
            throw error;
        }

        const result = await db.query(
            `UPDATE submissions
             SET grade = $1
             WHERE id = $2
             RETURNING *`,
            [grade, submissionId]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};