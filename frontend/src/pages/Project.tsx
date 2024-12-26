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
import { UserPlus2Icon } from "lucide-react";

const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectType | null>();
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState([
    { id: 1, message: "Hi there! How can I assist you?", sender: "bot" },
    { id: 2, message: "I want to know more about your services.", sender: "user" },
    { id: 3, message: "I want to know more about your services.", sender: "user" },
    { id: 4, message: "I want to know more about your services.", sender: "user" },
    { id: 5, message: "I want to know more about your services.", sender: "user" },
    { id: 6, message: "I want to know more about your services.", sender: "user" },
    { id: 7, message: "Hi there! How can I assist you?", sender: "bot" },
    { id: 8, message: "Hi there! How can I assist you?", sender: "bot" },
    { id: 9, message: "Hi there! How can I assist you?", sender: "bot" },
    { id: 10, message: "Hi there! How can I assist you?", sender: "bot" },
    { id: 11, message: "Hi there! How can I assist you?", sender: "bot" },
    { id: 12, message: "Hi there! How can I assist you?", sender: "bot" },
    { id: 13, message: "Hi there! How can I assist you?", sender: "bot" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
  }, []);

  return (
    <div className="overflow-hidden w-full h-screen">
      <DraggableBox users={collaborators} />
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
                <div className="cursor-pointer">
                  <UserPlus2Icon size={29} />
                </div>
          </div>
          <Separator />
          <div className="flex-1 py-3 glex-col flex-grow space-y-2 overflow-y-auto">
            {
              messages.map((msg)=>(
                <Message key={msg.id} message={msg.message} sender={msg.sender} />
              ))
            }
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
            {message.trim() !== "" && <Button type="submit">Send</Button>}
          </form>
        </div>
        <div className="flex-1 bg-blue-700"></div>
      </div>
    </div>
  );
};

export default Project;
