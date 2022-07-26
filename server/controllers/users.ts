import {Request, Response, NextFunction} from "express";
import UserModel from '../models/user';
import {UserDocument} from "../types/user.interface";
import {Error} from 'mongoose';
import jwt from 'jsonwebtoken';
import {SECRET} from "../config";

const normalizeUser = (user: UserDocument) => {
    const token = jwt.sign({
        id: user.id,
        email: user.email
    }, SECRET);

    return {
        email: user.email,
        username: user.username,
        id: user.id,
        token: token
    }
}

export const register = async (
    request: Request,
    response: Response,
    next: NextFunction) => {
    try {
        const newUser = new UserModel({
            email: request.body.email,
            username: request.body.username,
            password: request.body.password
        });
        console.log('newUser: ', newUser);
        const savedUser = await newUser.save();
        response.send(normalizeUser(savedUser));
    } catch (err) {
        if (err instanceof Error.ValidationError) {
            const messages = Object.values(err.errors).map(err => err.message);
            return response
                .status(422)
                .json(messages);
        }
        next(err as Error);
    }
}
