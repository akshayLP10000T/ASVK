import { ModeToggle } from "@/components/toggleMode";
import { Button } from "@/components/ui/button";
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
import axios from "@/config/axios";
import { useUser } from "@/context/user.context";
import { Loader2, User2Icon } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useUser();

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

  return (
    <div className="p-6 w-full h-screen">
      <div className="flex justify-between items-center w-full">
        <div className="text-xl font-bold flex gap-3 items-center cursor-pointer">
          <User2Icon />
          {user?.username}
        </div>
        <div className="items-center flex gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger className="border-[1px] px-3 py-2 shadow-sm rounded-md text-sm font-semibold dark:hover:bg-gray-800 hover:bg-gray-100 duration-100 transition-colors">
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
        </div>
      </div>
      <Separator className="my-3" />
      <div></div>
    </div>
  );
};

export default Home;
