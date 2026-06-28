import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (!error.status) {
        res.status(500).json({ message: error.message });
        
        return;
    }

    res.status(error.status).json({ message: error.message });
};