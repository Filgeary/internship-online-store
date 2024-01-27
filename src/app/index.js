import {useCallback, useContext, useEffect, useState} from 'react';
import {Routes, Route} from 'react-router-dom';
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import Main from "./main";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import Protected from "@src/containers/protected";
import Modals from './modals';

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App() {

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
