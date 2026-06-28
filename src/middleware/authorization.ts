import type { Request, Response, NextFunction } from "express";
import type { statusError, UserRole } from "../model.js";

export const authorize = (...allowedRoles: UserRole[]) => (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (!req.user) {
        const error = new Error(`authentication required`) as statusError;
        error.status = 401;

        return next(error);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        const error = new Error(`you do not have permission to perform this action`) as statusError;
        error.status = 403;

        return next(error);
    }

    next();
};
