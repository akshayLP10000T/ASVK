import { useUser } from "@/context/user.context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactNode } from "react";

interface UserAuthProps {
  children: ReactNode;
}

const UserAuth = ({children}: UserAuthProps) => {
  const {user} = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        replace: true,
      });
    }

    if (!user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserAuth;
