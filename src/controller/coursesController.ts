import type { Request, Response, NextFunction } from "express";
import { pool } from "../database/pool.js";
import type { statusError } from "../model.js";

export const getAllCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const db = req.client ?? pool;
    const result = await db.query(
        `SELECT * FROM courses`
    );

    res.status(200).json(result.rows);
};

export const getCourseById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client ?? pool;
        const courseId = Number(req.params.id);

        if (!Number.isInteger(courseId)) {
            const error = new Error("invalid course id") as statusError;
            error.status = 400;

            throw error;
        }

        const result = await db.query(
            `SELECT c.id,
                    c.title,
                    c.description,
                    c.created_at,
                    u.id AS instructor_id,
                    u.first_name AS instructor_first_name,
                    u.last_name AS instructor_last_name,
                    u.email AS instructor_email
             FROM courses c
             LEFT JOIN users u ON u.id = c.instructor_id
             WHERE c.id = $1`,
            [courseId]
        );

        if (result.rowCount === 0) {
            const error = new Error("course not found") as statusError;
            error.status = 404;

            throw error;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const getCourseEnrollmentCounts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const db = req.client ?? pool;
    const result = await db.query(
        `SELECT c.id, c.title, COUNT(e.student_id) AS student_count
         FROM courses c
         LEFT JOIN enrollments e 
         ON e.course_id = c.id
         GROUP BY c.id, c.title
         ORDER BY student_count DESC`
    );

    res.status(200).json(result.rows);
};

export const createCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client ?? pool;

        if (!req.body.title) {
            const error = new Error(`course title is required`) as statusError;
            error.status = 400;

            throw error;
        }

        const result = await db.query(
            `INSERT INTO courses (title, description, tenant_id)
             VALUES ($1, $2, $3)
             RETURNING title, description, created_at`,
            [req.body.title, req.body.description, req.user.tenant_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const editCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client ?? pool;
        const result = await db.query(
            `UPDATE courses
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description)
             WHERE id = $3
             RETURNING title, description, created_at`,
            [req.body.title, req.body.description, Number(req.params.id)]
        );

        if (result.rows.length === 0) {
            const error = new Error(`course not found`) as statusError;
            error.status = 404;

            throw error;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client ?? pool;
        const result = await db.query(
            `DELETE FROM courses
             WHERE id = $1
             RETURNING *`,
            [Number(req.params.id)]
        );

        if (result.rowCount === 0) {
            const error = new Error(`course not found`) as statusError;
            error.status = 404;

            throw error;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};
