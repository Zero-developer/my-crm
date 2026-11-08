import {z} from 'zod'

export const loginSchema = z.object({
    email: z.string().trim().email().max(254).min(8),
    password: z.string().min(1, "Password is required")
})

export const registerSchema = z.object({
    username: z.string().trim().min(2, 'username is too short'),
    email: z.string().trim().email().max(254).min(8),
    password:  z.string().min(1, "Password is required")
})

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'refreshToken is required')
})

export type loginData = z.infer<typeof loginSchema>

export type registerData = z.infer<typeof registerSchema>

