import {Routes, Route} from 'react-router-dom';
import useStore from "../hooks/use-store";
import useInit from "../hooks/use-init";
import Protected from "../containers/protected";
import Modals from '../containers/modals';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';

// import Main from "./main";
// import Article from "./article";
// import Login from "./login";
// import Profile from "./profile";
// import Chat from './chat';
// import Canvas from './canvas';

const Main = lazy(() => import('./main'));
const Article = lazy(() => import('./article'));
const Login = lazy(() => import('./login'));
const Profile = lazy(() => import('./profile'));
const Chat = lazy(() => import('./chat'));
const Canvas = lazy(() => import('./canvas'));
const Webworker = lazy(() => import('./webworker'));
const CMSRouter = lazy(() => import('../cms/cms-router'));

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App() {

  const store = useStore();
  if(typeof window !== "undefined"){
    useInit(async () => {
      await store.actions.session.remind();
    })
  }

  return (
    <>
      <Suspense fallback={<Spin fullscreen={true} />}>
        <Routes>
          <Route path={''} element={<Main/>}/>
          <Route path={'/articles/:id'} element={<Article/>}/>
          <Route path={"/login"} element={<Login/>}/>
          <Route path={"/profile"} element={<Protected redirect='/login'><Profile/></Protected>}/>
          <Route path={"/chat"} element={<Protected redirect='/login'><Chat/></Protected>}/>
          <Route path={"/canvas"} element={<Canvas/>}/>
          <Route path={"/webworker"} element={<Webworker/>}/>
          <Route path={"/admin/*"} element={<Protected redirect='/login'><CMSRouter /></Protected>} />
        </Routes>
      </Suspense>

      <Modals />
    </>
  );
}

export default App;
