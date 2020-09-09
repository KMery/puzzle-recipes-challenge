import { MiddlewareFn } from "type-graphql";
import * as jwt from "jsonwebtoken";

import CONFIG from "../config";
import { MyContext } from './myContext';

export const checkJWT: MiddlewareFn<MyContext> = async ({ context }, next) => {
    const bearerHeader = context.req.headers["authorization"] || "";        
    if (!bearerHeader) {
        throw new Error("Not authenticated");
    }
    try {
        const SECRET_KEY = CONFIG.SECRET_KEY;
        const token = (<string>bearerHeader).split(' ')[1];
        let payload = <any>jwt.verify(token, SECRET_KEY);
        context.payload = payload as any;
    } catch (error) {
        console.log(error);
        throw error;
    }
    return next();
}