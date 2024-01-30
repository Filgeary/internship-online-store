import { Route, Routes } from "react-router-dom";

import Protected from "@src/containers/protected";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import Article from "./article";
import Login from "./login";
import Main from "./main";
import Modals from "./modals";
import Profile from "./profile";

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App() {
  const store = useStore();

  useInit(async () => {
    await store.actions.session.remind();
  });

  return (
    <>
      <Routes>
        <Route path={""} element={<Main />} />
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
      </Routes>

      <Modals />
    </>
  );
}

export default App;
