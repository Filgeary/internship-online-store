import { useRef } from 'react';

import { Routes, Route } from 'react-router-dom';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';
import Main from './main';
import Article from './article';
import Login from './login';
import Profile from './profile';
import Protected from '@src/containers/protected';

import AllModals from '@src/containers/all-modals';
import Community from './community';

/**
 * Приложение
 */
function App() {
  const store = useStore();
  const contentRef = useRef(null);

  useInit(async () => {
    await store.actions.session.remind();
  });

  return (
    <>
      <div ref={contentRef}>
        <Routes>
          <Route path={''} element={<Main />} />
          <Route path={'/articles/:id'} element={<Article />} />
          <Route path={'/login'} element={<Login />} />
          <Route
            path={'/profile'}
            element={
              <Protected redirect='/login'>
                <Profile />
              </Protected>
            }
          />
          <Route
            path={'/community'}
            element={
              <Protected redirect='/login'>
                <Community />
              </Protected>
            }
          />
        </Routes>
      </div>

      <AllModals toDisableFocus={contentRef} />
    </>
  );
}

export default App;
