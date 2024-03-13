import React from "react";
import {RouterProvider} from "react-router-dom";

type Props = {
  router: any,
}

export const Providers = ({ router }: Props) => {
  return (
      <RouterProvider router={router}/>
  )
}
