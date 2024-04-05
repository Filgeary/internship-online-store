import { lazy } from 'react';

const Article = lazy(() => import('../app/article'));
const CanvasPage = lazy(() => import('../app/canvas'));
const Login = lazy(() => import('../app/login'));
const Main = lazy(() => import('../app/main'));

export const publicRoutes = [
  {
    path: '',
    element: Main,
  },
  {
    path: '/canvas',
    element: CanvasPage,
  },
  {
    path: '/articles/:id',
    element: Article,
  },
  {
    path: '/login',
    element: Login,
  },
];
