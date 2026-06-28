import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import type { statusError, TokenUser } from "../model.js";
import jwt from "jsonwebtoken";
import { pool, refreshTokens } from "../database/pool.js";
import bcrypt from 'bcrypt';

const accessCookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: 'strict' as const,
    maxAge: 1000 * 60 * 15
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: 'strict' as const,
    maxAge: 1000 * 60 * 60 * 24 * 7
};

const generateAccessToken = (user: TokenUser) => {
    const payload = {
        id: user.id,
        tenant_id: user.tenant_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, env.accessKeySecret, { expiresIn: env.accessKeyExpiry as any });
};

const generateRefreshToken = (user: TokenUser) => {
    const payload = {
        id: user.id,
        tenant_id: user.tenant_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, env.refreshKeySecret, { expiresIn: env.refreshKeyExpiry as any });
};

export const tenantRegister = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const slugExists = await pool.query(
            `SELECT 1 FROM tenants
             WHERE slug = $1`,
            [req.body.slug]
        );

        if ((slugExists.rowCount ?? 0) > 0) {
            const error = new Error(`tenant slug already exists`) as statusError;
            error.status = 409;

            throw error;
        }

        const emailExists = await pool.query(
            `SELECT 1 FROM users
             WHERE email = $1`,
            [req.body.email]
        );

        if ((emailExists.rowCount ?? 0) > 0) {
            const error = new Error(`email already exists`) as statusError;
            error.status = 409;

            throw error;
        }

        const client = await pool.connect();

        try {
            const passwordHash = await bcrypt.hash(req.body.password, 10);

            await client.query('BEGIN');
            
            const tenant = await client.query(
                `INSERT INTO tenants (name, slug)
                 VALUES ($1, $2)
                 RETURNING id`,
                [req.body.name, req.body.slug]
            );

            const tenantId = tenant.rows[0].id;

            const admin = await client.query(
                `INSERT INTO users (tenant_id, first_name, last_name, email, password_hash, role)
                 VALUES ($1, $2, $3, $4, $5, 'admin')
                 RETURNING id`,
                [tenantId, req.body.first_name, req.body.last_name, req.body.email, passwordHash]
            );

            const adminId = admin.rows[0].id;

            await client.query('COMMIT');

            res.status(201).json({ 
                message: "Tenant created successfully",
                tenantId,
                adminId
            });
        } catch (error) {
            await client.query('ROLLBACK');

            next(error);
        } finally {
            client.release();
        }
    } catch (error) {
        next(error);
    }
};

export const userRegister = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password || !req.body.role) {
            const error = new Error(`All fields (first_name, last_name, email, password, role) are required`) as statusError;
            error.status = 400;

            throw error;
        }

        const db = req.client ?? pool;
        const existing = await db.query(
            `SELECT * FROM users
             WHERE email = $1`,
            [req.body.email]
        );

        if ((existing.rowCount ?? 0) > 0) {
            const error = new Error(`user already exists`) as statusError;
            error.status = 409;

            throw error;
        }

        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const result = await db.query(
            `INSERT INTO users (first_name, last_name, email, password_hash, role, tenant_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, first_name, last_name, email, role`,
            [req.body.first_name, req.body.last_name, req.body.email, passwordHash, req.body.role, req.user.tenant_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        if (!req.body.email || !req.body.password) {
            const error = new Error(`All fields (email, password) are required`) as statusError;
            error.status = 400;

            throw error;
        }

        const account = await pool.query(
            `SELECT *
             FROM users
             Where email = $1`,
            [req.body.email]
        );

        if ((account.rowCount ?? 0) === 0) {
            const error = new Error(`invalid email or password`) as statusError;
            error.status = 401;

            throw error;
        }

        const user = account.rows[0];

        const passMatch = await bcrypt.compare(req.body.password, account.rows[0].password_hash);

        if (!passMatch) {
            const error = new Error(`invalid email or password`) as statusError;
            error.status = 401;

            throw error;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        refreshTokens.add(refreshToken);

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        res.status(200).json({
            message: "login successful",
            user: {
                id: user.id,
                tenant_id: user.tenant_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

export const userLogout = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) refreshTokens.delete(refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "logout successful" });
};

export const userRefresh = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken || !refreshTokens.has(refreshToken)) {
        const error = new Error(`invalid refresh token`) as statusError;
        error.status = 401;

        throw error;
    }

    jwt.verify(refreshToken, env.refreshKeySecret, (err: any, user: any) => {
        if (err) {
            const error = new Error(`invalid or expired refresh token`) as statusError;
            error.status = 401;

            throw error
        }

        const accessToken = generateAccessToken(user);

        res.cookie("accessToken", accessToken, accessCookieOptions);

        res.status(200).json({ message: "token has been refreshed" });
    });
};

export const authStatus = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    res.json({
        message: "user authenticated",
        user: req.user
    });
};
