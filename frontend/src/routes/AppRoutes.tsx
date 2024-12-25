import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Project from "@/pages/Project";
import Register from "@/pages/Register";
import { Route, BrowserRouter, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/:projectId" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
