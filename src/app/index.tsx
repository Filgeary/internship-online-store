import { lazy, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';

import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';

import Protected from '@src/containers/protected';
import AllModals from '@src/containers/all-modals';

import withLoader from '@src/hoc/with-loader';

const LazyMain = withLoader(lazy(() => import('./main')));
const LazyCommunity = withLoader(lazy(() => import('./community')));
const LazyArticle = withLoader(lazy(() => import('./article')));
const LazyLogin = withLoader(lazy(() => import('./login')));
const LazyProfile = withLoader(lazy(() => import('./profile')));
const LazyArt = withLoader(lazy(() => import('./art')));

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
          <Route path={''} element={<LazyMain />} />
          <Route path={'/articles/:id'} element={<LazyArticle />} />
          <Route path={'/login'} element={<LazyLogin />} />
          <Route
            path={'/profile'}
            element={
              <Protected redirect='/login'>
                <LazyProfile />
              </Protected>
            }
          />
          <Route
            path={'/community'}
            element={
              <Protected redirect='/login'>
                <LazyCommunity />
              </Protected>
            }
          />
          <Route path={'/art'} element={<LazyArt />} />
        </Routes>
      </div>

      <AllModals toDisableFocus={contentRef} />
    </>
  );
}

export default App;
