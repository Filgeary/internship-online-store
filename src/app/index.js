import {Routes, Route} from 'react-router-dom';
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import Main from "./main";
import Basket from "./basket";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import Protected from "@src/containers/protected";
import {useSelector as useSelectorRedux} from 'react-redux';

import CountToAdd from '@src/containers/count-to-add';

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App() {

  const store = useStore();
  useInit(async () => {
    await store.actions.session.remind();
  })

  const activeModal = useSelectorRedux(state => state.modals.name);

  return (
    <>
      <Routes>
        <Route path={''} element={<Main/>}/>
        <Route path={'/articles/:id'} element={<Article/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/profile"} element={<Protected redirect='/login'><Profile/></Protected>}/>
      </Routes>

      {activeModal === 'basket' && <Basket/>}
      {activeModal === 'countToAdd' && <CountToAdd />}
    </>
  );
}

export default App;
