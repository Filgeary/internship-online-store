import {createBrowserRouter} from "react-router-dom";
import Main from "@src/pages/main/index";
import Article from "@src/pages/article/index";
import Login from "@src/pages/login/index";
import React from "react";
import Protected from "@src/feature/protected";
import Profile from "@src/pages/profile/index";
import Chat from "@src/pages/chat/index";
import Canvas from "@src/pages/canvas/index";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Main/>,
  },
  {
    path: "/articles/:id",
    element: <Article/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/profile",
    element: <Protected redirect='/login'>
      <Profile/>
    </Protected>
  },
  {
    path: "/chat",
    element: <Protected redirect='/login'>
      <Chat/>
    </Protected>
  },
  {
    path: "/canvas",
    element: <Canvas/>
  },
]);
