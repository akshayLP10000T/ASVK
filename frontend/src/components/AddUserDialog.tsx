import { Loader2, UserPlus2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import axios from "@/config/axios";
import Collaborator from "./Collaborator";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { ProjectType } from "@/types/project";

interface AddUserDialogInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
  setProject: React.Dispatch<
    React.SetStateAction<ProjectType | null | undefined>
  >;
  collaborators: User[];
}

const AddUserDialog = (data: AddUserDialogInterface) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [addingUsersId, setAddingUserId] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersExcludingCollaborators, setUsersExcludingCollaborators] =
    useState<User[]>([]);

  useEffect(() => {
    const getAllUsers = async () => {
      await axios
        .get("/users/all")
        .then((res: any) => {
          setAllUsers(res.data.users);
          const nonCollaborators = allUsers.filter(
            (user: User) =>
              !data.collaborators.some(
                (collaborator) => collaborator._id === user._id
              )
          );
          setUsersExcludingCollaborators(nonCollaborators);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };

    getAllUsers();
  }, [data.collaborators]);

  const addCollaboratorHandler = async () => {
    setLoading(true);
    await axios
      .put("/projects/add-user", {
        projectId: data.projectId,
        users: addingUsersId,
      })
      .then((res: any) => {
        console.log(res);
        data.setProject(res.data.project);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });

    data.setOpen(false);
  };

  return (
    <Dialog open={data.open} onOpenChange={data.setOpen}>
      <DialogTrigger>
        <UserPlus2Icon size={29} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select The users to add them to project</DialogTitle>
          <DialogDescription>Select from below</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-auto">
          {usersExcludingCollaborators?.map((user) => (
            <div key={user._id} className="cursor-pointer relative">
              <Collaborator user={user} />
              <Checkbox
                onClick={() => {
                  setAddingUserId((prev) => {
                    if (prev.includes(user._id)) {
                      return prev.filter((id) => id !== user._id);
                    } else {
                      return [...prev, user._id];
                    }
                  });
                }}
                checked={addingUsersId.includes(user._id)}
                className="absolute top-1/2 right-3 -translate-y-1/2"
              />
            </div>
          ))}
        </div>
        {addingUsersId.length !== 0 && !loading && (
          <Button onClick={addCollaboratorHandler}>Add Users</Button>
        )}
        {addingUsersId.length !== 0 && loading && (
          <Button disabled>
            <Loader2 className="animate-spin" /> Please Wait...
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
