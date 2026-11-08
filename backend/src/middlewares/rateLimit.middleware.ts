import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        message: "Too many login attempts. Try again later."
    }
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        message: "Too many login attempts to refresh token. Try again later."
    }
})