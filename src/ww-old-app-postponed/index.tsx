import React from "react";
import {Route, Routes} from 'react-router-dom';
import useStore from "../ww-old-hooks-postponed/use-store";
import useInit from "../ww-old-hooks-postponed/use-init";
import Main from "./main";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import Protected from "@src/ww-old-containers/protected";
import ModalWindow from "@src/ww-old-containers/modal-window";
import Chat from "@src/ww-old-app-postponed/chat";
import Canvas from "@src/ww-old-app-postponed/canvas";

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App(): React.JSX.Element {

  const store = useStore();
  useInit(async () => {
    await store.actions.session.remind();
  }, []);

  return (
    <>
      <Routes>
        <Route path={''} element={
          <Main/>
        }/>
        <Route path={'/articles/:id'} element={
          <Article/>
        }/>
        <Route path={"/login"} element={
          <Login/>
        }/>
        <Route path={"/profile"} element={
          <Protected redirect='/login'>
            <Profile/>
          </Protected>
        }/>
        <Route path={"/chat"} element={
          <Protected redirect='/login'>
            <Chat/>
          </Protected>
        }/>
        <Route path={"/canvas"} element={
            <Canvas/>
        }/>
      </Routes>

      <ModalWindow/>
    </>
  );
}

export default App;
