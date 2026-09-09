import { model, Schema } from 'mongoose';

export interface User {
    title?: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    dateOfBirth?: Date;
    passwordHash?: string;
    refreshToken?: string;
    lastLogin?: Date;
}

const userSchema = new Schema<User>(
    {
        title: {
            type: String,
            required: false,
            trim: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true,
            select: false
        },
        refreshToken: {
            type: String,
            required: false,
            select: false
        },
        lastLogin: {
            type: Date,
            required: false
        }
    },
    { timestamps: true }
);

export const UserModel = model<User>('Users', userSchema);