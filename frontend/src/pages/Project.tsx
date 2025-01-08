import { useParams } from "react-router-dom";
import axios from "@/config/axios";
import { useEffect, useRef, useState } from "react";
import { ProjectType } from "@/types/project";
import DraggableBox from "@/components/DraggableBox";
import { User } from "@/types/user";
import { ModeToggle } from "@/components/toggleMode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Message from "@/components/Message";
import AddUserDialog from "@/components/AddUserDialog";
import { initializeSocket, receiveMessage, sendMessage } from "@/config/socket";
import { useUser } from "@/context/user.context";
import CodeBlock from "@/components/CodeBlock";
import Markdown from "markdown-to-jsx";
import { LucideCross } from "lucide-react";

interface Message {
  sender?: string;
  username?: string;
  message?: any;
}

const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectType | null>();
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [addUserDialog, setAddUserDialog] = useState<boolean>(false);
  const { user } = useUser();
  const [fileTree, setFileTree] = useState<any>({
    "app.js": {
      content: "const express = require('express');",
    },
    "package.json": {
      content: `
        {"name": "temp-server"}
      `,
    },
  });
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[] | []>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getProjectData = async () => {
      await axios
        .get(`/projects/get-project/${projectId}`)
        .then((res: any) => {
          setProject(res.data.project);
          setCollaborators(res.data.project.users);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };

    getProjectData();
  }, [setProject, projectId]);

  useEffect(() => {
    const socket = initializeSocket(projectId!);

    const handleIncomingMessage = (data: any) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) => msg.sender === data.sender && msg.message === data.message
        );
        if (isDuplicate) return prev;

        if (data.sender === "AI" && data.username === "ASVK") {
          const messageObject = JSON.parse(data?.message);
          const markdown = (
            <Markdown
              children={messageObject?.text}
              options={{
                overrides: {
                  code: CodeBlock,
                },
              }}
            />
          );
          console.log(messageObject);
          return [
            ...prev,
            {
              sender: data?.sender,
              username: data?.username,
              message: markdown,
            },
          ];
        }

        return [...prev, data];
      });
    };

    receiveMessage("project-message", handleIncomingMessage);

    return () => {
      socket.off("project-message", handleIncomingMessage);
    };
  }, [projectId]);

  const sendMessageHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() === "") return;

    sendMessage("project-message", {
      message,
      sender: user?._id,
      username: user?.username,
    });

    setMessages((prev) => [
      ...prev,
      {
        message,
        sender: user?._id,
        username: user?.username,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="overflow-hidden w-full h-screen bg-gray-200 dark:bg-gray-800 py-3 px-2">
      <DraggableBox key={project?._id} users={collaborators} />
      <div className="absolute right-3 top-3">
        <ModeToggle />
      </div>
      <div className="flex w-full h-full">
        <div className="min-w-96 flex flex-col px-3 py-2 bg-gray-100 dark:bg-gray-900 shadow-md rounded-md">
          <div className="w-full h-fit py-3 px-5 flex items-center gap-3 justify-between">
            <div>
              <Avatar className="w-12 h-12 border border-zinc-300 dark:border-zinc-700">
                <AvatarImage
                  src={`https://api.dicebear.com/5.x/bottts/svg?seed=${project?.name}`}
                  alt={project?.name}
                />
                <AvatarFallback>
                  {project?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-extrabold text-xl">{project?.name}</h2>
            </div>
            <AddUserDialog
              collaborators={project?.users!}
              setProject={setProject}
              projectId={project?._id!}
              open={addUserDialog}
              setOpen={setAddUserDialog}
            />
          </div>
          <Separator />
          <div className="flex-1 py-3 glex-col flex-grow space-y-2 overflow-y-auto">
            {messages.map((msg: any, key: number) => (
              <Message
                key={key}
                message={msg?.message}
                username={msg?.username}
                sender={msg?.sender}
              />
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          <form className="flex gap-2">
            <Input
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
            />
            {message.trim() !== "" && (
              <Button onClick={sendMessageHandler} type="submit">
                Send
              </Button>
            )}
          </form>
        </div>
        <div className="flex-1 flex gap-2">
          {fileTree && (
            <div className="w-64 h-full px-3 py-5 bg-gray-100 dark:bg-gray-900 rounded-md ml-2 shadow-md text-xl flex flex-col gap-3">
              {Object.keys(fileTree).map((fileName: string, index: number) => (
                <div
                  onClick={() => {
                    setCurrentFile(fileName);
                    setOpenFiles([...new Set([...openFiles, fileName])]);
                  }}
                  key={index}
                  className="py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors duration-100 cursor-pointer"
                >
                  {fileName}
                </div>
              ))}
            </div>
          )}
          {currentFile && (
            <div className="flex-1 rounded-md dark:bg-gray-900 bg-zinc-100 shadow-md px-3 py-2 flex flex-col">
              <div className="flex gap-5 text-xl">
                {!(openFiles.length === 0) &&
                  openFiles.map((fileName: string, index: number) => (
                    <div onClick={()=>setCurrentFile(fileName)} key={index} className="flex items-center justify-center gap-2 cursor-pointer">
                      <p>{fileName.toString()}</p>
                      <LucideCross
                        onClick={() => {
                          let updatedOpenFiles = openFiles.filter((e)=>{
                            e !== fileName;
                          })
                          console.log(updatedOpenFiles);
                        }}
                        className="rotate-45 h-5 w-5"
                      />
                    </div>
                  ))}
              </div>
              <Separator className="my-2" />
              <div className="flex-1 py-5 px-6 text-lg">
                {fileTree[currentFile] && (
                  <textarea
                    className="bg-transparent w-full h-full ring-0"
                    draggable={false}
                    value={fileTree[currentFile].content}
                    onChange={(e) => {
                      setFileTree({
                        ...fileTree,
                        [currentFile]: {
                          content: e.target.value,
                        },
                      });
                    }}
                  ></textarea>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;
