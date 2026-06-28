import chalk from "chalk";
import type { Request, Response, NextFunction } from "express";

const methodColor: Record<string, (text: string) => string> = {
    GET: chalk.green,
    POST: chalk.blue,
    PATCH: chalk.magenta,
    PUT: chalk.yellow,
    DELETE: chalk.red
};

export const logger = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const color = methodColor[req.method] ?? chalk.white;

    console.log(
        color(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    );

    next();
};