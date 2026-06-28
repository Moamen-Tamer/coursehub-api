import type { Request, Response, NextFunction } from "express";
import type { statusError } from "../model.js";
import { pool } from "../database/pool.js";

export const enroll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.body.course_id) {
            const error = new Error(`course_id is required`) as statusError;
            error.status = 400;

            throw error;
        }

        const db = req.client!;

        const course = await db.query(
            `SELECT title
             FROM courses
             WHERE id = $1`,
            [req.body.course_id]
        );

        if ((course.rowCount ?? 0 ) === 0) {
            const error = new Error(`there's no course with ID: ${req.body.course_id}`) as statusError;
            error.status = 404;

            throw error;
        }

        const enrolled = await db.query(
            `SELECT 1
             FROM enrollments
             WHERE student_id = $1
             AND course_id = $2`,
            [req.user.id, req.body.course_id]
        );

        if ((enrolled.rowCount ?? 0) > 0) {
            const error = new Error(`the student is already enrolled in this course`) as statusError;
            error.status = 409;

            throw error;
        }

        await db.query(
            `INSERT INTO enrollments (tenant_id, student_id, course_id)
             VALUES ($1, $2, $3)`,
            [req.user.tenant_id, req.user.id, req.body.course_id]
        );

        res.status(201).json({
            message: `you have successfully enrolled for ${course.rows[0].title} course`
        });
    } catch (error) {
        next(error);
    }
};

export const myCurrentCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = req.client!;

        const result = await db.query(
            `SELECT c.id, c.instructor_id, c.title, c.description
             FROM courses c
             JOIN enrollments e
             ON c.id = e.course_id
             WHERE e.student_id = $1
             ORDER BY e.enrolled_at DESC`,
            [req.user.id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const unenroll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const courseId = Number(req.params.course_id);

        if (!Number.isInteger(courseId) || courseId <= 0) {
            const error = new Error(`course id should be positive`) as statusError;
            error.status = 400;

            throw error;
        }

        const db = req.client!;

        const course = await db.query(
            `SELECT title
             FROM courses
             WHERE id = $1`,
            [courseId]
        );

        if ((course.rowCount ?? 0 ) === 0) {
            const error = new Error(`there's no course with ID: ${req.params.course_id}`) as statusError;
            error.status = 404;

            throw error;
        }

        const deleted = await db.query(
            `DELETE FROM enrollments
             WHERE student_id = $1
             AND course_id = $2`,
            [req.user.id, courseId]
        );

        if ((deleted.rowCount ?? 0) === 0) {
            const error = new Error(`you are not enrolled in this course`) as statusError;
            error.status = 404;

            throw error;
        }

        res.status(200).json({
            message: `you have successfully unenrolled from ${course.rows[0].title} course`
        });
    } catch (error) {
        next(error);
    }
};