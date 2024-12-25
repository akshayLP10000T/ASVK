import { useParams } from "react-router-dom";
import axios from "@/config/axios";
import { useEffect, useState } from "react";
import { ProjectType } from "@/types/project";

const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectType | null>();

  useEffect(() => {
    const getProjectData = async () => {
      axios
        .get(`/projects/get-project/${projectId}`)
        .then((res: any) => {
            setProject(res.data.project);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };

    getProjectData();
  }, []);

  return <div>{
    project?.toString()
  }</div>;
};

export default Project;
