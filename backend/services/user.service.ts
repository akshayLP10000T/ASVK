import User from "../schema/user.model";
import { UserTypeDocument } from "../types/user";

interface CreateUserData{
    email: string;
    password: string;
    username: string;
}

export const createUser = async (data: CreateUserData): Promise<UserTypeDocument>=>{
    const { email, password, username } = data;

    if(!email || !password || !username){
        throw new Error("All details are necessary for creating a user");
    }

    const hashedPassword = await User.hashPassword(password);

    let user = await User.create({
        email,
        password: hashedPassword,
        username,
    });

    const userWithoutPassword = await User.findById(user._id);

    return userWithoutPassword!;
}