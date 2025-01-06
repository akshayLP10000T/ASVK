import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/context/user.context";

interface MessageProps {
  message: string;
  sender: string;
  username: string;
}

const Message: React.FC<MessageProps> = ({ message, sender, username }) => {
  const {user} = useUser();
  const isUser = sender == user?._id;
"user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 gap-2`}
    >
      {!isUser && (
        <Avatar className="w-7 h-7 border border-zinc-300 dark:border-zinc-700">
          <AvatarImage
            src={`https://api.dicebear.com/5.x/bottts/svg?seed=${username}`}
            alt={sender}
          />
          <AvatarFallback>{sender.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-sm px-3 py-2 rounded-lg text-sm flex flex-col ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
        } shadow-md`}
      >
        <p className={`opacity-75 font-light text-sm w-full ${isUser && "text-end"} mb-2`}>{username}</p>
        <p>{message}</p>
      </div>
      {isUser && (
        <Avatar className="w-7 h-7 border border-zinc-300 dark:border-zinc-700">
          <AvatarImage
            src={`https://api.dicebear.com/5.x/bottts/svg?seed=${username}`}
            alt={sender}
          />
          <AvatarFallback>{sender.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Message;
