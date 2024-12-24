import { useUser } from "@/context/user.context";

const Home = () => {
  const { user } = useUser();

  return (
    <div>
      {JSON.stringify(user)}
      <p>{user?.username}</p>
    </div>
  );
};

export default Home;
