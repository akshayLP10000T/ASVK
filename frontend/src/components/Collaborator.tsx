import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProps {
  user: {
    username: string;
    email: string;
    _id: string;
  };
}

const Collaborator: React.FC<UserProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-4 p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
      <Avatar className="w-12 h-12 border border-zinc-300 dark:border-zinc-700">
        <AvatarImage
          src={`https://api.dicebear.com/5.x/bottts/svg?seed=${user.username}`}
          alt={user.username}
        />
        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <p className="font-medium text-zinc-800 dark:text-zinc-100">
          {user.username}
        </p>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{user.email}</p>
      </div>
    </div>
  );
};

export default Collaborator;
