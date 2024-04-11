import type { ThemeConfig } from 'antd';
import { ConfigProvider } from 'antd';
import { Route, Routes } from 'react-router-dom';

import Protected from '@src/containers/protected';
import useInit from '@src/hooks/use-init';
import useStore from '@src/hooks/use-store';
import Admin from './admin';
import Article from './article';
import CanvasPage from './canvas-page';
import ChatPage from './chat-page';
import Login from './login';
import Main from './main';
import Modals from './modals';
import Profile from './profile';

const themeToken: ThemeConfig['token'] = { fontFamily: 'system-ui', fontWeightStrong: 500 };

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
        <Route
          path={'/admin/*'}
          element={
            <Protected redirect='/login'>
              <ConfigProvider theme={{ token: themeToken }}>
                <Admin />
              </ConfigProvider>
            </Protected>
          }
        />
        <Route
          path={'*'}
          element={<Main />}
        />
      </Routes>

      <Modals />
    </>
  );
}

export default App;
