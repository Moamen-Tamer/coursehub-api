import type { PoolClient } from "pg";

declare global {
    namespace Express {
        interface Request {
            user?: any;
            client?: PoolClient | undefined;
        }
    }
}

export {}
