import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Routes, Route} from 'react-router-dom';
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import Main from "./main";
import Basket from "./basket";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import Protected from "@src/containers/protected";
import {useDispatch, useSelector as useSelectorRedux} from 'react-redux';
import AddToBasketDialog from './add-to-basket-dialog';
import modalsActions from '@src/store-redux/modals/actions';

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

  const dispatch = useDispatch()
  const ref = useRef({ resolve: () => {} })
  const callbacks = {
    openAddToBasketDialog: useCallback(() => {
      return new Promise((res) => {
        dispatch(modalsActions.open('add-to-basket-dialog'))
        ref.current = { resolve: res }
      })
    }, [dispatch]),
    cancelBasketDialog: useCallback(() => {
      dispatch(modalsActions.close())
      ref.current.resolve()
    }, [dispatch]),
    submitBasketDialog: useCallback((value) => {
      dispatch(modalsActions.close())
      ref.current.resolve(value)
    }, [dispatch])
  }

  return (
    <>
      <Routes>
        <Route path={''} element={<Main openAddToBasketDialog={callbacks.openAddToBasketDialog}/>}/>
        <Route path={'/articles/:id'} element={<Article/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/profile"} element={<Protected redirect='/login'><Profile/></Protected>}/>
      </Routes>

      {activeModal === 'basket' && <Basket/>}
      {activeModal === 'add-to-basket-dialog' 
        && <AddToBasketDialog cancelBasketDialog={callbacks.cancelBasketDialog}
                              submitBasketDialog={callbacks.submitBasketDialog}/>}
      
    </>
  );
}

export default App;
