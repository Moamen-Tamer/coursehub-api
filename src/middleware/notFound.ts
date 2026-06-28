import type { Request, Response, NextFunction } from "express";
import type { statusError } from "../model.js";

export const notFound = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const error = new Error(`route: "${req.originalUrl}" not found`) as statusError;
    error.status = 404;

    next(error);
};