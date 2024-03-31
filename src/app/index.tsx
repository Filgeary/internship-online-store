import { Route, Routes } from 'react-router-dom';

import useInit from '@src/hooks/use-init';
import useStore from '@src/hooks/use-store';
import { protectedRoutes } from '@src/routes/protected';
import { publicRoutes } from '@src/routes/public';
import Modals from './modals';

function App() {
  const store = useStore();

  useInit(
    async () => {
      await store.actions.session.remind();
    },
    [],
    {
      ssrKey: 'app',
    },
  );

  return (
    <>
      <Routes>
        {publicRoutes.map(({ path, element: Component }) => (
          <Route
            key={path}
            path={path}
            element={<Component />}
          />
        ))}

        {protectedRoutes.map(({ path, element: Component }) => (
          <Route
            key={path}
            path={path}
            element={<Component.render />}
          />
        ))}
      </Routes>

      <Modals />
    </>
  );
}

export default App;
