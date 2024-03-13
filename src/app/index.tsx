import React from 'react'
import {router} from "./route";
import './global.css'
import {Providers} from "@src/app/provider";


function App (): React.JSX.Element {
  return <Providers router={router}/>
}

export default App;
