import type { Request, Response, NextFunction } from "express";
import { body, validationResult, type ValidationChain } from "express-validator";
import type { statusError } from "../model.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.accessToken

    if (!token) {
        const error = new Error(`access denied, please log in first`) as statusError
        error.status = 401;

        return next(error);
    }

    jwt.verify(token, env.accessKeySecret, (err: any, user: any) => {
        if (err) {
            if (err.name == "TokenExpiredError") {
                const error = new Error(`token expired, please log in again`) as statusError;
                error.status = 401;
                
                return next(error);
            }

            const error = new Error(`invalid token`) as statusError;
            error.status = 401;
            
            return next(error);
        }

        req.user = user;

        next();
    })
};

export const validateTenantRegisterData: ValidationChain[] = [
    body('name').trim()
                .notEmpty()
                .withMessage(`name is required`)
                .isLength({ min: 3, max: 100 })
                .withMessage(`tenant name must be 3-100 characters`),

    body('slug').trim()
                .notEmpty()
                .withMessage(`slug is required`)
                .isLength({ min: 3, max: 100 })
                .withMessage(`slug must be 3-100 characters`)
                .matches(/^[a-z0-9-]+$/)
                .withMessage(`slug can only contain lowercase letters, numbers, and hyphens`),
];

export const validateTenantAdminRegisterData: ValidationChain[] = [
    body('first_name').trim()
                      .notEmpty()
                      .withMessage(`first name is required`)
                      .isLength({ min: 3, max: 50 })
                      .withMessage(`first name must be 3-50 characters`)
                      .matches(/[a-zA-Z0-9_]+$/)
                      .withMessage(`first name can only contain letters (upper or lower), numbers, and underscores`),

    body('last_name').trim()
                     .notEmpty()
                     .withMessage(`last name is required`)
                     .isLength({ min: 3, max: 50 })
                     .withMessage(`last name must be 3-50 characters`)
                     .matches(/[a-zA-Z0-9_]+$/)
                     .withMessage(`last name can only contain letters (upper or lower), numbers, and underscores`),

    body('email').trim()
                 .isEmail()
                 .withMessage(`invalid email address`)
                 .normalizeEmail(),

    body('password').trim()
                    .notEmpty()
                    .withMessage(`password is required`)
                    .isLength({ min: 5, max: 100 })
                    .withMessage(`password must be 5-100 characters`),
];

export const validateUserRegisterData: ValidationChain[] = [
    body('first_name').trim()
                      .notEmpty()
                      .withMessage(`first name is required`)
                      .isLength({ min: 3, max: 50 })
                      .withMessage(`first name must be 3-50 characters`)
                      .matches(/[a-zA-Z0-9_]+$/)
                      .withMessage(`first name can only contain letters (upper or lower), numbers, and underscores`),

    body('last_name').trim()
                       .notEmpty()
                       .withMessage(`last name is required`)
                       .isLength({ min: 3, max: 50 })
                       .withMessage(`last name must be 3-50 characters`)
                       .matches(/[a-zA-Z0-9_]+$/)
                       .withMessage(`last name can only contain letters (upper or lower), numbers, and underscores`),

    body('email').trim()
                 .isEmail()
                 .withMessage(`invalid email address`)
                 .normalizeEmail(),

    body('password').trim()
                    .notEmpty()
                    .withMessage(`password is required`)
                    .isLength({ min: 5, max: 100 })
                    .withMessage(`password must be 5-100 characters`),

    body('role').trim()
                .notEmpty()
                .withMessage(`role is required`)
                .isIn(['admin', 'instructor', 'student'])
                .withMessage(`role must be admin, instructor, or student`),
];

export const validateUserLoginData: ValidationChain[] = [
    body('email').trim()
                 .isEmail()
                 .withMessage(`invalid email address`)
                 .normalizeEmail(),

    body('password').trim()
                    .notEmpty()
                    .withMessage(`password is required`)
                    .isLength({ min: 5, max: 100 })
                    .withMessage(`password must be 5-100 characters`),
];

export const validationHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    next();
};  
