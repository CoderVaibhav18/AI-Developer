// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import UserProtected from "../pages/UserProtected";
import Project from "../pages/Project";
// import Logout from "../pages/Logout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserProtected>
              <Home />
            </UserProtected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/project"
          element={
            <UserProtected>
              <Project />
            </UserProtected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
