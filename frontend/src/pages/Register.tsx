import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/config/axios";
import { useUser } from "@/context/user.context";
import { RegisterForm } from "@/types/form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onValueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("/users/register", formData)
      .then((res: any) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setLoading(false);

        navigate("/", {
          replace: true,
        });
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center">
          Register
        </h2>
        <form className="mt-6 space-y-4" onSubmit={submitHandler}>
          {/* Username */}
          <div>
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Username
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={onValueChangeHandler}
              className="w-full mt-1 p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onValueChangeHandler}
              className="w-full mt-1 p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onValueChangeHandler}
              className="w-full mt-1 p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onValueChangeHandler}
              className="w-full mt-1 p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div>
            {loading ? (
              <Button
                disabled
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Loader2 className="animate-spin" /> Please Wait...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Register
              </Button>
            )}
          </div>
        </form>
        <div className="w-full h-fit text-end mt-1">
          <p>
            Already a user?{" "}
            <Link
              to={"/login"}
              className="dark:text-blue-400 hover:dark:text-blue-500 text-blue-500 hover:text-blue-400 underline transition-colors duration-150"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
