import {type Response, type Request, type NextFunction } from "express";
import {registerService, loginService} from './auth.service.js'
import { AppError } from "../utils/AppError.js";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        //falta la validacion
        const validRegisterData = req.body;

        const registeredUser = await registerService(validRegisterData);

        res.status(201).json(registeredUser);
    } catch(error) {
        next(error)
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {

        //falta la validacion
        const validLoginData = req.body;

        const loginUser = await loginService(validLoginData);

        res.status(200).json(loginUser);
    } catch(error) {
        next(error)
    }
}