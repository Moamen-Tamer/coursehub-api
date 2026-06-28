import { pool } from "../database/pool.js";
import type { Request, Response, NextFunction } from "express";
import type { PoolClient } from "pg";

export const setTenantContext = async (
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    let client: PoolClient | undefined;
    let released: boolean = false;

    const releaseClient = async () => {
        if (!client || released) return;

        released = true;

        try {
            if (res.statusCode >= 400) {
                await client.query("ROLLBACK");
            } else {
                await client.query("COMMIT");
            }
        } finally {
            client.release();
            req.client = undefined;
        }
    };

    try {
        client = await pool.connect();
        req.client = client;

        await client.query("BEGIN");
        await client.query(
            `SET LOCAL app.tenant_id = $1`,
            [req.user.tenant_id]
        );

        res.on("finish", () => {
            void releaseClient();
        });

        res.on("close", () => {
            void releaseClient();
        });

        next();
    } catch (error) {
        if (client && !released) {
            released = true;

            try {
                await client.query("ROLLBACK");
            } finally {
                client.release();
                req.client = undefined;
            }
        }

        next(error);
    }
};
