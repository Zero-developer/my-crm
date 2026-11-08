import { Router } from "express";
import {register, login, refresh, logOut} from './auth.controller.js'
import { loginLimiter, refreshLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post('/register', register);

router.post('/login', loginLimiter, login);

router.post('/refresh', refreshLimiter , refresh);

router.post('/logout', logOut);

export default router;