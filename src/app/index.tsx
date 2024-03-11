import { Route, Routes } from 'react-router-dom';

import Protected from '@src/containers/protected';
import useInit from '@src/hooks/use-init';
import useStore from '@src/hooks/use-store';
import Article from './article';
import CanvasPage from './canvas-page';
import ChatPage from './chat-page';
import Login from './login';
import Main from './main';
import Modals from './modals';
import Profile from './profile';

function App() {
  const store = useStore();

  useInit(async () => {
    await store.actions.session.remind();
  });

  return (
    <>
      <Routes>
        <Route
          path={''}
          element={<Main />}
        />
        <Route
          path={'/canvas'}
          element={<CanvasPage />}
        />
        <Route
          path={'/articles/:id'}
          element={<Article />}
        />
        <Route
          path={'/login'}
          element={<Login />}
        />
        <Route
          path={'/profile'}
          element={
            <Protected redirect='/login'>
              <Profile />
            </Protected>
          }
        />
        <Route
          path={'/chat'}
          element={
            <Protected redirect='/login'>
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
