import type { Request, Response, NextFunction } from "express";
import type { statusError } from "../model.js";

export const getAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let sql = `
            SELECT a.id,
                   c.title AS course_title, 
                   a.title AS assignment_title, 
                   a.due_date, 
                   a.created_at
            FROM assignments a
            JOIN courses c
            ON a.course_id = c.id
        `;

        const courseId = req.query.courseId;

        const db = req.client!;

        let result;

        if (courseId !== undefined) {
            const id = Number(courseId);

            if (!Number.isInteger(id) || id <= 0) {
                const error = new Error("courseId must be a positive integer") as statusError;
                error.status = 400;

                throw error;
            }

            sql += `
                WHERE a.course_id = $1
                ORDER BY a.created_at DESC
            `;

            result = await db.query(sql, [id]);
        } else {
            sql += ` ORDER BY a.created_at DESC`;

            result = await db.query(sql);
        }

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const createAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.body.course_id || !req.body.title || !req.body.due_date) {
            const error = new Error(`course_id, title and due_date are required`) as statusError;
            error.status = 400;

            throw error;
        }

        const db = req.client!;

        const courseId = Number(req.body.course_id);

        if (!Number.isInteger(courseId) || courseId <= 0) {
            const error = new Error(`course_id must be a positive integer`) as statusError;
            error.status = 400;
        
            throw error;
        }

        if (!req.body.title.trim()) {
            const error = new Error(`title is required`) as statusError;
            error.status = 400;
                
            throw error;
        }

        if (Number.isNaN(Date.parse(req.body.due_date))) {
            const error = new Error(`due_date must be a valid date`) as statusError;
            error.status = 400;

            throw error;
        }

        const course = await db.query(
            `SELECT 1
             FROM courses
             WHERE id = $1`,
            [courseId]
        );

        if ((course.rowCount ?? 0) === 0) {
            const error = new Error(`there is no course with ID: ${courseId}`) as statusError;
            error.status = 404;

            throw error;
        }

        const created = await db.query(
            `INSERT INTO assignments (tenant_id, course_id, title, due_date)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [req.user.tenant_id, courseId, req.body.title, req.body.due_date]
        );

        res.status(201).json({
            message: "Assignment created successfully.",
            assignmentId: created.rows[0].id
        })
    } catch (error) {
        next(error);
    }
};

export const editAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.params.id) {
            const error = new Error(`assignment id is required`) as statusError;
            error.status = 400;

            throw error;
        }

        const assignmentId = Number(req.params.id);

        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            const error = new Error(`assignment id must be a positive integer`) as statusError;
            error.status = 400;
        
            throw error;
        }

        if (!req.body.title && !req.body.due_date) {
            const error = new Error(`nothing to update`) as statusError;
            error.status = 400;

            throw error;
        }

        const db = req.client!;

        const result = await db.query(
            `UPDATE assignments
             SET title = COALESCE($1, title),
                 due_date = COALESCE($2, due_date)
             WHERE id = $3
             RETURNING *`,
            [req.body.title, req.body.due_date, assignmentId]
        );

        if ((result.rowCount ?? 0) === 0) {
            const error = new Error(`assignment not found`) as statusError;
            error.status = 404;

            throw error;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.params.id) {
            const error = new Error(`assignment id is required`) as statusError;
            error.status = 400;

            throw error;
        }

        const assignmentId = Number(req.params.id);

        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            const error = new Error(`assignment id must be a positive integer`) as statusError;
            error.status = 400;
        
            throw error;
        }

        const db = req.client!;

        const result = await db.query(
            `DELETE FROM assignments
             WHERE id = $1
             RETURNING *`,
            [assignmentId]
        );

        if ((result.rowCount ?? 0) === 0) {
            const error = new Error(`assignment not found`) as statusError;
            error.status = 404;

            throw error;
        }

        res.status(200).json({ 
            message: `assignment of id: ${assignmentId} has been successfully deleted`,
            deletedAssignment: result.rows[0] 
        });
    } catch (error) {
        next(error);
    }
};