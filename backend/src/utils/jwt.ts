import jwt from "jsonwebtoken";
import {env} from '../config/env.js'

export type PlayloadData = {
    id: number;
    username: string;
    email: string;
}

export const signAccessToken = (playload: PlayloadData) => {
    return jwt.sign(playload, env.JWT_SECRET, {
        expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET);
}

export const verifyRefreshToken = (refreshToken: string) => {
    return jwt.verify(refreshToken, env.JWT_SECRET_REFRESH);
}

export const signRefreshToken = (playload: PlayloadData) => {
    return jwt.sign(playload, env.JWT_SECRET_REFRESH, {
        expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
}