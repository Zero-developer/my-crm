import 'dotenv/config';
import {z} from 'zod'
import { AppError } from '../utils/AppError.js';

export const envSchema = z.object({
    JWT_SECRET: z.string().trim().min(32, 'JWT_SECRET must have 32 characters'),
    JWT_SECRET_REFRESH: z.string().trim().min(32, 'JWT_SECRET_REFRESH must have 32 characters'),
    JWT_ACCESS_TOKEN_EXPIRES_IN: z.enum(['5m', '15m', '30m', '1h']).default('15m'),
    JWT_REFRESH_TOKEN_EXPIRES_IN: z.enum(['1d', '3d', '7d']).default('1d')
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
    const errors = envParsed.error.issues.map((i) => {
        return `${i.path.join('.')}:  ${i.message}`
    }).join('\n');

    throw new Error(`Invalid enviroment configuration: \n ${errors}`);
}

export type envSchemaType = z.infer<typeof envSchema>;

export const env: Readonly<envSchemaType> = Object.freeze(envParsed.data);
