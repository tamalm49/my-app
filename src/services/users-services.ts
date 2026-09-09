import type { CreateUserInput } from '../types/user-type.js';
import { UserModel, type User } from '../models/user-model.js';
import { hashPassword } from '../utils/passwordUtility.js';
export const createUser = async (data: CreateUserInput): Promise<string> => {
    const hashedPassword = await hashPassword(data.password);
    const userData: User = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: hashedPassword
    }
    const user = await UserModel.create(userData);
    return `User Id ${user._id} created successfully.`;
}