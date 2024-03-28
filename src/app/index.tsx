import { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import Protected from "@src/containers/protected";
import Modals from "@src/containers/modals";
import CanvasPage from "./canvas-page";
import Loading from "./loading";

// Синхронный импорт
import Main from "./main";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import Chat from "./chat-page";

// Динамический импорт станиц
//const Main = lazy(() => import("./main"));
//const Article = lazy(() => import("./article"));
//const Profile = lazy(() => import("./profile"));
//const Login = lazy(() => import("./login"));
//const Chat = lazy(() => import("./chat-page"));

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App(): React.ReactElement {
 // const [isClient, setIsClient] = useState("");
  const store = useStore();
  useInit(async () => {
 //   setIsClient("true");
    await store.actions.session.remind();
  });

  return (
    <>
     {/*  {isClient && (
        <>
          <Suspense fallback={<Loading />}> */}
            <Routes>
              <Route path={"/"} element={<Main />} />
              <Route path={"/articles/:id"} element={<Article />} />
              <Route path={"/login"} element={<Login />} />
              <Route
                path={"/profile"}
                element={
                  <Protected redirect="/login">
                    <Profile />
                  </Protected>
                }
              />
              <Route
                path={"/chat"}
                element={
                  <Protected redirect="/login">
                    <Chat />
                  </Protected>
                }
              />
              <Route path={"/canvas"} element={<CanvasPage />} />
            </Routes>
          <Modals />
        {/*   </Suspense>
        </>
      )} */}
    </>
  );
}

export default App;
