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

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App() {
  const store = useStore();
  const contentRef = useRef(null);

  useInit(async () => {
    store.make('separateCatalog', 'catalog');

    await Promise.all([
      // store.actions.separateCatalog.initParams(),
      store.actions.catalog.initParams(),

      store.actions.categories.load(),
      store.actions.session.remind(),
    ]);
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
        </Routes>
      </div>

      <AllModals toDisableFocus={contentRef} />
    </>
  );
}

export default App;
