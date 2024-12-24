export interface User{
    email: string;
    username: string;
    _id: string;
    __v: number;
}

export interface UserContextType{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}