import {createBrowserRouter} from "react-router-dom";
import Main from "@src/pages/main/page";
import Article from "@src/pages/article/page";
import Login from "@src/pages/login/page";
import Profile from "@src/ww-old-app-postponed/profile";
import Protected from "@src/ww-old-containers/protected";
import React from "react";
import Chat from "@src/ww-old-app-postponed/chat";
import Canvas from "@src/ww-old-app-postponed/canvas";

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
