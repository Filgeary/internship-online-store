import { Routes, Route } from "react-router-dom";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import Main from "./main";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import Protected from "@src/containers/protected";
import Modals from "../containers/modals";
import { ChatPage } from "./chat-page";
import { CanvasPage } from "./canvas-page";
import { WebWorkerPage } from "./worker";
import { Suspense, lazy } from "react";
import { Overview } from "@src/admin/layout/content/overview";
import { Users } from "@src/admin/layout/content/users";
import { Products } from "@src/admin/layout/content/products";
import { ConfigProvider } from "antd";

const AdminPanel = lazy(() => import("./admin"));

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App(): React.ReactElement {
  const store = useStore();
  useInit(async () => {
    await store.actions.session.remind();
  }, []);

  return (
    <>
      <Routes>
        <Route path={""} element={<Main />} />
        <Route path={"/articles/:id"} element={<Article />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/draw"} element={<CanvasPage />} />
        <Route path={"/worker"} element={<WebWorkerPage />}></Route>
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
              <ChatPage />
            </Protected>
          }
        />
        <Route
          path={"/admin"}
          element={
            <Protected redirect="/login">
              <Suspense fallback={<div>loading...</div>}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#6366f1",
                    },
                  }}
                >
                  <AdminPanel />
                </ConfigProvider>
              </Suspense>
            </Protected>
          }
        >
          <Route path="" element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>

      <Modals />
    </>
  );
}

export default App;
