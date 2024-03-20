import React from 'react'
import {Providers} from "./provider";
import {router} from "./route";
import './index.scss'
import ModalWindow from "@src/pages/modal-window";


function App (): React.JSX.Element {
  return <>
    <Providers router={router}/>
    <ModalWindow/>
  </>
}

export default App;
