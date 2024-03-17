import {Routes, Route} from 'react-router-dom';
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import Main from "./main";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import Protected from "@src/containers/protected";
import Modals from '../containers/modals';
import { ChatPage } from './chat-page';
import { CanvasPage } from './canvas-page';

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App(): React.ReactElement {

  const store = useStore();
  useInit(async () => {
    await store.actions.session.remind();
  })

  return (
    <>
      <Routes>
        <Route path={""} element={<Main />} />
        <Route path={"/articles/:id"} element={<Article />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/draw"} element={<CanvasPage />} />
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
      </Routes>

      <Modals />
    </>
  );
}

export default App;
