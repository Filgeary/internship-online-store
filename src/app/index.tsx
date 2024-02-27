import {Routes, Route} from 'react-router-dom';
import useStore from "../hooks/use-store";
import useInit from "../hooks/use-init";
import Main from "./main";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import Protected from "../containers/protected";
import Modals from '../containers/modals';
import Chat from './chat';

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
        <Route path={''} element={<Main/>}/>
        <Route path={'/articles/:id'} element={<Article/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/profile"} element={<Protected redirect='/login'><Profile/></Protected>}/>
        <Route path={"/chat"} element={<Protected redirect='/login'><Chat/></Protected>}/>
      </Routes>

      <Modals />
    </>
  );
}

export default App;
