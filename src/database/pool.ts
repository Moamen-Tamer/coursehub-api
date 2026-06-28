import pg, { Pool } from 'pg';
import { env } from '../config/env.js';
import chalk from 'chalk';

pg.types.setTypeParser(1700, (val) => parseFloat(val));

export const pool: Pool = new Pool({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbDatabase,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.on("error", (error) => {
    console.error(chalk.red(`unexpected error on idle client`), error);
});

process.on("SIGINT", async () => {
    try {
        await pool.end();
    } finally {
        process.exit(0);
    }
});

export const refreshTokens = new Set();