import { prisma } from "../lib/prisma.js";
import * as argon2 from "argon2";
import { AppError } from "../utils/AppError.js";
import {signAccessToken, signRefreshToken, verifyRefreshToken} from '../utils/jwt.js'
import {createHash} from 'node:crypto'

export type RegisterData = {
    username: string;
    password: string;
    email: string;
};

export type LoginData = {
    email: string;
    password: string;
}

function expiresAtRefreshToken() {
    return new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
}

function hashRefreshToken(token: string) {
    return createHash("sha256")
        .update(token)
        .digest("hex");
}

export async function registerService(data: RegisterData) {
    const userExist = await prisma.user.findFirst({
        where: {
            OR: [
                { username: data.username },
                { email: data.email }
            ]
        }
    });

    if (userExist) {
        if (userExist.username === data.username) {
            throw new AppError("Username already exists", 409);
        }

        if (userExist.email === data.email) {
            throw new AppError("Email already exists", 409);
        }
    }

    const hash = await argon2.hash(data.password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 1
    });

    const user = await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            passwordHash: hash
        },
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true
        }
    });

    return user;
}

export async function loginService(data: LoginData) {
    
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
            deletedAt: null
        },
        select: {
            id: true,
            username: true,
            email: true,
            passwordHash: true
        }
    });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const passwordIsValid = await argon2.verify(
        user.passwordHash,
        data.password
    );

    if (!passwordIsValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = signAccessToken({
        id: user.id,
        username: user.username,
        email: user.email
    });

    const refreshToken = signRefreshToken({
        id: user.id,
        username: user.username,
        email: user.email
    });

    const refreshTokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.create({
        data: {
            tokenHash: refreshTokenHash,
            userId: user.id,
            expiresAt: expiresAtRefreshToken(),
        }
    })

    return {
        accessToken: token,
        refreshToken: refreshToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    }
}

export async function refreshTokenService(refreshToken: string) {

    try {
        verifyRefreshToken(refreshToken);
    } catch {
        throw new AppError("Invalid refresh token", 401);
    }

    const tokenHash = hashRefreshToken(refreshToken);

    const refreshTokenExist = await prisma.refreshToken.findUnique({
        where: {
            tokenHash: tokenHash,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    deletedAt: true
                }
            }
        }
    });

    if (
        !refreshTokenExist ||
        refreshTokenExist.expiresAt <= new Date() ||
        refreshTokenExist.user.deletedAt !== null ||
        refreshTokenExist.revokedAt !== null
    ) {
        throw new AppError("Invalid refresh token", 401);
    }

    const user = refreshTokenExist.user

    const newAccessToken = signAccessToken({
        id: user.id,
        username: user.username,
        email: user.email
    })

    const newRefreshToken = signRefreshToken({
        id: user.id,
        username: user.username,
        email: user.email
    });

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    await prisma.$transaction(async(tx) => {

        const refreshTokenRevoked = await tx.refreshToken.updateMany({

            where: {
                id: refreshTokenExist.id,
                revokedAt: null,
                expiresAt: {
                    gt: new Date()
                }
            },

            data : {
                revokedAt: new Date()
            }
        })

        if (refreshTokenRevoked.count !== 1) {
            throw new AppError("invalid refresh token", 401)
        }

        await tx.refreshToken.create({
            data: {
                tokenHash: newRefreshTokenHash,
                userId: user.id,
                expiresAt: expiresAtRefreshToken(),
            }
        })
    })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }

}

//middleware de autentificacion
//refreshtoken