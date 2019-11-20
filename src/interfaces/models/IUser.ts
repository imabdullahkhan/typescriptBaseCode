import { Document } from "mongoose";
export interface IUser extends Document {
    admin: boolean;
    firstname: string;
    lastname: string;
    password: string;
    verifyPin: number;
    userStatus: string;
    email: string;
}

export default IUser;
