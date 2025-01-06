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

const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectType | null>();
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [addUserDialog, setAddUserDialog] = useState<boolean>(false);
  const { user } = useUser();

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
    initializeSocket(projectId!);

    receiveMessage("project-message", (data: any) => {
      console.log(data);
    });
  }, []);

  const sendMessageHandler = () => {
    sendMessage("project-message", {
      message,
      sender: user?._id,
      username: user?.username,
    });
    setMessage("");
  };

  return (
    <div className="overflow-hidden w-full h-screen">
      <DraggableBox key={project?._id} users={collaborators} />
      <div className="absolute right-3 top-3">
        <ModeToggle />
      </div>
      <div className="flex w-full h-full">
        <div className="min-w-96 flex flex-col px-3 py-2">
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
              <Message key={key} message={msg?.message} username={msg?.username} sender={msg?.sender} />
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          <form className="flex gap-2">
            <Input
              placeholder="Message..."
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="message"
            />
            {message.trim() !== "" && (
              <Button onClick={sendMessageHandler} type="submit">
                Send
              </Button>
            )}
          </form>
        </div>
        <div className="flex-1 bg-blue-700"></div>
      </div>
    </div>
  );
};

export default Project;
