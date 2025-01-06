import { ModeToggle } from "@/components/toggleMode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "@/config/axios";
import { useUser } from "@/context/user.context";
import { ProjectType } from "@/types/project";
import { User } from "@/types/user";
import { Loader2, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useUser();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const navigate = useNavigate();

  const createProjectHandler = () => {
    setLoading(true);

    axios
      .post("/projects/create", { name })
      .then((res: any) => {
        console.log(res);
        setName("");
        setOpen(false);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  };

  const logoutHandler = async () => {
    axios
      .get("/users/logout")
      .then((_: any) => {
        localStorage.removeItem("token");
        navigate("/login", {
          replace: true,
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getAllProjects = async () => {
      await axios
        .get("/projects/all")
        .then((res: any) => {
          setProjects(res.data.projects);
        })
        .catch((err: any) => {
          console.log(err.response);
        });
    };
    getAllProjects();
  }, []);

  return (
    <div className="p-6 w-full h-screen">
      <div className="flex justify-between items-center w-full">
        <div className="text-xl font-bold flex gap-3 items-center cursor-pointer">
          <User2Icon />
          {user?.username}
        </div>
        <div className="items-center flex gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger className="border-[1px] px-3 py-2 shadow-sm rounded-md text-sm font-semibold dark:hover:bg-zinc-800 hover:bg-zinc-100 duration-100 transition-colors">
              Project Requests
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Requests</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Akshay</DropdownMenuItem>
              <DropdownMenuItem>Mast Insaan</DropdownMenuItem>
              <DropdownMenuItem>Broo</DropdownMenuItem>
              <DropdownMenuItem>Okay</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">New Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new Project</DialogTitle>
                <DialogDescription>
                  Create a project and add collaborators to work together
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="name"
                    className="text-right block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="col-span-3 w-full mt-1 p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <DialogFooter>
                {loading ? (
                  <Button
                    disabled
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="submit"
                  >
                    <Loader2 className="animate-spin" /> Please wait...
                  </Button>
                ) : (
                  <Button
                    onClick={createProjectHandler}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="submit"
                  >
                    Save changes
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ModeToggle />
          <Button onClick={logoutHandler}>Logout</Button>
        </div>
      </div>
      <Separator className="my-3" />
      <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
          {projects.map((project) => (
            <Card
              onClick={() => navigate(`/project/${project._id}`)}
              key={project._id}
              className="bg-white dark:bg-zinc-800 shadow-md hover:shadow-2xl duration-200 transition-all rounded-lg cursor-pointer hover:scale-105"
            >
              <CardHeader className="border-b p-4">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                  {project.name}
                </h3>
              </CardHeader>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                  Collaborators:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.users.map((user: User) => (
                    <TooltipProvider key={user._id}>
                      <Tooltip key={user._id}>
                        <TooltipTrigger>
                          <Avatar className="w-10 h-10 border border-zinc-300 dark:border-zinc-700">
                            <AvatarImage
                              src={`https://api.dicebear.com/5.x/bottts/svg?seed=${user.username}`}
                              alt={user.username}
                            />
                            <AvatarFallback>
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent className="text-sm bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100">
                          {user.username} <br />
                          <span className="text-xs text-zinc-500">
                            {user.email}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
